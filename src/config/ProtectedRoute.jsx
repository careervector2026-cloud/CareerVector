import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// roleType must match your Redux slice names: 'admin', 'recruiter', or 'student'
const ProtectedRoute = ({ roleType }) => {
  const location = useLocation();

  // We dynamically select the correct slice based on the roleType prop
  const { isAuthenticated } = useSelector((state) => state[roleType]);

  // Determine the correct login route to redirect to if auth fails
  const loginRoutes = {
    admin: "/admin/login",
    recruiter: "/recruiter/login",
    student: "/student/login",
  };

  if (!isAuthenticated) {
    // Redirect them to the specific login page for their role, 
    // but save the location they were trying to go to (state={{ from: location }})
    return <Navigate to={loginRoutes[roleType]} state={{ from: location }} replace />;
  }

  // If authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;