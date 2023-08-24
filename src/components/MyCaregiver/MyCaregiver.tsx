import React, { useEffect, useState } from "react";
import CaregiverCard from "../CaregiverCard/CaregiverCard";
import { BiHeart } from "react-icons/bi";
import { Caregiver } from "../../types/Types";
import { useParams } from "react-router-dom";

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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <div className="flex items-center mx-9 py-3">
        <BiHeart size={30} className="text-red-500 heart-icon my-auto" />
        <h1 className="font-bold text-4xl ml-2 my-auto align-middle text-red-500">
          我的关爱网广告
        </h1>
      </div>

      <hr className="border-t border-black-300 mx-1 my-2" />

      <div className="flex flex-col items-center">
        {myCaregivers.map((caregiver) => (
          <CaregiverCard key={caregiver.id} caregiver={caregiver} loggedInUserPhone={phone}  />
        ))}
      </div>
    </div>
  );
};

export default MyCaregivers;
