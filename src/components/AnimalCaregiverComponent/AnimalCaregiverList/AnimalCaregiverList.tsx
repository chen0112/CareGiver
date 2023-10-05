// CaregiverList.tsx
import React, { useState } from "react";
import AnimalCaregiverCard from "../AnimalCaregiverCard/AnimalCaregiverCard";
import { Link, useParams } from "react-router-dom";
import { useAnimalCaregiverContext } from "../../../context/AnimalCaregiverContext";
import { BiHeart } from "react-icons/bi";
import { useAnimalCaregiverAdsContext } from "../../../context/AnimalCaregiverAdsContext";
import { useAnimalCaregiverFormContext } from "../../../context/AnimalCaregiverFormContext";
import CareneederFilter from "../../CareneederComponent/CareneederFilter/CareneederFilter"; // Import the filter component

const AnimalCaregiverList: React.FC = () => {
  const { animalcaregivers } = useAnimalCaregiverContext();
  const { animalcaregiversForm } = useAnimalCaregiverFormContext();
  const { animalcaregiverAds } = useAnimalCaregiverAdsContext();

  console.log("Context animalcaregiverAds  state:", animalcaregiverAds);
  console.log("Context animalcaregivers state:", animalcaregivers);
  console.log("Context animalcaregiversForm state:", animalcaregiversForm);

  const { phone } = useParams<{ phone: string }>();

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
    <div className="relative">
      <div className="fixed top-1/4 right-8 z-50">
        <div>
          <CareneederFilter onFilterChange={handleFilterChange} />
        </div>

        <div>
          <Link
            to="/signup_animalcareneeder"
            className="no-underline py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            发布新广告
          </Link>
        </div>

        <div>
          <Link
            to={`/myanimalcareneederform/phone/${phone}`}
            className="no-underline py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            我的广告
          </Link>
        </div>

        <div className="w-full">
          <Link
            to={`/animalcareneeders/phone/${phone}`}
            className="no-underline py-2 px-4 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            宠托师雇主广告
          </Link>
        </div>

      </div>
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
        <div className="text-center w-full text-2xl font-semibold mb-3">
          宠托师广告
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
