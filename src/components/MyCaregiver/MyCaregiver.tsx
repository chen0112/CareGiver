import React, { useEffect, useState } from "react";
import CaregiverCard from "../CaregiverCard/CaregiverCard";
import { BiHeart } from "react-icons/bi";
import { Caregiver } from "../../types/Types";
import { Link, useParams } from "react-router-dom";

const MyCaregivers: React.FC = () => {
  const { phone } = useParams<{ phone: string }>();
  const [myCaregivers, setMyCaregivers] = useState<Caregiver[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://nginx.yongxinguanai.com/api/mycaregiver/${phone}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setMyCaregivers(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, [phone]);

  const handleCaregiverUpdate = (updatedCaregiver: Caregiver) => {
    setMyCaregivers((prevCaregivers) =>
      prevCaregivers.map((caregiver) =>
        caregiver.id === updatedCaregiver.id ? updatedCaregiver : caregiver
      )
    );
  };

  if (isLoading) {
    return <p>卖力为您加载中...</p>;
  }

  if (error) {
    return <p>错误: {error}</p>;
  }

  return (
    <div>
      <Link
        to="/"
        className="flex items-center mx-8 py-3 text-black no-underline"
      >
        <BiHeart size={30} className="text-red-500 heart-icon my-auto" />
        <h1 className="font-bold text-4xl ml-2 my-auto align-middle text-red-500">
          关爱网
        </h1>
      </Link>

      <hr className="border-t border-black-300 mx-1 my-2" />

      <div className="text-center my-4">
        <Link
          to="/signup"
          className="no-underline py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          发布新广告
        </Link>
      </div>

      <div className="flex flex-col items-center">
        {myCaregivers.map((caregiver) => (
          <CaregiverCard
            key={caregiver.id}
            caregiver={caregiver}
            loggedInUserPhone={phone}
            onUpdateCaregiver={handleCaregiverUpdate} // Pass the update handler down
          />
        ))}
      </div>
    </div>
  );
};

export default MyCaregivers;
