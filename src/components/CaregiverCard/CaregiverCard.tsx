import React from "react";
import { Caregiver } from "../../types/Types";

interface CaregiverCardProps {
  caregiver: Caregiver;
}

const CaregiverCard: React.FC<{ caregiver: Caregiver }> = ({ caregiver }) => {
  const imageStyle: React.CSSProperties = {
    width: "100%", // Adjust the width as needed
    height: "200px", // Adjust the height as needed
    objectFit: "cover",
    display: "block",
    margin: "0 auto",
  };

  return (
    <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-4">
      <img src={caregiver.imageUrl} alt={caregiver.name} style={imageStyle} />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{caregiver.name}</h3>
        <p className="text-gray-600">{caregiver.description}</p>
      </div>
    </div>
  );
};

export default CaregiverCard;
