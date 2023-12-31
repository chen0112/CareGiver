import React, { useState, useEffect } from "react";
import CareneederCard from "../CareneederCard/CareneederCard";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCareneederContext } from "../../../context/CareneederContext";
import { BiHeart, BiMessageDetail } from "react-icons/bi";
import { useCareneederScheduleContext } from "../../../context/CareneederScheduleContext";
import { useCareneederAdsContext } from "../../../context/CareneederAdsContext";
import CareneederFilter from "../CareneederFilter/CareneederFilter"; // Import the filter component
import { Accounts } from "../../../types/Types";
import { BASE_URL } from "../../../types/Constant";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";
import { defaultImageUrl } from "../../../types/Constant";
import { useAuth } from "../../../context/AuthContext";
import HeaderLogo from "../../HeaderLogoComponent/HeaderLogo";

const CareneederList: React.FC = () => {
  const { careneeders = [] } = useCareneederContext();
  const { careneedersSchedule } = useCareneederScheduleContext();
  const { careneederAds } = useCareneederAdsContext();

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
    hourlycharge: string;
    live_in_care?: boolean;
    live_out_care?: boolean;
    domestic_work?: boolean;
    meal_preparation?: boolean;
    companionship?: boolean;
    washing_dressing?: boolean;
    nursing_health_care?: boolean;
    mobility_support?: boolean;
    transportation?: boolean;
    errands_shopping?: boolean;
  };

  const defaultFilter = {
    location: undefined,
    hourlycharge: undefined,
    live_in_care: undefined,
    live_out_care: undefined,
    domestic_work: undefined,
    meal_preparation: undefined,
    companionship: undefined,
    washing_dressing: undefined,
    nursing_health_care: undefined,
    mobility_support: undefined,
    transportation: undefined,
    errands_shopping: undefined,
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

  const filteredCareneeders =
    careneeders && careneeders.length > 0
      ? careneeders.filter((careneeder) => {
          // 1. Check location
          if (
            filter.location &&
            !careneeder.location?.some(
              (option) => option.value === filter.location
            )
          ) {
            return false;
          }

          // 2. Check hourly charge
          if (filter.hourlycharge) {
            console.log("Checking hourlycharge filter");

            if (careneeder.hourlycharge == null) {
              console.log("Hourly charge is null for caregiver:", careneeder);
              return false;
            }

            const charge = Number(careneeder.hourlycharge);

            if (filter.hourlycharge === "<10" && charge >= 10) {
              console.log(
                "Filtering out careneeder with hourly charge:",
                careneeder.hourlycharge
              );
              return false;
            }

            if (filter.hourlycharge === "40+" && charge < 40) {
              console.log(
                "Filtering out careneeder with hourly charge:",
                careneeder.hourlycharge
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
                  careneeder.hourlycharge
                );
                return false;
              }
            }
          }

          // Check live_in_care
          if (
            filter.live_in_care !== undefined &&
            careneeder.live_in_care !== filter.live_in_care
          ) {
            return false;
          }

          // Check live_out_care
          if (
            filter.live_out_care !== undefined &&
            careneeder.live_out_care !== filter.live_out_care
          ) {
            return false;
          }

          // Check domestic_work
          if (
            filter.domestic_work !== undefined &&
            careneeder.domestic_work !== filter.domestic_work
          ) {
            return false;
          }

          // Check meal_preparation
          if (
            filter.meal_preparation !== undefined &&
            careneeder.meal_preparation !== filter.meal_preparation
          ) {
            return false;
          }

          // Check companionship
          if (
            filter.companionship !== undefined &&
            careneeder.companionship !== filter.companionship
          ) {
            return false;
          }

          // Check mobility_support
          if (
            filter.mobility_support !== undefined &&
            careneeder.mobility_support !== filter.mobility_support
          ) {
            return false;
          }

          // Check transportation
          if (
            filter.transportation !== undefined &&
            careneeder.transportation !== filter.transportation
          ) {
            return false;
          }

          // Check errands_shopping
          if (
            filter.errands_shopping !== undefined &&
            careneeder.errands_shopping !== filter.errands_shopping
          ) {
            return false;
          }

          return true; // If all checks pass, return true
        })
      : [];

  console.log("Filtered careneeders:", filteredCareneeders);

  return (
    <div className="relative">
      <div className="flex items-center justify-between py-1 ml-1 w-full">
      < HeaderLogo/>

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
                <Dropdown.Item href={`/signup_caregiver/phone/${phone}`}>
                  发布护工新广告
                </Dropdown.Item>
                <Dropdown.Item href={`/mycaregiver/phone/${phone}`}>
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
        <div className="w-1/4 p-1 md:p-4 border-r flex flex-col items-center">
          <CareneederFilter
            onFilterChange={handleFilterChange}
            filterValues={filter}
          />
          <div className="flex flex-col space-y-3 w-4/5 mt-3 mr-4 md:mr-0 md:px-4">
            <Link
              to={`/caregivers/phone/${phone}/userType/${userType}`}
              className="no-underline  bg-regal-blue text-white text-customFontSize text-center md:text-base w-full py-2 rounded-md hover:bg-light-gray transition duration-300"
            >
              护工广告
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

        <div className="flex flex-col items-center space-y-2 md:space-y-4 w-3/4 p-2 md:p-4">
          <div className="text-center w-full text-xl md:text-2xl font-semibold md:font-semibold mb-1 md:mb-3">
            雇主广告
          </div>
          <div className="flex flex-col items-center w-full lg:grid lg:grid-cols-3">
            {filteredCareneeders.map((careneeder) => {
              // Find the associated careneederschedule for this careneeder
              const associatedSchedule = Array.isArray(careneedersSchedule)?careneedersSchedule.find(
                (schedule) => schedule.careneeder_id === careneeder.id
              ):undefined;
              // Find all the associated careneederAds for this careneeder
              const associatedAds = Array.isArray(careneederAds)?careneederAds.find(
                (ad) => ad.careneeder_id === careneeder.id
              ):undefined;

              return (
                <CareneederCard
                  key={careneeder.id}
                  careneeder={careneeder}
                  careneederSchedule={associatedSchedule} // Pass the associated schedule as a prop
                  careneederAd={associatedAds}
                  className="w-full"
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

export default CareneederList;
