import PropTypes from "prop-types";
import { Input } from "antd";
import { MdDelete } from "react-icons/md";

const Cart = ({
  cartItems,
  handleSpecialInstructionsChange,
  handleDelete,
  specialInstructions,
}) => {
  const totalAmount = cartItems.reduce((total, item) => {
    return total + parseInt(item.price.split(" ")[0]) * item.quantity;
  }, 0);

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
      <p>Do you want to add any special instruction?</p>
      <div>
        <Input.TextArea
          value={specialInstructions || ""}
          onChange={handleSpecialInstructionsChange}
          placeholder="Enter special instructions here"
        />
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
