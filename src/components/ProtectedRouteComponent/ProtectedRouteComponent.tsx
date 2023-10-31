import {useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type ProtectedRouteProps = {
  element: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({element }) => {
  const { currentUser, userType } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    // If not authenticated, redirect to the appropriate sign-in route
    navigate(`/signin/${userType}`);
    return null;
  }

  return element; // Return the provided element directly if authenticated
};

export default ProtectedRoute;
