import { useContext, useState } from "react";
import { Avatar, Popover as Popup, Divider, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { ThemeContext } from "../state-management/ThemeContext";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/AdminRequest";

const ProfilePopover = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);

  const handlePopoverOpen = () => {
    setOpen(true);
  };

  const handlePopoverClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      const refToken = await localStorage.getItem("manager-refToken");
      const { data } = await logout(refToken);
      if (data.success) {
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.log(error.response.data);
      localStorage.clear();
      navigate("/login");
    }
    handlePopoverClose();
  };

  const popoverContent = (
    <>
      <div style={{ display: "flex", alignItems: "center", padding: "8px" }}>
        <Avatar src="/static/user/user-11.png" style={{ marginRight: "8px" }} />
        <div>
          <div>Aaron Cooper</div>
          <div>aaron@example.com</div>
        </div>
      </div>
      <Divider style={{ margin: "8px 0" }} />
      <Button
        type="text"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        style={{ color: theme === "dark" ? "#ccc" : "#555", textAlign: "left" }}
      >
        Sign Out
      </Button>
    </>
  );

  return (
    <Popup
      content={popoverContent}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
    >
      <Avatar
        src="/static/user/user-11.png"
        style={{ cursor: "pointer" }}
        onClick={handlePopoverOpen}
      />
    </Popup>
  );
};

export default ProfilePopover;
