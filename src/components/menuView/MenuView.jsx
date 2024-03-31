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
    <div className="grey-gredient mx-auto pb-5 sm:w-full md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3  parent-container ">
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
          className="items-added-box flex flex-col sm:flex-row justify-between items-center fixed bottom-0"
          onClick={() => navigate(`/menu-view/${id}/order`)}
        >
          <span className="sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
            Items added ({cartItems.length}){" "}
          </span>
          <div className="flex items-center">
            <span className="sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
              View Order{" "}
            </span>
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

                          <QuantitySelector
                            itemId={item._id}
                            queryClient={queryClient}
                            id={id}
                            setLocalMenuData={setLocalMenuData}
                            quantity={item.quantity}
                          />
                        </Col>
                        <Col span={12}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                position: "relative",
                              }}
                            >
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
