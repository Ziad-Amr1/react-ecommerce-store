import DesignSystem from "./pages/DesignSystem";
import Home from "./pages/Home.jsx";
import { Routes, Route } from "react-router";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/desgin-system" element={<DesignSystem />} />
      <Route path="/login" element={<Login />} /> 
      <Route path="/dashboard/*" element={<ProtectedRoute isAuthenticated={true} user={{ role: "admin" }}/>} >
       <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App; 