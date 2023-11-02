import React, { useEffect } from "react"; // Import useEffect
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type ProtectedRouteProps = {
  element: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { currentUser, userType } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      // If not authenticated, redirect to the appropriate sign-in route
      navigate(`/signin/${userType}`);
    }
  }, [currentUser, userType, navigate]); // Add dependencies to the dependency array

  return element; // Return the provided element directly if authenticated
};

export default ProtectedRoute;
