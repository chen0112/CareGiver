// CaregiverList.tsx
import React from "react";
import CareneederCard from "../CareneederCard/CareneederCard";
import { Link } from "react-router-dom";
import { useCareneederContext } from "../../context/CareneederContext";
import { BiHeart } from "react-icons/bi";

const CareneederList: React.FC = () => {
  const { careneeders } = useCareneederContext();

  console.log("Context careneeders state:", careneeders);

  return (
    <div>
      <div className="flex items-center mx-9 py-3">
        <Link
          to="/"
          className="flex items-center text-black no-underline ml-0" // Remove 'mx-8 py-3' and add 'ml-0' to push it to the far left
        >
          <BiHeart size={30} className="text-red-500 heart-icon my-auto" />
          <h1 className="font-bold text-3xl ml-2 my-auto align-middle text-red-500">
            关爱网
          </h1>
        </Link>
      </div>

      <hr className="border-t border-black-300 mx-1 my-2" />
      
      <div className="flex flex-col items-center">
        {careneeders.map((careneeder) => (
          <CareneederCard key={careneeder.id} careneeder={careneeder} />
        ))}
      </div>
    </div>
  );
};

export default CareneederList;
