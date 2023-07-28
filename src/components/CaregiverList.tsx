// CaregiverList.tsx
import React from "react";
import CaregiverCard from "./CaregiverCard";
import { useCaregiverContext } from "../context/CaregiverContext";

const CaregiverList: React.FC = () => {
  const { caregivers } = useCaregiverContext();

  console.log("Rendered CaregiverList.");
  console.log("Context caregivers state:", caregivers);

  return (
    <div className="caregiver-list">
      {caregivers.map((caregiver) => (
        <CaregiverCard key={caregiver.id} caregiver={caregiver} />
      ))}
    </div>
  );
};

export default CaregiverList;
