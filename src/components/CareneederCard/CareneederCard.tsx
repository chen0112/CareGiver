import React from "react";
import { Careneeder } from "../../types/Types";
import { Link } from "react-router-dom";

interface CareneederCardProps {
  careneeder: Careneeder;
}

const CareneederCard: React.FC<{ careneeder: Careneeder }> = ({
  careneeder,
}) => {
  const imageStyle: React.CSSProperties = {
    objectFit: "cover",
    height: "80%",
  };

  return (
    <Link to={`/careneeders/${careneeder.id}`} className="no-underline block">
      <div className="w-full sm:w-3/4 md:w-1/2 lg:w-4/7 mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-6 flex h-62 transition-transform transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-2xl cursor-pointer hover:bg-gray-100">
        {/* Image Container */}
        <div className="flex-shrink-0 flex items-center justify-center w-1/3">
          <img
            src={careneeder.imageurl}
            alt={careneeder.name}
            style={imageStyle}
          />
        </div>
        {/* Text Container */}
        <div className="flex-grow p-6 flex flex-col justify-between">
          <h3 className="text-xl font-semibold mb-4 underline">
            {careneeder.name}
          </h3>
          {/* Explicitly added underline */}
          {/* Display selected locations */}
          <p className="text-gray-600 mb-4 pr-6 line-clamp">
            地点:{" "}
            {careneeder.location && careneeder.location.length > 0
              ? careneeder.location.map((loc) => loc.label).join(", ")
              : "未选择地点"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CareneederCard;
