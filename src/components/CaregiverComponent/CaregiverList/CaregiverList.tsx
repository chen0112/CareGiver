import React, { useState } from "react";
import CaregiverCard from "../CaregiverCard/CaregiverCard";
import { Link, useParams } from "react-router-dom";
import { useCaregiverContext } from "../../../context/CaregiverContext";
import { useCaregiverAdsContext } from "../../../context/CaregiverAdsContext";
import "./CaregiverList.css";
import { BiHeart, BiMessageDetail } from "react-icons/bi";
import CaregiverFilter from "../CaregiverFilter/CaregiverFilter";

const CaregiverList: React.FC = () => {
  const { caregivers } = useCaregiverContext();
  const { caregiverAds } = useCaregiverAdsContext();

  const { phone } = useParams<{ phone: string }>();
  const { userType } = useParams<{ userType: string }>();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // State for filter
  const [filter, setFilter] = useState<{
    location: string;
    age: string;
    gender: string;
    experience: string;
    hourlycharge: string;
  }>({
    location: "",
    age: "",
    gender: "",
    experience: "",
    hourlycharge: "",
  });

  const handleFilterChange = (newFilter: {
    location: string;
    age: string;
    gender: string;
    experience: string;
    hourlycharge: string;
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

    // 5. Check hourly charge
    if (filter.hourlycharge) {
      if (caregiver.hourlycharge == null) {
        // Check if hourlycharge is null
        return false;
      }

      const [minCharge, maxCharge] = filter.hourlycharge.split("-").map(Number);

      if (isNaN(maxCharge)) {
        // If maxCharge is 'NaN', then the charge range is something like "20+"
        if (Number(caregiver.hourlycharge) < minCharge) {
          return false;
        }
      } else {
        if (
          Number(caregiver.hourlycharge) < minCharge ||
          Number(caregiver.hourlycharge) > maxCharge
        ) {
          return false;
        }
      }
    }

    return true;
  });

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
            to="/signup_careneeder"
            className="no-underline py-1 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            发布新广告
          </Link>
          <Link
            to={`/mycareneeder/phone/${phone}`}
            className="no-underline py-1 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            我的广告
          </Link>
          <Link
            to={`/careneeders/phone/${phone}`}
            className="no-underline py-1 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            所有雇主广告
          </Link>
          <Link to={`/chatmessagehub?loggedInUser=${phone}&userType=${userType}`}>
            <BiMessageDetail size={24} />
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
            to="/signup_careneeder"
            className="block text-left no-underline py-1 px-2 text-black hover:underline"
          >
            发布新广告
          </Link>
          <Link
            to={`/mycareneeder/phone/${phone}`}
            className="block text-left no-underline py-1 px-2 text-black hover:underline"
          >
            我的广告
          </Link>
          <Link
            to={`/careneeders/phone/${phone}`}
            className="block text-left no-underline py-1 px-2 text-black hover:underline"
          >
            所有护工广告
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
          护工广告
        </div>
        <div className="flex flex-col items-center w-full md:w-4/5 lg:w-3/5">
          <div className="w-full lg:w-4/6 flex justify-end mb-2">
            <div className="mr-2">
              <CaregiverFilter onFilterChange={handleFilterChange} />
            </div>
          </div>

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
                phoneNumber={phone}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CaregiverList;
