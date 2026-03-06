import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { motion } from "framer-motion";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <motion.main
        className="flex-1 ml-[260px] min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
