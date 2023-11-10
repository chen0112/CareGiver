import React, { useEffect, useState } from "react";
import CaregiverCard from "../CaregiverCard/CaregiverCard";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useCaregiverContext } from "../../../context/CaregiverContext";
import { useCaregiverAdsContext } from "../../../context/CaregiverAdsContext";
import "./CaregiverList.css";
import { BiHeart, BiMessageDetail } from "react-icons/bi";
import CaregiverFilter from "../CaregiverFilter/CaregiverFilter";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";
import { Accounts } from "../../../types/Types";
import { BASE_URL } from "../../../types/Constant";
import { defaultImageUrl } from "../../../types/Constant";
import { useAuth } from "../../../context/AuthContext";
import HeaderLogo from "../../HeaderLogoComponent/HeaderLogo";

const CaregiverList: React.FC = () => {
  const { caregivers = [] } = useCaregiverContext();
  const { caregiverAds } = useCaregiverAdsContext();

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

  // localStorage.removeItem("filterState");

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

  // Your filtered caregivers
  const filteredCaregivers =
    caregivers && caregivers.length > 0
      ? caregivers.filter((caregiver) => {
          // 1. Check location
          if (
            filter.location &&
            !caregiver.location?.some(
              (option) => option.value === filter.location
            )
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
            console.log("Checking hourlycharge filter");

            if (caregiver.hourlycharge == null) {
              console.log("Hourly charge is null for caregiver:", caregiver);
              return false;
            }

            const charge = Number(caregiver.hourlycharge);

            if (filter.hourlycharge === "<10" && charge >= 10) {
              console.log(
                "Filtering out caregiver with hourly charge:",
                caregiver.hourlycharge
              );
              return false;
            }

            if (filter.hourlycharge === "40+" && charge < 40) {
              console.log(
                "Filtering out caregiver with hourly charge:",
                caregiver.hourlycharge
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
                  caregiver.hourlycharge
                );
                return false;
              }
            }
          }

          return true;
        })
      : [];

  console.log("Filtered caregivers:", filteredCaregivers);

  return (
    <div className="relative">
      <div className="flex items-center justify-between py-1 w-full">
        <HeaderLogo />

        <div className="flex space-x-4 mr-8">
          <Link
            to={`/chatmessagehub?loggedInUser=${phone}&userType=${userType}`}
            className="flex items-center justify-center mt-0.5"
          >
            <BiMessageDetail size={24} />
          </Link>
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
                <Dropdown.Item href={`/signup_careneeder/phone/${phone}`}>
                  发布新广告
                </Dropdown.Item>
                <Dropdown.Item href={`/mycareneeder/phone/${phone}`}>
                  我的广告
                </Dropdown.Item>
                <Dropdown.Item onClick={handleSignOut}>退出登录</Dropdown.Item>
                {/* ... Add other dropdown links similarly */}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>

      <hr className="border-t border-black-300 mx-1 my-2" />

      <div className="flex flex-row w-full">
        {/* Left sidebar for `CaregiverFilter` */}
        <div className="w-1/4 p-1 md:p-4 border-r flex flex-col items-center">
          <CaregiverFilter
            onFilterChange={handleFilterChange}
            filterValues={filter}
          />
          <div className="flex flex-col space-y-3 w-4/5 mt-3 mr-4 md:mr-0 md:px-4">
            <Link
              to={`/careneeders/phone/${phone}/userType/${userType}`}
              className="no-underline  bg-regal-blue text-white text-customFontSize text-center md:text-base w-full py-2 rounded-md hover:bg-light-gray transition duration-300"
            >
              雇主招聘
            </Link>
            <Link
              to={`/animalcareneeders/phone/${phone}/userType/${userType}`}
              className="no-underline  bg-regal-blue text-white text-customFontSize text-center md:text-base w-full py-2 rounded-md hover:bg-light-gray transition duration-300"
            >
              宠托师招聘
            </Link>
            <Link
              to={`/animalcaregivers/phone/${phone}/userType/${userType}`}
              className="no-underline  bg-regal-blue text-white text-customFontSize text-center md:text-base w-full py-2 rounded-md hover:bg-light-gray transition duration-300"
            >
              宠托师广告
            </Link>
          </div>
        </div>

        {/* Right main content area */}
        <div className="flex flex-col items-center space-y-2 md:space-y-4 w-3/4 p-2 md:p-4">
          {/* Adjusted text sizes for main content */}
          <div className="text-center w-full text-xl md:text-2xl font-medium md:font-semibold mb-1 md:mb-3">
            护工广告
          </div>
          <div className="flex flex-col items-center w-full lg:grid lg:grid-cols-3">
            {filteredCaregivers.map((caregiver) => {
              const associatedAds = Array.isArray(caregiverAds)
                ? caregiverAds.find((ad) => ad.caregiver_id === caregiver.id)
                : undefined;

              return (
                <CaregiverCard
                  key={caregiver.id}
                  caregiver={caregiver}
                  caregiverAd={associatedAds}
                  className="w-full text-sm md:text-base" // Adjusted text size for cards
                  phoneNumber={phone}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverList;
