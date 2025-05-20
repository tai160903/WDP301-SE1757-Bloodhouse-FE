import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { router } from "@/routes/router";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="huyetket-theme">
      <SidebarProvider defaultOpen={false}>
        <RouterProvider router={router} />
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
