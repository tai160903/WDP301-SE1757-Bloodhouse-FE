import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Layout } from '@/components/Layout';
import Home from '@/pages/home/Home';
// import Donate from './pages/Donate';
// import Request from './pages/Request';
// import Search from './pages/Search';
// import Blog from './pages/Blog';
// import Education from './pages/Education';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="huyetket-theme">
        <SidebarProvider defaultOpen={false}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              {/* <Route path="donate" element={<Donate />} />
              <Route path="request" element={<Request />} />
              <Route path="search" element={<Search />} />
              <Route path="blog" element={<Blog />} />
              <Route path="education" element={<Education />} /> */}
              {/* Thêm các routes khác ở đây */}
            </Route>
          </Routes>
        </SidebarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;