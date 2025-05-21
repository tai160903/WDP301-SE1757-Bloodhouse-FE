import Home from "@/pages/home/Home";
import RequestBloodPage from "@/pages/blood-request/requestBlood";
import BloodDonationRegistrationPage from "@/pages/blood-donation-registration/BloodDonationRegistration";
import NotFoundPage from "@/pages/notFoundPage/notFoundRoute";
import SearchPage from "@/pages/blood-search/searchBloodPage";
import Blog from "@/pages/blog/Blog";


const userRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/request",
    element: <RequestBloodPage />,
  },
  {
    path: "/donation-registration",
    element: <BloodDonationRegistrationPage />,
  },
  {
   path: "*",
   element: <NotFoundPage />,
  },
  {
    path: "/blog",
   element: <Blog />,
  },
   {
    path: "/search",
    element: <SearchPage />,
  },
];

export default userRoutes;
