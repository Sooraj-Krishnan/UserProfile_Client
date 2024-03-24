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
            <span className="column-header">Items</span>
            <span className="column-header">Quantity</span>
            <span className="column-header">Price</span>
          </div>
        }
        bordered={false}
        style={{ width: 400, marginBottom: "20px" }}
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
            <span className="column-item">{item.itemName}</span>
            <span className="column-item quantity">{item.quantity}</span>
            <span className="column-item price">
              {parseInt(item.price.split(" ")[0]) * item.quantity}{" "}
              {item.price.split(" ")[1]}
              <button
                onClick={() => handleDelete(index)}
                style={{ marginLeft: "20px" }}
              >
                <MdDelete className="delete-icon" />
              </button>
            </span>
          </div>
        ))}
        <hr />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>Total Amount :</p>
          <p>{totalAmount}</p>
        </div>
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
