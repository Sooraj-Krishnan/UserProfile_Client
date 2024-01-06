import { io } from "socket.io-client";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { MdDelete } from "react-icons/md";
import "./OrderDetails.css";
// import { Typography } from "antd";
// const { Title } = Typography;

const OrderDetails = () => {
  const socket = io(import.meta.env.VITE_REACT_APP_SERVER_URL);
  const { id } = useParams();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleOrder = () => {
    socket.emit("orders", { tableID: id, orders: cartItems });
    console.log("Order sent to server", id, cartItems);
    // localStorage.removeItem("cartItems");
    // setCartItems([]);
  };

  const Cart = ({ cartItems }) => {
    const totalAmount = cartItems.reduce((total, item) => {
      return total + parseInt(item.price.split(" ")[0]) * item.quantity;
    }, 0);

    const handleDelete = (indexToDelete) => {
      const newCartItems = cartItems.filter(
        (item, index) => index !== indexToDelete
      );
      setCartItems(newCartItems);
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    };

    return (
      <div>
        {cartItems.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <p>{item.itemName}</p>
              <p>
                Price: {parseInt(item.price.split(" ")[0]) * item.quantity}{" "}
                {item.price.split(" ")[1]}
              </p>
            </div>
            <button
              onClick={() => handleDelete(index)}
              style={{ marginLeft: "20px" }}
            >
              <MdDelete />
            </button>
          </div>
        ))}
        <hr />
        <p>Total Amount : {totalAmount}</p>
      </div>
    );
  };
  Cart.propTypes = {
    cartItems: PropTypes.arrayOf(
      PropTypes.shape({
        itemName: PropTypes.string,
        price: PropTypes.string,
        quantity: PropTypes.number,
      })
    ),
  };
  return (
    <div style={{ width: "390px", margin: "0 auto", textAlign: "center" }}>
      <p
        className="text-md mr-5 h-12  pt-2 px-3 rounded-full border  font-medium cursor-pointer"
        onClick={handleBack}
        style={{ marginBottom: "20px" }}
      >
        <ArrowLeftOutlined />
      </p>
      <Cart cartItems={cartItems} />
      <button className="items-order-button" onClick={handleOrder}>
        ORDER
      </button>
    </div>
  );
};

export default OrderDetails;
