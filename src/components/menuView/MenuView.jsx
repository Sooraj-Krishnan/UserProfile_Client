import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { menuView } from "../../api/PublicRequest";
import { Typography, Row, Col, Input, Space } from "antd";
import { FaGreaterThan } from "react-icons/fa6";
import "./MenuView.css";
import { addToCart } from "./MenuFunction";
import QuantitySelector from "./QuantityButton";

const { Title } = Typography;
const { Search } = Input;

const MenuView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [, setLocalMenuData] = useState(null);
  const [showAddItemsBox, setShowAddItemsBox] = useState(false);

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
  const onSearch = (value) => setSearchTerm(value);

  return (
    <div
      className="grey-gredient"
      style={{
        width: "390px",
        margin: "auto",
        paddingBottom: "20px",
      }}
    >
      <div style={{ textAlign: "center", marginTop: "15px" }}>
        <Space direction="vertical" style={{ width: "90%" }}>
          <Search placeholder="search for dishes" onSearch={onSearch} />
        </Space>
      </div>

      <div className="flex space-x-4 justify-center">
        <div
          className="label-rectangle-button rounded-full"
          style={{
            backgroundColor: selectedLabel === null ? "#b6f5fa" : "initial",
          }}
        >
          <button
            className="label-button-font"
            onClick={() => {
              setSelectedLabel(null);
              setSearchTerm("");
            }}
          >
            All
          </button>
        </div>
        {menuData &&
          menuData.menuItems &&
          menuData.menuItems.map((menuItem, index) => (
            <div
              className="label-rectangle-button rounded-full"
              key={index}
              style={{
                backgroundColor:
                  selectedLabel === menuItem.label ? "#b6f5fa" : "initial",
              }}
            >
              <button
                className="label-button-font"
                onClick={() => {
                  setSelectedLabel(menuItem.label);
                  setSearchTerm("");
                }}
              >
                {menuItem.label}
              </button>
            </div>
          ))}
      </div>
      {showAddItemsBox && (
        <div
          className="items-added-box"
          onClick={() => navigate(`/menu-view/${id}/order`)}
        >
          <span>Items added ({cartItems.length}) </span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>View Order </span>
            <FaGreaterThan />
          </div>
        </div>
      )}

      {(() => {
        let itemsFound = false;
        const menuItems =
          menuData &&
          menuData.menuItems &&
          (selectedLabel
            ? menuData.menuItems.filter(
                (menuItem) => menuItem.label === selectedLabel
              )
            : menuData.menuItems
          ).map((menuItem, menuItemIndex) => {
            const filteredItems = menuItem.items.filter((item) =>
              item.itemName
                .toLowerCase()
                .includes(searchTerm.toLowerCase().trim())
            );

            if (filteredItems.length > 0) {
              itemsFound = true;
              return (
                <div key={menuItemIndex} className="m-8 custom-font">
                  <p className="font-label-heading">{menuItem.label}</p>
                  {filteredItems.map((item, itemIndex) => {
                    const [price, unit] = item.price.split(" ");
                    return (
                      <Row key={itemIndex} className="my-10">
                        <Col span={12}>
                          <Title level={3} className="custom-font">
                            {item.itemName}
                          </Title>

                          <p className="price-font">
                            {parseInt(price) * item.quantity} {unit}
                          </p>
                          <p className="custom-font mb-2">{item.description}</p>
                          {/* <p>Quantity: {item.quantity}</p> */}

                          {/* <div className="quantity-button">
                            <button
                              onClick={() =>
                                decrementQuantity(
                                  item._id,
                                  queryClient,
                                  id,
                                  setLocalMenuData
                                )
                              }
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() =>
                                incrementQuantity(
                                  item._id,
                                  queryClient,
                                  id,
                                  setLocalMenuData
                                )
                              }
                            >
                              +
                            </button>
                          </div> */}

                          <QuantitySelector
                            itemId={item._id}
                            queryClient={queryClient}
                            id={id}
                            setLocalMenuData={setLocalMenuData}
                            quantity={item.quantity}
                          />
                        </Col>
                        <Col span={12}>
                          <div style={{ position: "relative" }}>
                            <img
                              className="m-2 square-image"
                              src={item.itemImage}
                              alt={item.itemName}
                            />
                            <div
                              className="quantity-button mt-2 justify-center"
                              style={{
                                position: "absolute",
                                bottom: "-20px",
                                left: "50%",
                                transform: "translateX(-50%)",
                              }}
                            >
                              <button
                                style={{
                                  color: "green",
                                  fontWeight: "bold",
                                  fontSize: "1.2rem",
                                }}
                                onClick={() =>
                                  addToCart(
                                    item._id,
                                    menuData,
                                    cartItems,
                                    setCartItems,
                                    () => setShowAddItemsBox(true) // Pass setShowAddItemsBox as a callback
                                  )
                                }
                              >
                                ADD
                              </button>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    );
                  })}
                </div>
              );
            }
            return null;
          });

        return itemsFound ? menuItems : <div>No items found...</div>;
      })()}
    </div>
  );
};
export default MenuView;
