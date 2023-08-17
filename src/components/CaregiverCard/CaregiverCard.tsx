import React from "react";
import { Caregiver } from "../../types/Types";
import { Link } from "react-router-dom";
import "./CaregiverCard.css";

interface CaregiverCardProps {
  caregiver: Caregiver;
}

const CaregiverCard: React.FC<{ caregiver: Caregiver }> = ({ caregiver }) => {
  const imageStyle: React.CSSProperties = {
    objectFit: "cover",
    height: "80%",
  };

  return (
    <Link to={`/caregivers/${caregiver.id}`} className="no-underline block">
      <div className="w-full sm:w-3/4 md:w-1/2 lg:w-4/7 mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-6 flex h-62 transition-transform transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-2xl cursor-pointer hover:bg-gray-100">
        {/* Image Container */}
        <div className="flex-shrink-0 flex items-center justify-center w-1/3">
          <img
            src={caregiver.imageurl}
            alt={caregiver.name}
            style={imageStyle}
          />
        </div>
        {/* Text Container */}
        <div className="flex-grow p-6 flex flex-col justify-between">
          <h3 className="text-xl font-semibold mb-4 underline">
            {caregiver.name}
          </h3>
          {/* Explicitly added underline */}
          <p className="text-gray-600 mb-4 pr-6 line-clamp">
            {caregiver.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CaregiverCard;
