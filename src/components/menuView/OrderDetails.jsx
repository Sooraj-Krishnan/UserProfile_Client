// import { io } from "socket.io-client";
// import PropTypes from "prop-types";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Countdown from "react-countdown";
// import { ArrowLeftOutlined } from "@ant-design/icons";
// import { MdDelete } from "react-icons/md";
// import { createOrder } from "../../api/PublicRequest";
// import "./OrderDetails.css";
// import { Input } from "antd";

// const Cart = ({
//   cartItems,
//   handleSpecialInstructionsChange,
//   handleDelete,
//   specialInstructions,
// }) => {
//   const totalAmount = cartItems.reduce((total, item) => {
//     return total + parseInt(item.price.split(" ")[0]) * item.quantity;
//   }, 0);

//   return (
//     <div>
//       {cartItems.map((item, index) => (
//         <div
//           key={index}
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             marginBottom: "20px",
//           }}
//         >
//           <div>
//             <p>{item.itemName}</p>
//             <p>
//               Price: {parseInt(item.price.split(" ")[0]) * item.quantity}{" "}
//               {item.price.split(" ")[1]}
//             </p>
//           </div>
//           <button
//             onClick={() => handleDelete(index)}
//             style={{ marginLeft: "20px" }}
//           >
//             <MdDelete />
//           </button>
//         </div>
//       ))}
//       <hr />
//       <p>Total Amount : {totalAmount}</p>
//       <p>Do you want to add any special instruction?</p>
//       <div>
//         <Input.TextArea
//           value={specialInstructions || ""}
//           onChange={handleSpecialInstructionsChange}
//           placeholder="Enter special instructions here"
//         />
//       </div>
//     </div>
//   );
// };

// Cart.propTypes = {
//   cartItems: PropTypes.arrayOf(
//     PropTypes.shape({
//       itemName: PropTypes.string,
//       price: PropTypes.string,
//       quantity: PropTypes.number,
//     })
//   ),
//   handleSpecialInstructionsChange: PropTypes.func.isRequired,
//   handleDelete: PropTypes.func.isRequired,
//   specialInstructions: PropTypes.string,
// };

// const OrderDetails = () => {
//   const socket = io(import.meta.env.VITE_REACT_APP_SERVER_URL);
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [cartItems, setCartItems] = useState([]);
//   const [order, setOrder] = useState([]);
//   const [orderStatus, setOrderStatus] = useState("");
//   const [orderReadyStatus, setOrderReadyStatus] = useState("");
//   const [orderId, setOrderId] = useState(null);
//   const [isOrderPlaced, setIsOrderPlaced] = useState(false);
//   const [specialInstructions, setSpecialInstructions] = useState("");
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     const storedCartItems = localStorage.getItem("cartItems");
//     if (storedCartItems) {
//       setCartItems(JSON.parse(storedCartItems));
//     }
//     // Listen for 'mealPreparationStarted' events
//     socket.on("mealPreparationStarted", (data) => {
//       // Check if the orderId in the event data matches the orderId of the current order
//       if (data.orderId === orderId) {
//         // Update the order status to 'Meals preparation started'
//         setOrderStatus("Meals preparation started");

//         // Set the start time to the current time
//         setOrder((prevOrder) => ({ ...prevOrder, time: data.time }));
//         setIsReady(false);
//       }
//     });

//     // Listen for 'orderReady' events
//     socket.on("orderReady", (data) => {
//       // Check if the orderId in the event data matches the orderId of the current order
//       if (data.orderId === orderId) {
//         // Update the order status to 'ORDER READY'
//         setOrderReadyStatus("ORDER READY");
//         setIsReady(true);
//       }
//     });
//   }, [orderId]);

//   const handleBack = () => {
//     navigate(-1);
//   };

//   const handleSpecialInstructionsChange = (e) => {
//     setSpecialInstructions(e.target.value);
//   };

//   const handleDelete = (indexToDelete) => {
//     const newCartItems = cartItems.filter(
//       (item, index) => index !== indexToDelete
//     );
//     setCartItems(newCartItems);
//     localStorage.setItem("cartItems", JSON.stringify(newCartItems));
//   };

//   const handleOrder = async () => {
//     const cartItemsWithTotal = cartItems.map((item) => {
//       const totalAmount = parseInt(item.price.split(" ")[0]) * item.quantity;
//       return { ...item, totalAmount };
//     });

//     const totalAmount = cartItemsWithTotal.reduce(
//       (total, item) => total + item.totalAmount,
//       0
//     );

//     try {
//       const response = await createOrder(id, {
//         orders: cartItemsWithTotal,
//         specialInstructions,
//         totalAmount,
//       });
//       const orderId = response.data.orderID;
//       setOrderId(orderId);
//       socket.emit("orders", {
//         tableID: id,
//         orders: cartItems,
//         orderId,
//         specialInstructions,
//         totalAmount,
//       });
//       console.log(response.data.message);
//       if (response.data.success) {
//         toast.success("Order Received");
//         setIsOrderPlaced(true);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const renderer = ({ minutes, seconds, completed }) => {
//     if (completed) {
//       // Render a completed state
//       return <p>Time's up!</p>;
//     } else {
//       // Render a countdown
//       return (
//         <p>
//           Time remaining:{" "}
//           <span style={{ color: "red" }}>
//             {minutes}:{seconds < 10 ? "0" : ""}
//             {seconds}
//           </span>
//         </p>
//       );
//     }
//   };

