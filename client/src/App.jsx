import { Button } from "./components/ui/button";
import { ThemeProvider } from "./components/ui/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Button>Click Me</Button>
      Hello
    </ThemeProvider>
  );
}

export default App;
