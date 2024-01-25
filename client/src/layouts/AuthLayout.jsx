import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import { Routes, Route } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
};

export default AuthLayout;
