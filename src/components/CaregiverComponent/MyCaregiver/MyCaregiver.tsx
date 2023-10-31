import React, { useEffect, useState } from "react";
import CaregiverCard from "../CaregiverCard/CaregiverCard";
import { BiHeart } from "react-icons/bi";
import { Caregiver } from "../../../types/Types";
import { Link, useParams } from "react-router-dom";
import { useCaregiverAdsContext } from "../../../context/CaregiverAdsContext";
import { BASE_URL } from "../../../types/Constant";
import ErrorComponent from "../../ErrorComponent/ErrorComponent";

const MyCaregivers: React.FC = () => {
  const { phone } = useParams<{ phone: string }>();
  const [myCaregivers, setMyCaregivers] = useState<Caregiver[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { caregiverAds } = useCaregiverAdsContext();
  console.log("Context careneederAds state:", caregiverAds);

  useEffect(() => {
    fetch(`${BASE_URL}/api/mycaregiver/${phone}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("请先发布您的广告！");
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
    return <ErrorComponent message={`${error}`} userType={"caregiver"}/>;
  }

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

      <div className="text-center my-4">
        <Link
          to="/signup_caregiver"
          className="no-underline py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          发布新广告
        </Link>
      </div>

      <div className="flex flex-col items-center space-y-8">
        <div className="flex flex-col items-center w-full md:w-4/5 lg:w-3/5">
          {myCaregivers.map((caregiver) => {
            // Find all the associated careneederAds for this careneeder
            const associatedAds = caregiverAds.find(
              (ad) => ad.caregiver_id === caregiver.id
            );

            return (
              <CaregiverCard
                key={caregiver.id}
                caregiver={caregiver}
                caregiverAd={associatedAds}
                onUpdateCaregiver={handleCaregiverUpdate}
                loggedInUserPhone={phone}
                className="w-full"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyCaregivers;
