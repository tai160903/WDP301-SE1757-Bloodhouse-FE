import Home from "@/pages/home/Home";
import RequestBloodPage from "@/pages/blood-request/requestBlood";
import BloodDonationRegistrationPage from "@/pages/blood-donation-registration/BloodDonationRegistration";
import NotFoundPage from "@/pages/notFoundPage/notFoundRoute"

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
    element: <NotFoundPage/>,
  }
];

export default userRoutes;
