import React, { useEffect, useState } from "react";
import CareneederCard from "../CareneederCard/CareneederCard"; // Replace with appropriate component
import { BiHeart } from "react-icons/bi";
import { Careneeder } from "../../../types/Types"; // Adjust the import for Careneeder type
import { Link, useParams } from "react-router-dom";
import { useCareneederScheduleContext } from "../../../context/CareneederScheduleContext";
import { useCareneederAdsContext } from "../../../context/CareneederAdsContext";
import { BASE_URL } from "../../../types/Constant";
import ErrorComponent from "../../ErrorComponent/ErrorComponent";
import HeaderLogo from "../../HeaderLogoComponent/HeaderLogo";

const MyCareneeders: React.FC = () => {
  const { phone } = useParams<{ phone: string }>();
  const [myCareneeders, setMyCareneeders] = useState<Careneeder[]>([]); // Adjust the type here
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { careneedersSchedule } = useCareneederScheduleContext();
  console.log("Context careneederSchedule state:", careneedersSchedule);

  const { careneederAds } = useCareneederAdsContext();
  console.log("Context careneederAds state:", careneederAds);

  useEffect(() => {
    fetch(`${BASE_URL}/api/careneeder/mycareneeder/${phone}`) // Adjust the API endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error("请先发布您的广告！");
        }
        return response.json();
      })
      .then((data) => {
        setMyCareneeders(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, [phone]);

  const handleCareneederUpdate = (updatedCareneeder: Careneeder) => {
    setMyCareneeders((prevCareneeders) =>
      prevCareneeders.map((careneeder) =>
        careneeder.id === updatedCareneeder.id ? updatedCareneeder : careneeder
      )
    );
  };

  if (isLoading) {
    return <p>卖力为您加载中...</p>;
  }

  if (error) {
    return (
      <ErrorComponent
        message={`${error}`}
        userType={"careneeder"}
        phone={phone}
      />
    );
  }

  return (
    <div>
      <HeaderLogo />

      <hr className="border-t border-black-300 mx-1 my-1" />

      <div className="text-center my-4">
        <Link
          to={`/signup_careneeder/phone/${phone}`}
          className="no-underline py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          发布新广告
        </Link>
      </div>

      <div className="flex flex-col items-center space-y-2 md:space-y-4 w-full p-2 md:p-4">
        <div className="flex flex-col items-center w-full lg:grid lg:grid-cols-3">
          {myCareneeders.map((careneeder) => {
            // Find the associated careneederschedule for this careneeder
            const associatedSchedule = careneedersSchedule.find(
              (schedule) => schedule.careneeder_id === careneeder.id
            );

            // Find all the associated careneederAds for this careneeder
            const associatedAds = careneederAds.find(
              (ad) => ad.careneeder_id === careneeder.id
            );

            return (
              <CareneederCard
                key={careneeder.id}
                careneeder={careneeder}
                careneederSchedule={associatedSchedule} // Pass the associated schedule as a prop
                careneederAd={associatedAds}
                onUpdateCareneeder={handleCareneederUpdate}
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

export default MyCareneeders;
