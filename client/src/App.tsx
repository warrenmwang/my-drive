import { BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import RouteRenderer from "./components/RouteRenderer";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <RouteRenderer />
      </BrowserRouter>
    </>
  );
}

export default App;
