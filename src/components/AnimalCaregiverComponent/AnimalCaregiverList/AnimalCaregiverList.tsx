// CaregiverList.tsx
import React, { useEffect, useState } from "react";
import AnimalCaregiverCard from "../AnimalCaregiverCard/AnimalCaregiverCard";
import { Link, useParams } from "react-router-dom";
import { useAnimalCaregiverContext } from "../../../context/AnimalCaregiverContext";
import { BiHeart, BiMessageDetail } from "react-icons/bi";
import { useAnimalCaregiverAdsContext } from "../../../context/AnimalCaregiverAdsContext";
import { useAnimalCaregiverFormContext } from "../../../context/AnimalCaregiverFormContext";
import CaregiverFilter from "../../CaregiverComponent/CaregiverFilter/CaregiverFilter";

const AnimalCaregiverList: React.FC = () => {
  const { animalcaregivers } = useAnimalCaregiverContext();
  const { animalcaregiversForm } = useAnimalCaregiverFormContext();
  const { animalcaregiverAds } = useAnimalCaregiverAdsContext();

  console.log("Context animalcaregiverAds  state:", animalcaregiverAds);
  console.log("Context animalcaregivers state:", animalcaregivers);
  console.log("Context animalcaregiversForm state:", animalcaregiversForm);

  const { phone } = useParams<{ phone: string }>();
  const { userType } = useParams<{ userType: string }>();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  type FilterType = {
    location: string;
    age: string;
    gender: string;
    experience: string;
    hourlycharge: string;
  };

  const defaultFilter = {
    location: undefined,
    age: undefined,
    gender: undefined,
    experience: undefined,
    hourlycharge: undefined,
  };

  const savedFilterState = localStorage.getItem("filterState");

  const initialFilterState = savedFilterState
    ? JSON.parse(savedFilterState)
    : defaultFilter;

  // State for filter
  const [filter, setFilter] = useState<FilterType>(initialFilterState);

  // Save the filter state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("filterState", JSON.stringify(filter));
  }, [filter]);

  const handleFilterChange = (newFilter: Partial<FilterType>) => {
    // Since newFilter might not contain all properties of FilterType, we're using Partial
    setFilter((prevFilter) => ({
      ...prevFilter,
      ...newFilter,
    }));
  };

  console.log("filter:----", filter);

  // Your filtered animalcaregiversForm
  const filteredanimalcaregiversForm = animalcaregiversForm.filter(
    (animalcaregiverform) => {
      const correspondingCaregiver = animalcaregivers.find(
        (cg) => cg.animalcaregiverid === animalcaregiverform.id
      );

      if (!correspondingCaregiver) {
        // If you can't find a corresponding caregiver, decide if you want to filter out or keep this entry
        return false;
      }

      // 1. Check location
      if (
        filter.location &&
        !animalcaregiverform.location?.some(
          (option) => option.value === filter.location
        )
      ) {
        return false;
      }

      // 2. Check age
      if (filter.age) {
        if (animalcaregiverform.age == null) {
          // Check if age is null
          return false;
        }

        const [minAge, maxAge] = filter.age.split("-").map(Number);

        if (isNaN(maxAge)) {
          // If maxAge is 'NaN', then the age range is something like "56+"
          if (animalcaregiverform.age < minAge) {
            return false;
          }
        } else {
          if (
            animalcaregiverform.age < minAge ||
            animalcaregiverform.age > maxAge
          ) {
            return false;
          }
        }
      }

      // 3. Check gender
      if (filter.gender && animalcaregiverform.gender !== filter.gender) {
        return false;
      }

      // 4. Check experience
      if (filter.experience) {
        if (animalcaregiverform.years_of_experience == null) {
          // Check if years_of_experience is null
          return false;
        }

        const [minExp, maxExp] = filter.experience.split("-").map(Number);

        if (isNaN(maxExp)) {
          // If maxExp is 'NaN', then the experience range is something like ">10"
          if (animalcaregiverform.years_of_experience < minExp) {
            return false;
          }
        } else {
          if (
            animalcaregiverform.years_of_experience < minExp ||
            animalcaregiverform.years_of_experience > maxExp
          ) {
            return false;
          }
        }
      }

      // 5. Check hourly charge
      if (filter.hourlycharge) {
        console.log("Checking hourlycharge filter");

        if (correspondingCaregiver.hourlycharge == null) {
          console.log(
            "Hourly charge is null for caregiver:",
            correspondingCaregiver
          );
          return false;
        }

        const charge = Number(correspondingCaregiver.hourlycharge);

        if (filter.hourlycharge === "<10" && charge >= 10) {
          console.log(
            "Filtering out caregiver with hourly charge:",
            correspondingCaregiver.hourlycharge
          );
          return false;
        }

        if (filter.hourlycharge === "40+" && charge < 40) {
          console.log(
            "Filtering out caregiver with hourly charge:",
            correspondingCaregiver.hourlycharge
          );
          return false;
        }

        if (filter.hourlycharge.includes("-")) {
          const [minCharge, maxCharge] = filter.hourlycharge
            .split("-")
            .map(Number);

          if (charge < minCharge || charge > maxCharge) {
            console.log(
              "Filtering out caregiver with hourly charge:",
              correspondingCaregiver.hourlycharge
            );
            return false;
          }
        }
      }

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
          {/* <Link
            to={`/animalcareneeders/phone/${phone}`}
            className="no-underline py-1 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            宠托师雇主广告
          </Link> */}
          <Link
            to={`/chatmessagehub?loggedInUser=${phone}&userType=${userType}`}
          >
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
          {/* <Link
            to={`/animalcareneeders/phone/${phone}`}
            className="block text-left no-underline py-1 px-2 text-black hover:underline"
          >
            宠托师雇主广告
          </Link> */}
          <Link
            to={`/chatmessagehub?loggedInUser=${phone}&userType=${userType}`}
            className="block text-left no-underline py-1 px-2 text-black hover:underline"
          >
            消息
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

      <div className="flex flex-row w-full">
        {/* Left sidebar for `CaregiverFilter` */}
        <div className="w-1/4 p-2 md:p-4 border-r flex justify-center">
          <CaregiverFilter
            onFilterChange={handleFilterChange}
            filterValues={filter}
          />
        </div>

        {/* Right main content area */}
        <div className="flex flex-col items-center space-y-2 md:space-y-4 w-3/4 p-2 md:p-4">
          {/* Adjusted text sizes for main content */}
          <div className="text-center w-full text-lg md:text-xl font-medium md:font-semibold mb-1 md:mb-3">
            宠托师
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
                phoneNumber={phone}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnimalCaregiverList;
