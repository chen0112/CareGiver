// CaregiverList.tsx
import React from "react";
import CareneederCard from "../CareneederCard/CareneederCard";
import { Link } from "react-router-dom";
import { useCareneederContext } from "../../context/CareneederContext";
import { BiHeart } from "react-icons/bi";
import { useCareneederScheduleContext } from "../../context/CareneederScheduleContext";
import { useCareneederAdsContext } from "../../context/CareneederAdsContext";

const CareneederList: React.FC = () => {
  const { careneeders } = useCareneederContext();
  const { careneedersSchedule } = useCareneederScheduleContext();
  const { careneederAds } = useCareneederAdsContext();  

  console.log("Context careneeders state:", careneeders);
  console.log("Context careneederSchedule state:", careneedersSchedule);
  console.log("Context careneederAd state:", careneederAds);

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

      <div className="flex flex-col items-center">
        {careneeders.map((careneeder) => {
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
