import { Navigate, Outlet } from "react-router-dom";
import userStore from "stores/userStore";

export const AuthRoute = () => {
  const current = userStore((state) => state.current);

  return current ? <Outlet /> : <Navigate to="/login" />;
};
