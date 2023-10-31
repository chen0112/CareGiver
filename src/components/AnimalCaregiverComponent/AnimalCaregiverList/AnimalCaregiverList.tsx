// CaregiverList.tsx
import React, { useEffect, useState } from "react";
import AnimalCaregiverCard from "../AnimalCaregiverCard/AnimalCaregiverCard";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAnimalCaregiverContext } from "../../../context/AnimalCaregiverContext";
import { BiHeart, BiMessageDetail } from "react-icons/bi";
import { useAnimalCaregiverAdsContext } from "../../../context/AnimalCaregiverAdsContext";
import { useAnimalCaregiverFormContext } from "../../../context/AnimalCaregiverFormContext";
import CaregiverFilter from "../../CaregiverComponent/CaregiverFilter/CaregiverFilter";
import { Accounts } from "../../../types/Types";
import { BASE_URL } from "../../../types/Constant";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";
import { defaultImageUrl } from "../../../types/Constant";
import { useAuth } from "../../../context/AuthContext";

const AnimalCaregiverList: React.FC = () => {
  const { animalcaregivers } = useAnimalCaregiverContext();
  const { animalcaregiversForm } = useAnimalCaregiverFormContext();
  const { animalcaregiverAds } = useAnimalCaregiverAdsContext();

  const { phone } = useParams<{ phone: string }>();
  const { userType } = useParams<{ userType: string }>();

  const [accountData, setAccountData] = useState<Accounts | null>(null);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(); // this might be asynchronous depending on your implementation
      navigate("/"); // navigate to the homepage after sign out
    } catch (error) {
      console.error("Error signing out:", error);
    }
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

  useEffect(() => {
    fetch(`${BASE_URL}/api/account/${phone}`)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            console.error("Server response:", text);
            throw new Error("Network response was not ok");
          });
        }
        return response.json();
      })
      .then((data) => {
        setAccountData(data);
      })
      .catch((error) => {
        console.error("There was a problem fetching account data:", error);
      });
  }, [phone]);

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
      <div className="flex items-center justify-between py-3 ml-3 w-full">
        <Link to="/" className="flex items-center text-black no-underline">
          <BiHeart
            size={30}
            className="text-red-500 heart-icon my-auto ml-4 hidden md:block"
          />
          <h1 className="font-bold text-3xl ml-2 my-auto align-middle text-red-500">
            关爱网
          </h1>
        </Link>

        <div className="flex space-x-4 mr-8">
          {accountData && (
            <Dropdown>
              <Dropdown.Toggle
                as="div"
                variant="link"
                id="dropdown-basic"
                className="flex items-center space-x-2 cursor-pointer"
              >
                <img
                  src={accountData.imageurl || defaultImageUrl}
                  alt="Profile"
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full"
                />
                <span className="text-black">{accountData.name}</span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href={`/signup_animalcareneeder/phone/${phone}`}>
                  发布新广告
                </Dropdown.Item>
                <Dropdown.Item href={`/myanimalcareneederform/phone/${phone}`}>
                  我的广告
                </Dropdown.Item>
                <Dropdown.Item onClick={handleSignOut}>退出登录</Dropdown.Item>
                {/* ... Add other dropdown links similarly */}
              </Dropdown.Menu>
            </Dropdown>
          )}
          <Link
            to={`/chatmessagehub?loggedInUser=${phone}&userType=${userType}`}
            className="flex items-center justify-center"
          >
            <BiMessageDetail size={24} />
          </Link>
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
