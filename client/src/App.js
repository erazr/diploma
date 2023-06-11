import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppPage } from "pages/Home/Home";
import { AuthRoute } from "pages/AuthRoute";
import { ForgotPasswordPage } from "pages/ForgotPassword/ForgotPassword";
import { Login } from "pages/Login/Login";
import { Register } from "pages/Register/Register";
import { ResetPasswordPage } from "pages/ResetPassword/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthRoute />}>
          <Route path="/channels/me" element={<AppPage />} />
          <Route path="/channels/me/:channelId" element={<AppPage />} />
          <Route path="/" element={<AppPage />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
