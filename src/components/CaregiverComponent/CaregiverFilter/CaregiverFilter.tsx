import React, { useEffect, useState } from "react";
import { LOCATION_OPTIONS } from "../../../types/Constant";

const AGE_OPTIONS = ["18-25", "26-35", "36-45", "46-55", "56+"];
const GENDER_OPTIONS = ["男性", "女性"];
const EXPERIENCE_OPTIONS = ["<1", "1-3", "4-6", "7-10", ">10"];
const HOURLYCHARGE_OPTIONS = ["<10", "10-20", "21-30", "31-40", "40+"];

interface CaregiverFilterProps {
  onFilterChange: (filter: any) => void;
  filterValues: FilterType;
}

type FilterType = {
  location: string;
  age: string;
  gender: string;
  experience: string;
  hourlycharge: string;
};

const CaregiverFilter: React.FC<CaregiverFilterProps> = ({
  onFilterChange,
  filterValues,
}) => {
  const [location, setLocation] = useState<string | undefined>(
    filterValues.location
  );
  const [age, setAge] = useState<string | undefined>(filterValues.age);
  const [gender, setGender] = useState<string | undefined>(filterValues.gender);
  const [experience, setExperience] = useState<string | undefined>(
    filterValues.experience
  );
  const [hourlycharge, setHourlyCharge] = useState<string | undefined>(
    filterValues.hourlycharge
  );

  const handleImmediateFilterChange = (
    stateKey: string,
    updateFunction: Function,
    value: any
  ) => {
    if (typeof value === "string" && !value) {
      value = undefined;
    }
    updateFunction(value);

    const newFilter = {
      location,
      age,
      gender,
      experience,
      hourlycharge,
      [stateKey]: value,
    };
    console.log("Updated Filter:", newFilter);
    onFilterChange(newFilter);
  };

  useEffect(() => {
    setLocation(filterValues.location);
    setHourlyCharge(filterValues.hourlycharge);
    setGender(filterValues.gender);
    setExperience(filterValues.experience);
    setAge(filterValues.age);
  }, [filterValues]);

  const defaultFilter = {
    location: undefined,
    age: undefined,
    gender: undefined,
    experience: undefined,
    hourlycharge: undefined,
  };

  const resetFilters = () => {
    // Set all local filter states to undefined
    setLocation(undefined);
    setAge(undefined);
    setGender(undefined);
    setExperience(undefined);
    setHourlyCharge(undefined);

    // Notify the parent component that the filters have been reset to their defaults
    onFilterChange(defaultFilter);
  };

  return (
    <div>
      <div className="flex flex-col mb-2 md:mb-4">
        <select
          value={location || ""}
          onChange={(e) => {
            const value = e.target.value || undefined;
            handleImmediateFilterChange("location", setLocation, value);
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
          value={age || ""}
          onChange={(e) => {
            const value = e.target.value || undefined;
            handleImmediateFilterChange("age", setAge, value);
          }}
          className="text-xs md:text-base w-4/5 md:w-full"
        >
          <option value="">选择年龄</option>
          {AGE_OPTIONS.map((ageRange) => (
            <option key={ageRange} value={ageRange}>
              {ageRange}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col mb-2 md:mb-4">
        <select
          value={gender || ""}
          onChange={(e) => {
            const value = e.target.value || undefined;
            handleImmediateFilterChange("gender", setGender, value);
          }}
          className="text-xs md:text-base w-4/5 md:w-full"
        >
          <option value="">选择性别</option>
          {GENDER_OPTIONS.map((gen) => (
            <option key={gen} value={gen}>
              {gen}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col mb-2 md:mb-4">
        <select
          value={experience || ""}
          onChange={(e) => {
            const value = e.target.value || undefined;
            handleImmediateFilterChange("experience", setExperience, value);
          }}
          className="text-xs md:text-base w-4/5 md:w-full"
        >
          <option value="">选择经验(年)</option>
          {EXPERIENCE_OPTIONS.map((exp) => (
            <option key={exp} value={exp}>
              {exp}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col mb-2 md:mb-4">
        <select
          value={hourlycharge || ""}
          onChange={(e) => {
            const value = e.target.value || undefined;
            handleImmediateFilterChange("hourlycharge", setHourlyCharge, value);
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
      <button
        onClick={resetFilters}
        className="text-customFontSize md:text-base w-4/5 md:w-full mt-4 px-2 py-2 bg-gray-800 text-white rounded"
      >
        重置筛选
      </button>
    </div>
  );
};

export default CaregiverFilter;
