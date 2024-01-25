import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <AuthLayout />
        <MainLayout />
      </Router>
    </ThemeProvider>
  );
}

export default App;
