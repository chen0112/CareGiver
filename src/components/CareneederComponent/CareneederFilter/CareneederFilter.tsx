import React, { useState } from "react";
import { LOCATION_OPTIONS } from "../../../types/Constant";

// This is your filter props definition, which you can extend as needed
interface CareneederFilterProps {
  onFilterChange: (filter: any) => void;
}

const CareneederFilter: React.FC<CareneederFilterProps> = ({
  onFilterChange,
}) => {
  const [location, setLocation] = useState<string>("");

  // Triggered when any filter changes
  const handleFilterChange = (newFilter: { location: string }) => {
    onFilterChange(newFilter);
  };

  return (
    <div className="p-4 rounded-lg shadow-md">
      <label>
        地点:
        <select
          value={location}
          onChange={(e) => {
            const newLocation = e.target.value;
            setLocation(newLocation);
            const newFilter = {
              location: newLocation,
            };
            handleFilterChange(newFilter); // Update this line
          }}
        >
          <option value="">筛选地点</option>
          {LOCATION_OPTIONS.map((loc) => (
            <option key={loc.value} value={loc.value}>
              {loc.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default CareneederFilter;
