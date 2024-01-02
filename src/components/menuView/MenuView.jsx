import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { menuView } from "../../api/PublicRequest";
import { Typography, Row, Col } from "antd";
// import MenuItemDetails from "./MenuItemDetails";
import "./MenuView.css";
const { Title } = Typography;

const MenuView = () => {
  const { id } = useParams();
  const [menuData, setMenuData] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      const { data } = await menuView(id);
      console.log("data", data.data);
      //  setMenuData(data.data);
      const menuDataWithQuantity = {
        ...data.data,
        menuItems: data.data.menuItems.map((menuItem) => ({
          ...menuItem,
          items: menuItem.items.map((item) => ({ ...item, quantity: 1 })),
        })),
      };
      setMenuData(menuDataWithQuantity);
    };
    fetchMenu();
  }, [id]);

  const incrementQuantity = (menuItemIndex, itemIndex) => {
    const newMenuData = { ...menuData };
    newMenuData.menuItems[menuItemIndex].items[itemIndex].quantity++;
    setMenuData(newMenuData);
  };

  const decrementQuantity = (menuItemIndex, itemIndex) => {
    const newMenuData = { ...menuData };
    if (newMenuData.menuItems[menuItemIndex].items[itemIndex].quantity > 1) {
      newMenuData.menuItems[menuItemIndex].items[itemIndex].quantity--;
    }
    setMenuData(newMenuData);
  };

  return (
    <div className="bg-gray-200" style={{ width: "600px", margin: "0 auto" }}>
      <div className="flex space-x-4 justify-center">
        <div className="rectangle-button">
          <button onClick={() => setSelectedLabel(null)}>All</button>
        </div>
        {menuData &&
          menuData.menuItems &&
          menuData.menuItems.map((menuItem, index) => (
            <div className="rectangle-button" key={index}>
              <button onClick={() => setSelectedLabel(menuItem.label)}>
                {menuItem.label}
              </button>
            </div>
          ))}
      </div>
      {menuData &&
        menuData.menuItems &&
        (selectedLabel
          ? menuData.menuItems.filter(
              (menuItem) => menuItem.label === selectedLabel
            )
          : menuData.menuItems
        ).map((menuItem, menuItemIndex) => (
          <div key={menuItemIndex} className="m-8">
            <Title level={1}>{menuItem.label}</Title>
            {menuItem.items.map((item, itemIndex) => {
              const [price, unit] = item.price.split(" ");
              return (
                <Row key={itemIndex}>
                  <Col span={12}>
                    <Title level={3}>{item.itemName}</Title>
                    <p>{item.description}</p>
                    <p>
                      Price: {parseInt(price) * item.quantity} {unit}
                    </p>
                    <div className="quantity-button">
                      {/* Quantity Adjustment Buttons */}
                      <button
                        onClick={() =>
                          decrementQuantity(menuItemIndex, itemIndex)
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          incrementQuantity(menuItemIndex, itemIndex)
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="quantity-button">
                      <button>Add</button>
                    </div>
                  </Col>
                  <Col span={12}>
                    <img
                      className="m-2"
                      src={item.itemImage}
                      alt={item.itemName}
                    />
                  </Col>
                </Row>
              );
            })}
          </div>
        ))}
    </div>
  );
};

export default MenuView;
