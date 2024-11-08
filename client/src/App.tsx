import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage/HomePage";
import WizardForm from "./components/WizardForm";
import NavBar from "./components/NavBar/NavBar";
import DrivePage from "./components/DrivePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/form" element={<WizardForm />} />
          <Route path="/drive" element={<DrivePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
