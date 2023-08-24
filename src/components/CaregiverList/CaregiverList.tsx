// CaregiverList.tsx
import React from "react";
import CaregiverCard from "../CaregiverCard/CaregiverCard";
import { Link } from "react-router-dom";
import { useCaregiverContext } from "../../context/CaregiverContext";
import "./CaregiverList.css";
import { BiHeart } from "react-icons/bi";

const CaregiverList: React.FC = () => {
  const { caregivers } = useCaregiverContext();

  console.log("Context caregivers state:", caregivers);

  return (
    <div>
      <div className="flex items-center mx-9 py-3">
        <Link
          to="/"
          className="flex items-center text-black no-underline ml-0" // Remove 'mx-8 py-3' and add 'ml-0' to push it to the far left
        >
          <BiHeart size={30} className="text-red-500 heart-icon my-auto" />
          <h1 className="font-bold text-3xl ml-2 my-auto align-middle text-red-500">
            关爱网
          </h1>
        </Link>
      </div>

      <hr className="border-t border-black-300 mx-1 my-2" />
      
      <div className="flex flex-col items-center">
        {caregivers.map((caregiver) => (
          <CaregiverCard key={caregiver.id} caregiver={caregiver} />
        ))}
      </div>
    </div>
  );
};

export default CaregiverList;