//   return (
//     <div style={{ width: "390px", margin: "0 auto", textAlign: "center" }}>
//       <p
//         className="text-md mr-5 h-12  pt-2 px-3 rounded-full border  font-medium cursor-pointer"
//         onClick={handleBack}
//         style={{ marginBottom: "20px" }}
//       >
//         <ArrowLeftOutlined />
//       </p>
//       <Cart
//         cartItems={cartItems}
//         handleSpecialInstructionsChange={handleSpecialInstructionsChange}
//         handleDelete={handleDelete}
//         specialInstructions={specialInstructions}
//       />
//       <button
//         className="items-order-button"
//         onClick={handleOrder}
//         disabled={isOrderPlaced}
//       >
//         ORDER
//       </button>
//       {orderStatus && <p>{orderStatus}</p>}
//       {/* {orderStatus === "Meals preparation started" && order.time && (
//         <Countdown
//           date={Date.now() + order.time * 60 * 1000}
//           renderer={renderer}
//         />
//       )} */}
//       {orderStatus === "Meals preparation started" && !isReady && (
//         <Countdown
//           date={Date.now() + order.time * 60 * 1000}
//           renderer={renderer}
//         />
//       )}

//       {orderReadyStatus && <p>{orderReadyStatus}</p>}
//       <ToastContainer />
//     </div>
//   );
// };

// export default OrderDetails;

import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Countdown from "react-countdown";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createOrder } from "../../api/PublicRequest";
import Cart from "./Cart";
import "./OrderDetails.css";

const OrderDetails = () => {
  const socket = io(import.meta.env.VITE_REACT_APP_SERVER_URL);
  const { id } = useParams();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");
  const [orderReadyStatus, setOrderReadyStatus] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [orderTime, setOrderTime] = useState(null); // Adding orderTime state

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");

    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
    // Listen for 'mealPreparationStarted' events
    socket.on("mealPreparationStarted", (data) => {
      // Check if the orderId in the event data matches the orderId of the current order
      if (data.orderId === orderId) {
        // Update the order status to 'Meals preparation started'
        setOrderStatus("Meals preparation started");

        // Set the start time to the current time
        setOrderTime(data.time); // Set orderTime
        setIsReady(false);
      }
    });

    // Listen for 'orderReady' events
    socket.on("orderReady", (data) => {
      // Check if the orderId in the event data matches the orderId of the current order
      if (data.orderId === orderId) {
        // Update the order status to 'ORDER READY'
        setOrderReadyStatus("ORDER READY");
        setIsReady(true);
      }
    });
  }, [orderId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSpecialInstructionsChange = (e) => {
    setSpecialInstructions(e.target.value);
  };

  const handleDelete = (indexToDelete) => {
    const newCartItems = cartItems.filter(
      (item, index) => index !== indexToDelete
    );
    setCartItems(newCartItems);
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
  };

  const handleOrder = async () => {
    const cartItemsWithTotal = cartItems.map((item) => {
      const totalAmount = parseInt(item.price.split(" ")[0]) * item.quantity;
      return { ...item, totalAmount };
    });

    const totalAmount = cartItemsWithTotal.reduce(
      (total, item) => total + item.totalAmount,
      0
    );

    try {
      const response = await createOrder(id, {
        orders: cartItemsWithTotal,
        specialInstructions,
        totalAmount,
      });
      const orderId = response.data.orderID;
      setOrderId(orderId);
      socket.emit("orders", {
        tableID: id,
        orders: cartItems,
        orderId,
        specialInstructions,
        totalAmount,
      });
      console.log(response.data.message);
      if (response.data.success) {
        toast.success("Order Received");
        setIsOrderPlaced(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <button className="timeButton">
          <p style={{ color: "red" }}>Time's up!</p>
        </button>
      );
    } else {
      // Render a countdown
      return (
        <button className="timeButton-Order">
          <div className="timeRemainingText-Order">
            Order Preparing:
            <div className="timeRemainingContainer-Order">
              <span className="timeRemainingDigits-Order">
                {minutes}:{seconds < 10 ? "0" : ""}
                {seconds}
              </span>
            </div>
          </div>
        </button>
      );
    }
  };

  return (
    <div style={{ width: "390px", margin: "0 auto", textAlign: "center" }}>
      <p
        className=" menu-fonttext-md mr-5 h-12  pt-2 px-3 rounded-full border  font-medium cursor-pointer"
        onClick={handleBack}
        style={{ marginBottom: "20px" }}
      >
        {" "}
        <ArrowLeftOutlined style={{ marginRight: "15px" }} />
        MENU
      </p>
      <Cart
        cartItems={cartItems}
        handleSpecialInstructionsChange={handleSpecialInstructionsChange}
        handleDelete={handleDelete}
        specialInstructions={specialInstructions}
      />
      <button
        className="items-order-button"
        onClick={handleOrder}
        disabled={isOrderPlaced}
      >
        ORDER
      </button>

      {/* {orderStatus && <p>{orderStatus}</p>} */}

      {/* Render countdown only if orderTime is available and not ready */}
      {orderStatus === "Meals preparation started" && orderTime && !isReady && (
        <Countdown
          date={Date.now() + orderTime * 60 * 1000}
          renderer={renderer}
        />
      )}

      {orderReadyStatus && <p>{orderReadyStatus}</p>}
      <ToastContainer />
    </div>
  );
};

export default OrderDetails;
