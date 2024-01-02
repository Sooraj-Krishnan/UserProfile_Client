import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { menuView } from "../../api/PublicRequest";
import { Typography, Row, Col } from "antd";
const { Title } = Typography;

const MenuView = () => {
  const { id } = useParams();
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const { data } = await menuView(id);
      console.log("data", data.data);
      setMenuData(data.data);
    };
    fetchMenu();
  }, [id]);
  return (
    <div
      className="bg-gray-200"
      style={{ maxWidth: "768px", margin: "0 auto" }}
    >
      {menuData &&
        menuData.menuItems &&
        menuData.menuItems.map((menuItem, index) => (
          <div key={index} className="m-8">
            <Title level={2}>{menuItem.label}</Title>
            {menuItem.items.map((item, index) => (
              <Row key={index}>
                <Col span={12}>
                  <Title level={3}>{item.itemName}</Title>
                  <p>{item.description}</p>
                  <p>{item.price}</p>
                </Col>
                <Col span={12}>
                  <img src={item.itemImage} alt={item.itemName} />
                </Col>
              </Row>
            ))}
          </div>
        ))}
    </div>
  );
};

export default MenuView;
