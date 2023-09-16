// CaregiverList.tsx
import React, { useState } from "react";
import AnimalCaregiverCard from "../AnimalCaregiverCard/AnimalCaregiverCard";
import { Link } from "react-router-dom";
import { useAnimalCaregiverContext } from "../../context/AnimalCaregiverContext";
import { BiHeart } from "react-icons/bi";
import { useAnimalCaregiverAdsContext } from "../../context/AnimalCaregiverAdsContext";
import { useAnimalCaregiverFormContext } from "../../context/AnimalCaregiverFormContext";
import CareneederFilter from "../CareneederFilter/CareneederFilter"; // Import the filter component

const AnimalCaregiverList: React.FC = () => {
  const { animalcaregivers } = useAnimalCaregiverContext();
  const { animalcaregiversForm } = useAnimalCaregiverFormContext();
  const { animalcaregiverAds } = useAnimalCaregiverAdsContext();

  console.log("Context animalcaregiverAds  state:", animalcaregiverAds);
  console.log("Context animalcaregivers state:", animalcaregivers);
  console.log("Context animalcaregiversForm state:", animalcaregiversForm);

  // State for filter
  const [filter, setFilter] = useState<{ location: string | null }>({
    location: null,
  });

  const handleFilterChange = (newFilter: { location: string | null }) => {
    setFilter(newFilter);
  };

  // Your filtered careneeders
  const filteredanimalcaregiversForm = animalcaregiversForm.filter(
    (animalcaregiverForm) => {
      // console.log("Careneeder Location: ", careneeder.location);
      // Check if a filter for location is applied
      if (filter.location) {
        // Check if careneeder.location is not null or undefined
        if (!animalcaregiverForm.location) {
          return false; // If it's null, don't include this careneeder in the filtered list
        }

        // Check if careneeder.location does not match the selected location
        if (
          !animalcaregiverForm.location.some(
            (option) => option.value === filter.location
          )
        ) {
          return false; // If it doesn't match, don't include this careneeder in the filtered list
        }
      }

      // If none of the above conditions were met, include the careneeder in the filtered list
      return true;
    }
  );

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
        <div className="flex justify-center w-full mb-8">
          <CareneederFilter onFilterChange={handleFilterChange} />
        </div>

        <div className="flex flex-col items-center w-full md:w-4/5 lg:w-3/5">
          {filteredanimalcaregiversForm.map((animalcaregiversForm) => {
            // Find the associated careneederschedule for this careneeder
            const associatedDetails = animalcaregivers.find(
              (details) => details.animalcaregiverid === animalcaregiversForm.id
            );
            // Find all the associated careneederAds for this careneeder
            const associatedAds = animalcaregiverAds.find(
              (ad) => ad.animalcaregiverid === animalcaregiversForm.id
            );

            return (
              <AnimalCaregiverCard
                key={animalcaregiversForm.id}
                animalcaregiversForm={animalcaregiversForm}
                animalcaregiver={associatedDetails} // Pass the associated schedule as a prop
                animalcaregiverAds={associatedAds}
                className="w-full"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnimalCaregiverList;
