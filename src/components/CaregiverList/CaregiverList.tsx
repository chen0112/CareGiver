import React, { useState } from "react";
import CaregiverCard from "../CaregiverCard/CaregiverCard";
import { Link } from "react-router-dom";
import { useCaregiverContext } from "../../context/CaregiverContext";
import { useCaregiverAdsContext } from "../../context/CaregiverAdsContext";
import "./CaregiverList.css";
import { BiHeart } from "react-icons/bi";
import CaregiverFilter from "../CaregiverFilter/CaregiverFilter"; // Import the filter component

const CaregiverList: React.FC = () => {
  const { caregivers } = useCaregiverContext();
  const { caregiverAds } = useCaregiverAdsContext();

  // State for filter
  const [filter, setFilter] = useState<{
    location: string;
    age: string;
    gender: string;
    experience: string;
  }>({
    location: "",
    age: "",
    gender: "",
    experience: "",
  });

  const handleFilterChange = (newFilter: {
    location: string;
    age: string;
    gender: string;
    experience: string;
  }) => {
    setFilter(newFilter);
  };

  // Your filtered caregivers
  const filteredCaregivers = caregivers.filter((caregiver) => {
    // 1. Check location
    if (
      filter.location &&
      !caregiver.location?.some((option) => option.value === filter.location)
    ) {
      return false;
    }

    // 2. Check age
    if (filter.age) {
      if (caregiver.age == null) {
        // Check if age is null
        return false;
      }

      const [minAge, maxAge] = filter.age.split("-").map(Number);

      if (isNaN(maxAge)) {
        // If maxAge is 'NaN', then the age range is something like "56+"
        if (caregiver.age < minAge) {
          return false;
        }
      } else {
        if (caregiver.age < minAge || caregiver.age > maxAge) {
          return false;
        }
      }
    }

    // 3. Check gender
    if (filter.gender && caregiver.gender !== filter.gender) {
      return false;
    }

    // 4. Check experience
    if (filter.experience) {
      if (caregiver.years_of_experience == null) {
        // Check if years_of_experience is null
        return false;
      }

      const [minExp, maxExp] = filter.experience.split("-").map(Number);

      if (isNaN(maxExp)) {
        // If maxExp is 'NaN', then the experience range is something like ">10"
        if (caregiver.years_of_experience < minExp) {
          return false;
        }
      } else {
        if (
          caregiver.years_of_experience < minExp ||
          caregiver.years_of_experience > maxExp
        ) {
          return false;
        }
      }
    }

    return true;
  });

  return (
    <div>
      <div className="flex items-center mx-9 py-3">
        <Link to="/" className="flex items-center text-black no-underline ml-0">
          <BiHeart size={30} className="text-red-500 heart-icon my-auto" />
          <h1 className="font-bold text-3xl ml-2 my-auto align-middle text-red-500">
            关爱网
          </h1>
        </Link>
      </div>

      <hr className="border-t border-black-300 mx-1 my-2" />

      <div className="flex flex-col items-center space-y-8">
        {/* Add spacing between elements */}
        <div className="flex justify-center w-full mb-8">
          {/* Centered and margin added */}
          <CaregiverFilter onFilterChange={handleFilterChange} />
        </div>
        <div className="flex flex-col items-center w-full md:w-4/5 lg:w-3/5">
          {/* Changed to 3/5 width of the parent */}
          {filteredCaregivers.map((caregiver) => {
            const associatedAds = caregiverAds.find(
              (ad) => ad.caregiver_id === caregiver.id
            );

            return (
              <CaregiverCard
                key={caregiver.id}
                caregiver={caregiver}
                caregiverAd={associatedAds}
                className="w-full" // 100% width of the parent div which is 3/5 of the screen
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CaregiverList;
