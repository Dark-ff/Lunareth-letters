import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyLetters from "./pages/MyLetters";
import Home from "./pages/Home";
import CreateLetter from "./pages/CreateLetter";
import ViewLetter from "./pages/ViewLetter";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./context/AuthContext";
import { AppThemeProvider } from "./context/AppThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppThemeProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/letter/:id" element={<ViewLetter />} />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateLetter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-letters"
              element={
                <ProtectedRoute>
                  <MyLetters />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AppThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
