import { useContext } from "react";
import PropTypes from "prop-types";
import { ConfigProvider, Layout } from "antd";
import { ThemeContext } from "../state-management/ThemeContext";
import DarkModeToggle from "../hooks/DarkToggler";
//import ProfilePopover from "../popovers/ProfilePopover";

const { Content } = Layout;

function NavBar({ children }) {
  const { theme } = useContext(ThemeContext);

  return (
    <ConfigProvider>
      <Layout
        style={{
          background: theme === "dark" ? "#111827" : "white",
          // position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: "30px", right: "20px" }}>
          <DarkModeToggle />
        </div>
        {/* <ProfilePopover /> */}
        <Content
        //   style={{
        //     background: theme === "dark" ? "#111827" : "white",
        //   }}
        >
          {children}
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default NavBar;

NavBar.propTypes = {
  children: PropTypes.node.isRequired,
};
