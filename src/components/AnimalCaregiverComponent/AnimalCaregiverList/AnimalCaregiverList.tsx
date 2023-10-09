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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
      <div className="flex items-center justify-between py-3 w-full">
        <Link to="/" className="flex items-center text-black no-underline">
          <BiHeart
            size={30}
            className="text-red-500 heart-icon my-auto ml-4 hidden md:block" // Added ml-4 for more margin to the left
          />
          <h1 className="font-bold text-3xl ml-2 my-auto align-middle text-red-500">
            关爱网
          </h1>
        </Link>
        <div className="hidden md:flex space-x-4 mr-4">
          {/* Added mr-4 to the parent div */}
          <Link
            to="/signup_animalcareneeder"
            className="no-underline py-1 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            发布新广告
          </Link>
          <Link
            to={`/myanimalcareneederform/phone/${phone}`}
            className="no-underline py-1 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            我的广告
          </Link>
          <Link
            to={`/animalcareneeders/phone/${phone}`}
            className="no-underline py-1 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            宠托师雇主广告
          </Link>
        </div>

        {/* Hamburger menu button for smaller screens */}
        <button className="md:hidden p-2" onClick={toggleSidebar}>
          ☰
        </button>

        {/* Sidebar for mobile view */}
        <div
          className={`${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden fixed top-0 right-0 h-full w-48 bg-white shadow-lg z-50 flex flex-col space-y-2 py-4 px-2 transition-transform ease-in-out duration-300`}
        >
          {/* Links in the sidebar */}
          <Link
            to="/signup_animalcareneeder"
            className="block text-left no-underline py-1 px-2 text-black hover:underline"
          >
            发布新广告
          </Link>
          <Link
            to={`/myanimalcareneederform/phone/${phone}`}
            className="block text-left no-underline py-1 px-2 text-black hover:underline"
          >
            我的广告
          </Link>
          <Link
            to={`/animalcareneeders/phone/${phone}`}
            className="block text-left no-underline py-1 px-2 text-black hover:underline"
          >
            宠托师雇主广告
          </Link>
          <button
            onClick={toggleSidebar}
            className="text-left py-1 px-2 text-black hover:underline"
          >
            关闭
          </button>
        </div>
      </div>

      <hr className="border-t border-black-300 mx-1 my-2" />

      <div className="flex flex-col items-center space-y-8">
        <div className="text-center w-full text-2xl font-semibold mb-3">
          宠托师广告
        </div>
        <div className="flex flex-col items-center w-full md:w-4/5 lg:w-3/5">
          <div className="w-full lg:w-4/6 flex justify-end mb-2">
            <div className="mr-2">
              <CareneederFilter onFilterChange={handleFilterChange} />
            </div>
          </div>

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
