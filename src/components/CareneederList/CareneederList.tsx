// CaregiverList.tsx
import React, { useState, useEffect } from "react";
import CareneederCard from "../CareneederCard/CareneederCard";
import { Link } from "react-router-dom";
import { useCareneederContext } from "../../context/CareneederContext";
import { BiHeart } from "react-icons/bi";
import { useCareneederScheduleContext } from "../../context/CareneederScheduleContext";
import { useCareneederAdsContext } from "../../context/CareneederAdsContext";
import CareneederFilter from "../CareneederFilter/CareneederFilter"; // Import the filter component
import "./CareneederList.css"

const CareneederList: React.FC = () => {
  const { careneeders } = useCareneederContext();
  const { careneedersSchedule } = useCareneederScheduleContext();
  const { careneederAds } = useCareneederAdsContext();

  console.log("Context careneeders state:", careneeders);
  console.log("Context careneederSchedule state:", careneedersSchedule);
  console.log("Context careneederAd state:", careneederAds);

  // State for filter
  const [filter, setFilter] = useState<{ location: string | null }>({
    location: null,
  });

  const handleFilterChange = (newFilter: { location: string | null }) => {
    setFilter(newFilter);
  };

  // Your filtered careneeders
  const filteredCareneeders = careneeders.filter((careneeder) => {
    // console.log("Careneeder Location: ", careneeder.location);
    // Check if a filter for location is applied
    if (filter.location) {
      // Check if careneeder.location is not null or undefined
      if (!careneeder.location) {
        return false; // If it's null, don't include this careneeder in the filtered list
      }

      // Check if careneeder.location does not match the selected location
      if (
        !careneeder.location.some((option) => option.value === filter.location)
      ) {
        return false; // If it doesn't match, don't include this careneeder in the filtered list
      }
    }

    // If none of the above conditions were met, include the careneeder in the filtered list
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

      <div className="flex justify-end">
        <CareneederFilter onFilterChange={handleFilterChange} />
      </div>

      <div className="flex flex-col items-center">
        {filteredCareneeders.map((careneeder) => {
          // Find the associated careneederschedule for this careneeder
          const associatedSchedule = careneedersSchedule.find(
            (schedule) => schedule.careneeder_id === careneeder.id
          );
          // Find all the associated careneederAds for this careneeder
          const associatedAds = careneederAds.find(
            (ad) => ad.careneeder_id === careneeder.id
          );

          return (
            <CareneederCard
              key={careneeder.id}
              careneeder={careneeder}
              careneederSchedule={associatedSchedule} // Pass the associated schedule as a prop
              careneederAd={associatedAds}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CareneederList;
