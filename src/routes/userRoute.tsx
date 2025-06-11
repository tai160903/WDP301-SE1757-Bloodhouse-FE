import Home from "@/pages/home/Home";
import RequestBloodPage from "@/pages/blood-request/requestBlood";
import BloodDonationRegistrationPage from "@/pages/blood-donation-registration/BloodDonationRegistration";
import NotFoundPage from "@/pages/notFoundPage/notFoundRoute";
import SearchPage from "@/pages/blood-search/searchBloodPage";
import Blog from "@/pages/resource/Blog";
import BlogDetails from "@/pages/resource/BlogDetail";
import BloodInfo from "@/pages/resource/BloodInfo";
import FAQPage from "@/pages/resource/Faq";
import ProfilePage from "@/pages/Profile/ProfilePage";
import BloodDonationHistory from "@/pages/Profile/BloodDonationHistory/BloodDonationHistory";
import ProtectedRoute from "@/components/ProtectedRoute";

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
    path: "/unauthorized",
    element: <NotFoundPage />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blog/:id",
    element: <BlogDetails />,
  },
  {
    path: "/bloodInfo",
    element: <BloodInfo />,
  },
  {
    path: "/search",
    element: <SearchPage />,
  },
  {
    path: "/faq",
    element: <FAQPage />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute fallbackPath="/auth/login">
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/donation-history",
    element: (
      <ProtectedRoute fallbackPath="/auth/login">
        <BloodDonationHistory />
      </ProtectedRoute>
    ),
  }
];

export default userRoutes;
