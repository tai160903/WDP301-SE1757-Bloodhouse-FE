import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Layout } from '@/components/Layout';
import Home from '@/pages/home/Home';
import RequestBloodPage from '@/pages/blood-request/requestBlood';
import BloodDonationRegistrationPage from '@/pages/blood-donation-registration/BloodDonationRegistration';
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="huyetket-theme">
        <SidebarProvider defaultOpen={false}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="request" element={<RequestBloodPage />} />
              <Route path="donation-registration" element={<BloodDonationRegistrationPage />} />
            </Route>
          </Routes>
        </SidebarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;