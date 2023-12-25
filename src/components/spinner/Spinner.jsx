import { Spin } from "antd";

function Spinner() {
  return (
    <div className="overlayLoader">
      <Spin size="large" />
    </div>
  );
}

export default Spinner;
