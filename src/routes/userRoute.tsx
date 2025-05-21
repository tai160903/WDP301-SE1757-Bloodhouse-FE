import Home from "@/pages/home/Home";
import RequestBloodPage from "@/pages/blood-request/requestBlood";
import BloodDonationRegistrationPage from "@/pages/blood-donation-registration/BloodDonationRegistration";
import NotFoundPage from "@/pages/notFoundPage/notFoundRoute";
import SearchPage from "@/pages/blood-search/searchBloodPage";
import BlogPage from "@/pages/resource/Blog";
import BloodInfo from "@/pages/resource/BloodInfo";
import FAQPage from "@/pages/resource/Faq";


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
   element: <BlogPage />,
  },
  {
    path: "/bloodInfo",
    element: <BloodInfo/>,
  },
   {
    path: "/search",
    element: <SearchPage />,
  },
  {
    path: "/faq",
    element: <FAQPage />,
  },

];

export default userRoutes;
