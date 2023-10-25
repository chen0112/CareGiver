import React, { useEffect, useState } from "react";
import AnimalCareneederCard from "../AnimalCareneederCard/AnimalCareneederCard";
import { Link, useParams } from "react-router-dom";
import { BiHeart } from "react-icons/bi";
import { useAnimalCareneederFormContext } from "../../../context/AnimalCareneederFormContext";
import { useAnimalCareneederAdsContext } from "../../../context/AnimalCareneederAdsContext";
import { useAnimalCareneederContext } from "../../../context/AnimalCareneederContext";
import CaregiverFilter from "../../CaregiverComponent/CaregiverFilter/CaregiverFilter";

const AnimalCareneederList: React.FC = () => {
  const { animalcareneeders } = useAnimalCareneederContext();
  const { animalcareneedersForm } = useAnimalCareneederFormContext();
  const { animalcareneederAds } = useAnimalCareneederAdsContext();

  console.log("Context animalcareneederAds  state:", animalcareneederAds);
  console.log("Context animalcareneeders state:", animalcareneeders);
  console.log("Context animalcareneedersForm state:", animalcareneedersForm);

  const { phone } = useParams<{ phone: string }>();

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

  // Your filtered animalcaregiversForm
  const filteredanimalcareneedersForm = animalcareneedersForm.filter(
    (animalcareneederform) => {
      const correspondingCareneeder = animalcareneeders.find(
        (cg) => cg.animalcareneederid === animalcareneederform.id
      );

      if (!correspondingCareneeder) {
        // If you can't find a corresponding careneeder, decide if you want to filter out or keep this entry
        return false;
      }

      // 1. Check location
      if (
        filter.location &&
        !animalcareneederform.location?.some(
          (option) => option.value === filter.location
        )
      ) {
        return false;
      }

      // 2. Check age
      if (filter.age) {
        if (animalcareneederform.age == null) {
          // Check if age is null
          return false;
        }

        const [minAge, maxAge] = filter.age.split("-").map(Number);

        if (isNaN(maxAge)) {
          // If maxAge is 'NaN', then the age range is something like "56+"
          if (animalcareneederform.age < minAge) {
            return false;
          }
        } else {
          if (
            animalcareneederform.age < minAge ||
            animalcareneederform.age > maxAge
          ) {
            return false;
          }
        }
      }

      // 3. Check gender
      if (filter.gender && animalcareneederform.gender !== filter.gender) {
        return false;
      }

      // 4. Check experience
      if (filter.experience) {
        if (animalcareneederform.years_of_experience == null) {
          // Check if years_of_experience is null
          return false;
        }

        const [minExp, maxExp] = filter.experience.split("-").map(Number);

        if (isNaN(maxExp)) {
          // If maxExp is 'NaN', then the experience range is something like ">10"
          if (animalcareneederform.years_of_experience < minExp) {
            return false;
          }
        } else {
          if (
            animalcareneederform.years_of_experience < minExp ||
            animalcareneederform.years_of_experience > maxExp
          ) {
            return false;
          }
        }
      }

      // 5. Check hourly charge
      if (filter.hourlycharge) {
        console.log("Checking hourlycharge filter");

        if (correspondingCareneeder.hourlycharge == null) {
          console.log("Hourly charge is null for caregiver:", correspondingCareneeder);
          return false;
        }

        const charge = Number(correspondingCareneeder.hourlycharge);

        if (filter.hourlycharge === "<10" && charge >= 10) {
          console.log(
            "Filtering out correspondingCareneeder with hourly charge:",
            correspondingCareneeder.hourlycharge
          );
          return false;
        }

        if (filter.hourlycharge === "40+" && charge < 40) {
          console.log(
            "Filtering out correspondingCareneeder with hourly charge:",
            correspondingCareneeder.hourlycharge
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
              correspondingCareneeder.hourlycharge
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
      <div className="flex items-center justify-between py-3 ml-3 w-full">
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
            to="/signup_animalcaregiver"
            className="no-underline py-1 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            发布新广告
          </Link>
          <Link
            to={`/myanimalcaregiverform/phone/${phone}`}
            className="no-underline py-1 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            我的广告
          </Link>
          <Link
            to={`/animalcaregivers/phone/${phone}`}
            className="no-underline py-1 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            所有宠托师广告
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
            to="/signup_animalcaregiver"
            className="block text-left no-underline py-1 px-2 text-black hover:underline"
          >
            发布新广告
          </Link>
          <Link
            to={`/myanimalcaregiverform/phone/${phone}`}
            className="block text-left no-underline py-1 px-2 text-black hover:underline"
          >
            我的广告
          </Link>
          <Link
            to={`/animalcaregivers/phone/${phone}`}
            className="block text-left no-underline py-1 px-2 text-black hover:underline"
          >
            所有宠托师广告
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
            招聘宠托师
          </div>

          {filteredanimalcareneedersForm.map((animalcareneedersForm) => {
            // Find the associated careneederschedule for this careneeder
            const associatedDetails = animalcareneeders.find(
              (details) =>
                details.animalcareneederid === animalcareneedersForm.id
            );
            // Find all the associated careneederAds for this careneeder
            const associatedAds = animalcareneederAds.find(
              (ad) => ad.animalcareneederid === animalcareneedersForm.id
            );

            return (
              <AnimalCareneederCard
                key={animalcareneedersForm.id}
                animalcareneedersForm={animalcareneedersForm}
                animalcareneeder={associatedDetails} // Pass the associated schedule as a prop
                animalcareneederAds={associatedAds}
                className="w-full"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnimalCareneederList;
