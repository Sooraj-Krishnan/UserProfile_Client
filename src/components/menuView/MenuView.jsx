import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { menuView } from "../../api/PublicRequest";
import { Typography, Row, Col } from "antd";
import { FaShoppingCart } from "react-icons/fa";
import "./MenuView.css";
const { Title } = Typography;

const MenuView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [, setLocalMenuData] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: menuData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["menuView", id],
    queryFn: async () => {
      const { data } = await menuView(id);
      const menuDataWithQuantity = {
        ...data.data,
        menuItems: data.data.menuItems.map((menuItem) => ({
          ...menuItem,
          items: menuItem.items.map((item) => ({ ...item, quantity: 1 })),
        })),
      };
      return menuDataWithQuantity;
    },
  });

  useEffect(() => {
    if (menuData) {
      setLocalMenuData(menuData);
    }
  }, [menuData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error occurred while fetching data</div>;
  }

  const incrementQuantity = (menuItemIndex, itemIndex) => {
    queryClient.setQueryData(["menuView", id], (oldData) => {
      const updatedMenuData = { ...oldData };
      updatedMenuData.menuItems[menuItemIndex].items[itemIndex].quantity++;
      return updatedMenuData;
    });

    setLocalMenuData(queryClient.getQueryData(["menuView", id]));
  };

  const decrementQuantity = (menuItemIndex, itemIndex) => {
    setLocalMenuData((prevData) => {
      const updatedMenuData = { ...prevData };
      if (
        updatedMenuData.menuItems[menuItemIndex].items[itemIndex].quantity > 1
      ) {
        updatedMenuData.menuItems[menuItemIndex].items[itemIndex].quantity--;
      }
      queryClient.setQueryData(["menuView", id], updatedMenuData);
      return updatedMenuData;
    });
  };

  const addToCart = (itemId) => {
    const selectedItem = menuData.menuItems
      .flatMap((menuItem) => menuItem.items)
      .find((item) => item._id === itemId);
    const newCartItems = [...cartItems, selectedItem];
    setCartItems(newCartItems);
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
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
      <div style={{ marginLeft: "20px", marginTop: "-40px" }}>
        <FaShoppingCart
          size={30}
          onClick={() => navigate(`/menu-view/${id}/order`)}
        />
        {cartItems.length}
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
                    <div className="quantity-button mt-2 justify-center">
                      {/* <button onClick={() => addToCart(item)}>Add</button> */}
                      <button onClick={() => addToCart(item._id)}>Add</button>
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
