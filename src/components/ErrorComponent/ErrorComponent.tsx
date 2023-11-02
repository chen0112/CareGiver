import React from "react";
import cat from "./cats_napping.avif";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface ErrorComponentProps {
  message?: string;
  userType?:
    | "careneeder"
    | "caregiver"
    | "animalcaregiver"
    | "animalcareneeder"; // Add your user types here, adjust as necessary
  phone?: string; // Added phone prop
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  message = "Oops! Something went wrong.",
  userType,
  phone, 
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const getLinkPath = (userType?: string) => {
    switch (userType) {
      case "careneeder":
        return `/signup_careneeder/phone/${phone}` ;
      case "caregiver":
        return `/signup_caregiver/phone/${phone}`;
      case "animalcaregiver":
        return `/signup_animalcaregiver/phone/${phone}`;
      case "animalcareneeder":
        return `/signup_animalcareneeder/phone/${phone}`;
      default:
        return "#"; // Fallback route if none of the types match
    }
  };
  return (
    <div
      className="flex flex-col items-center justify-start h-screen"
      style={{
        backgroundImage: `url(${cat})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Error Description */}
      <p className="text-center text-black text-2xl mt-5">{message}</p>

      {/* Go Back Button */}
      <button
        onClick={handleGoBack}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
      >
        返回
      </button>
      {/* Conditionally Rendered Button */}
      <Link
        to={getLinkPath(userType)}
        className="no-underline mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
      >
        发布新广告
      </Link>
    </div>
  );
};

export default ErrorComponent;
