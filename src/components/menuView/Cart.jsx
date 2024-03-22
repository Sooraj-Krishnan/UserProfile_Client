import PropTypes from "prop-types";
import { Input, Card } from "antd";
import { MdDelete } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";

import "./Cart.css";

const Cart = ({
  cartItems,
  handleSpecialInstructionsChange,
  handleDelete,
  specialInstructions,
}) => {
  const totalAmount = cartItems.reduce((total, item) => {
    return total + parseInt(item.price.split(" ")[0]) * item.quantity;
  }, 0);
  console.log("cartItems", cartItems);
  return (
    <div>
      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Items</span>
            <span>Quantity</span>
            <span>Price</span>
          </div>
        }
        bordered={false}
        style={{
          width: 300,
          marginBottom: "20px",
        }}
      >
        {cartItems.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <span>{item.itemName}</span>
            <span>{item.quantity}</span>
            <span>
              {parseInt(item.price.split(" ")[0]) * item.quantity}{" "}
              {item.price.split(" ")[1]}
              <button
                onClick={() => handleDelete(index)}
                style={{ marginLeft: "20px" }}
              >
                <MdDelete color="red" />
              </button>
            </span>
          </div>
        ))}
        <hr />
        <p>Total Amount : {totalAmount}</p>
      </Card>

      <div className="input-wrapper">
        <Input.TextArea
          value={specialInstructions || ""}
          onChange={handleSpecialInstructionsChange}
          placeholder="Add Cooking Instructions"
          className="special-instructions-input"
        />
        <IoMdAddCircleOutline className="input-icon" />
      </div>
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
  handleSpecialInstructionsChange: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  specialInstructions: PropTypes.string,
};

export default Cart;
