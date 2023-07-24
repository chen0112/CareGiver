import React from "react";
import { Caregiver } from "../types/Types";


interface CaregiverCardProps {
  caregiver: Caregiver;
}

const CaregiverCard: React.FC<{ caregiver: Caregiver }> = ({ caregiver }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <img
        className="w-full h-40 object-cover"
        src={caregiver.imageUrl}
        alt={caregiver.name}
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{caregiver.name}</h3>
        <p className="text-gray-600">{caregiver.description}</p>
      </div>
    </div>
  );
};

export default CaregiverCard;
