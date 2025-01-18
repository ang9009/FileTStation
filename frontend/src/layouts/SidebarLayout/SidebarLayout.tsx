import { Outlet } from "react-router";
import Sidebar from "../../components/Sidebar/Sidebar";

/**
 * Used for all pages that have a sidebar.
 */
const SidebarLayout = () => {
  return (
    <div>
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default SidebarLayout;
