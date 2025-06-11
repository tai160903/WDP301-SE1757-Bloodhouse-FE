import Blogs from "@/pages/manager/Blogs";
import BloodInventory from "@/pages/manager/BloodInventory";
import Dashboard from "@/pages/manager/Dashboard";
import Events from "@/pages/manager/Events";
import Gifts from "@/pages/manager/Gifts";
import ReceivedRequests from "@/pages/manager/Received";
import Requests from "@/pages/manager/Request";
import Staff from "@/pages/manager/Staff";

const managerRoutes = [
  {
    path: "",
    element: <Dashboard />,
  },
  {
    path: "inventory",
    element: <BloodInventory />,
  },
  {
    path: "requests",
    element: <Requests />,
  },
  {
    path: "received",
    element: <ReceivedRequests />,
  },
  {
    path: "gifts",
    element: <Gifts />,
  },
  {
    path: "staff",
    element: <Staff />,
  },
  {
    path: "blogs",
    element: <Blogs />,
  },
  {
    path: "events",
    element: <Events />,
  },
];

export default managerRoutes;
