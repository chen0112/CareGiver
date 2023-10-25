import React, { useEffect, useState } from "react";
import { LOCATION_OPTIONS } from "../../../types/Constant";

const HOURLYCHARGE_OPTIONS = ["<10", "10-20", "21-30", "31-40", "40+"];

interface CareneederFilterProps {
  onFilterChange: (filter: any) => void;
  filterValues: FilterType;
}

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

const CareneederFilter: React.FC<CareneederFilterProps> = ({
  onFilterChange,
  filterValues
}) => {
  const [location, setLocation] = useState(filterValues.location);
  const [hourlycharge, setHourlyCharge] = useState(filterValues.hourlycharge);

  const [live_in_care, setLiveInCare] = useState(filterValues.live_in_care);
  const [live_out_care, setLiveOutCare] = useState(filterValues.live_out_care);
  const [domestic_work, setDomesticWork] = useState(filterValues.domestic_work);
  const [meal_preparation, setMealPreparation] = useState(filterValues.meal_preparation);
  const [companionship, setCompanionship] = useState(filterValues.companionship);
  const [mobility_support, setMobilitySupport] = useState(filterValues.mobility_support);
  const [transportation, setTransportation] = useState(filterValues.transportation);
  const [errands_shopping, setErrandsShopping] = useState(filterValues.errands_shopping);

  const handleImmediateFilterChange = (
    stateKey: string,
    updateFunction: Function,
    value: any
  ) => {
    if (typeof value === "boolean" && !value) {
      value = undefined;
    }
    updateFunction(value);
    const newFilter = {
      location,
      hourlycharge,
      live_in_care,
      live_out_care,
      domestic_work,
      meal_preparation,
      companionship,
      mobility_support,
      transportation,
      errands_shopping,
      [stateKey]: value,
    };

    console.log("Updated Filter:", newFilter);

    onFilterChange(newFilter);
  };

  useEffect(() => {
    setLocation(filterValues.location);
    setHourlyCharge(filterValues.hourlycharge);
    setLiveInCare(filterValues.live_in_care );
    setLiveOutCare(filterValues.live_out_care );
  setDomesticWork(filterValues.domestic_work );
  setMealPreparation(filterValues.meal_preparation );
  setCompanionship(filterValues.companionship );
  setMobilitySupport(filterValues.mobility_support);
  setTransportation(filterValues.transportation );
  setErrandsShopping(filterValues.errands_shopping );
}, [filterValues]);
  return (
    <div>
      <div className="flex flex-col mb-2 md:mb-4">
        <select
          value={location}
          onChange={(e) =>{
            const value = e.target.value || undefined;
            handleImmediateFilterChange("location", setLocation, value)
          }}
          className="text-xs md:text-base w-4/5 md:w-full"
        >
          <option value="">选择地点</option>
          {LOCATION_OPTIONS.map((loc) => (
            <option key={loc.value} value={loc.value}>
              {loc.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col mb-2 md:mb-4">
        <select
          value={hourlycharge}
          onChange={(e) =>{
            const value = e.target.value || undefined;
            handleImmediateFilterChange(
              "hourlycharge",
              setHourlyCharge,
              value
            )
          }}
          className="text-xs md:text-base w-4/5 md:w-full"
        >
          <option value="">选择时薪</option>
          {HOURLYCHARGE_OPTIONS.map((chargeRange) => (
            <option key={chargeRange} value={chargeRange}>
              {chargeRange}
            </option>
          ))}
        </select>
      </div>

      {/* Add checkboxes for boolean filters */}
      <div className="flex flex-col mb-2 md:mb-4">
        <label className="text-customFontSize md:text-base w-4/5 md:w-full">
          <input
            type="checkbox"
            className="mr-2"
            checked={live_in_care}
            onChange={(e) =>
              handleImmediateFilterChange(
                "live_in_care",
                setLiveInCare,
                e.target.checked
              )
            }
          />
          住家照顾
        </label>
      </div>

      <div className="flex flex-col mb-2 md:mb-4">
        <label className="text-customFontSize md:text-base w-4/5 md:w-full">
          <input
            type="checkbox"
            className="mr-2"
            checked={live_out_care}
            onChange={(e) =>
              handleImmediateFilterChange(
                "live_out_care",
                setLiveOutCare,
                e.target.checked
              )
            }
          />
          不住家照顾
        </label>
      </div>

      <div className="flex flex-col mb-2 md:mb-4">
        <label className="text-customFontSize md:text-base w-4/5 md:w-full">
          <input
            type="checkbox"
            className="mr-2"
            checked={domestic_work}
            onChange={(e) =>
              handleImmediateFilterChange(
                "domestic_work",
                setDomesticWork,
                e.target.checked
              )
            }
          />
          做家务
        </label>
      </div>
      <div className="flex flex-col mb-2 md:mb-4">
        <label className="text-customFontSize md:text-base w-4/5 md:w-full">
          <input
            type="checkbox"
            className="mr-2"
            checked={meal_preparation}
            onChange={(e) =>
              handleImmediateFilterChange(
                "meal_preparation",
                setMealPreparation,
                e.target.checked
              )
            }
          />
          可以备餐
        </label>
      </div>
      <div className="flex flex-col mb-2 md:mb-4">
        <label className="text-customFontSize md:text-base w-4/5 md:w-full">
          <input
            type="checkbox"
            className="mr-2"
            checked={companionship}
            onChange={(e) =>
              handleImmediateFilterChange(
                "companionship",
                setCompanionship,
                e.target.checked
              )
            }
          />
          可陪护
        </label>
      </div>
      <div className="flex flex-col mb-2 md:mb-4">
        <label className="text-customFontSize md:text-base w-4/5 md:w-full">
          <input
            type="checkbox"
            className="mr-2"
            checked={mobility_support}
            onChange={(e) =>
              handleImmediateFilterChange(
                "mobility_support",
                setMobilitySupport,
                e.target.checked
              )
            }
          />
          可辅助行动
        </label>
      </div>
      <div className="flex flex-col mb-2 md:mb-4">
        <label className="text-customFontSize md:text-base w-4/5 md:w-full">
          <input
            type="checkbox"
            className="mr-2"
            checked={transportation}
            onChange={(e) =>
              handleImmediateFilterChange(
                "transportation",
                setTransportation,
                e.target.checked
              )
            }
          />
          可辅助出行
        </label>
      </div>
      <div className="flex flex-col mb-2 md:mb-4">
        <label className="text-customFontSize md:text-base w-4/5 md:w-full">
          <input
            type="checkbox"
            className="mr-2"
            checked={errands_shopping}
            onChange={(e) =>
              handleImmediateFilterChange(
                "errands_shopping",
                setErrandsShopping,
                e.target.checked
              )
            }
          />
          可外出买菜/买东西
        </label>
      </div>
    </div>
  );
};

export default CareneederFilter;
