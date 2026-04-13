import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/Authcontext";
import AdminLayout from "./components/Adminlayout";


import AkademikDasturlar from "./pages/Akademikdasturlar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Yangiliklar from "./pages/Yangiliklar";
import Oqituvchilar from "./pages/Oqituvchilar";
import Qabul from "./pages/Qabul";
import Aloqa from "./pages/Aloqa";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="akademik-dasturlar" element={<AkademikDasturlar />} />
        <Route path="yangiliklar" element={<Yangiliklar />} />
        <Route path="oqituvchilar" element={<Oqituvchilar />} />
        <Route path="qabul" element={<Qabul />} />
        <Route path="aloqa" element={<Aloqa />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
