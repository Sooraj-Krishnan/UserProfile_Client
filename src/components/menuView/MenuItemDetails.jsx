import PropTypes from "prop-types";
import { useState } from "react";
import { Typography, Row, Col } from "antd";
const { Title } = Typography;

const MenuItemDetails = ({ item }) => {
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div>
      <Row>
        <Col span={12}>
          <Title level={3}>{item.itemName}</Title>
          <p>{item.description}</p>
          <p>Price: {item.price * quantity}</p>
        </Col>
        <Col span={12}>
          <img className="m-2" src={item.itemImage} alt={item.itemName} />
        </Col>
      </Row>
      <div>
        <button onClick={decrementQuantity}>-</button>
        <span>{quantity}</span>
        <button onClick={incrementQuantity}>+</button>
      </div>
    </div>
  );
};
MenuItemDetails.propTypes = {
  item: PropTypes.shape({
    itemName: PropTypes.string,
    itemImage: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
  }).isRequired,
};

export default MenuItemDetails;
