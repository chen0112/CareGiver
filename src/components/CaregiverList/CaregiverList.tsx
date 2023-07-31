// CaregiverList.tsx
import React from "react";
import CaregiverCard from "../CaregiverCard/CaregiverCard";
import { Link } from "react-router-dom";
import { useCaregiverContext } from "../../context/CaregiverContext";
import "./CaregiverList.css";

const CaregiverList: React.FC = () => {
  const { caregivers } = useCaregiverContext();

  console.log("Rendered CaregiverList.");
  console.log("Context caregivers state:", caregivers);

  return (
    <div className="caregiver-list">
      <div className="logo-container">
        {/* Text logo with a link to the homepage */}
        <Link to="/" className="logo-link">
          关爱网
        </Link>
      </div>
      <div className="caregivers-container">
        {caregivers.map((caregiver) => (
          <CaregiverCard key={caregiver.id} caregiver={caregiver} />
        ))}
      </div>
    </div>
  );
};

export default CaregiverList;
