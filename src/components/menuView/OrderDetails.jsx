import { io } from "socket.io-client";
import PropTypes from "prop-types";
import { toast, ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { MdDelete } from "react-icons/md";
import { createOrder } from "../../api/PublicRequest";
import "./OrderDetails.css";
// import { Typography } from "antd";
// const { Title } = Typography;

const OrderDetails = () => {
  const socket = io(import.meta.env.VITE_REACT_APP_SERVER_URL);
  const { id } = useParams();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");
  const [orderReadyStatus, setOrderReadyStatus] = useState("");

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
    // Listen for 'mealPreparationStarted' events
    socket.on("mealPreparationStarted", () => {
      // Update the order status to 'Meals preparation started'
      setOrderStatus("Meals preparation started");
    });

    // Listen for 'orderReady' events
    socket.on("orderReady", () => {
      // Update the order status to 'ORDER READY'
      setOrderReadyStatus("ORDER READY");
    });
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleOrder = async () => {
    socket.emit("orders", { tableID: id, orders: cartItems });
    console.log("Order sent to server", id, cartItems);

    // Call the createOrder function when the ORDER button is clicked
    try {
      const response = await createOrder(id, { orders: cartItems });
      console.log(response.data.message); // Log the success message
      if (response.data.success) {
        toast.success("Order Received");
      }
    } catch (error) {
      console.error(error); // Log any errors
    }

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
      {orderStatus && <p>{orderStatus}</p>}
      {orderReadyStatus && <p>{orderReadyStatus}</p>}
      <ToastContainer />
    </div>
  );
};

export default OrderDetails;
