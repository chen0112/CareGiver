import React from "react";
import CaregiverCard from "./CaregiverCard";
import { Caregiver } from "../types/Types";

interface CaregiverListProps {
  caregivers: Caregiver[];
}

const CaregiverList: React.FC<CaregiverListProps> = ({ caregivers }) => {
  return (
    <div className="caregiver-list">
      {caregivers.map((caregiver) => (
        <CaregiverCard key={caregiver.id} caregiver={caregiver} />
      ))}
    </div>
  );
};

export default CaregiverList;
