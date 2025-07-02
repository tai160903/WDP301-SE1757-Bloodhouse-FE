import Home from "@/pages/home/Home";
import RequestBloodPage from "@/pages/blood-request/requestBlood";
import BloodDonationRegistrationPage from "@/pages/blood-donation-registration/BloodDonationRegistration";
import NotFoundPage from "@/pages/notFoundPage/notFoundRoute";
import SearchPage from "@/pages/blood-search/searchBloodPage";
import Blog from "@/pages/resource/Blog";
import BlogDetails from "@/pages/resource/BlogDetail";
import BloodInfo from "@/pages/resource/BloodInfo";
import FAQPage from "@/pages/resource/Faq";
import ProcessInfo from "@/pages/resource/processInfo";
import ProfilePage from "@/pages/Profile/ProfilePage";
import BloodDonationHistory from "@/pages/Profile/BloodDonationHistory/BloodDonationHistory";
import ProtectedRoute from "@/components/ProtectedRoute";
import Events from "@/pages/event/Events";
import EventDetail from "@/pages/event/EventDetail";
import MatchBlood from "@/pages/location/matchBlood/matchBlood";
import BloodRequestHistory from "@/pages/Profile/BloodRequestHistory/BloodRequestHistory";
import BloodRequestDetail from "@/pages/Profile/BloodRequestHistory/BloodRequestHIstoryDetail";
import BloodDonationDetail from "@/pages/Profile/BloodDonationHistory/BloodDonationHistoryDetail";

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
    path: "/matchBloodType",
    element: <MatchBlood />,
  },
  {
    path: "/process",
    element: <ProcessInfo />,
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
  },
  {
    path: "/donation-history/:id",
    element: <BloodDonationDetail />,
  },
  {
    path: "/request-history",
    element: (
      <ProtectedRoute fallbackPath="/auth/login">
        <BloodRequestHistory />
      </ProtectedRoute>
    ),
  },
  {
    path: "/request-history/:id",
    element: <BloodRequestDetail />,
  },
  {
    path: "/events",
    element: <Events />,
  },
  {
    path: "/events/:id",
    element: <EventDetail />,
  },
];

export default userRoutes;
