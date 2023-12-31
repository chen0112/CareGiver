import React, { useEffect, useState } from "react";
import AnimalCaregiverCard from "../AnimalCaregiverCard/AnimalCaregiverCard"; // Replace with appropriate component
import { BiHeart } from "react-icons/bi";
import { AnimalCaregiverForm } from "../../../types/Types"; // Adjust the import for Careneeder type
import { Link, useParams } from "react-router-dom";
import { useAnimalCaregiverContext } from "../../../context/AnimalCaregiverContext";
import { useAnimalCaregiverAdsContext } from "../../../context/AnimalCaregiverAdsContext";
import { BASE_URL } from "../../../types/Constant";
import ErrorComponent from "../../ErrorComponent/ErrorComponent";
import HeaderLogo from "../../HeaderLogoComponent/HeaderLogo";

const MyAnimalCaregiver: React.FC = () => {
  const { phone } = useParams<{ phone: string }>();
  const [myAnimalCaregiverForms, setMyAnimalCaregiverForm] = useState<
    AnimalCaregiverForm[]
  >([]); // Adjust the type here
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { animalcaregivers } = useAnimalCaregiverContext();
  console.log("Context animalcaregivers state:", animalcaregivers);

  const { animalcaregiverAds } = useAnimalCaregiverAdsContext();
  console.log("Context animalcaregiverAds state:", animalcaregiverAds);

  useEffect(() => {
    fetch(`${BASE_URL}/api/animalcaregiver/myanimalcaregiverform/${phone}`) // Adjust the API endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error("请先发布您的广告！");
        }
        return response.json();
      })
      .then((data) => {
        setMyAnimalCaregiverForm(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, [phone]);

  const handleAnimalCaregiverFormUpdate = (
    updatedAnimalCaregiver: AnimalCaregiverForm
  ) => {
    setMyAnimalCaregiverForm((prevAnimalCaregivers) =>
      prevAnimalCaregivers.map((animalcaregiver) =>
        animalcaregiver.id === updatedAnimalCaregiver.id
          ? updatedAnimalCaregiver
          : animalcaregiver
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
        userType={"animalcaregiver"}
        phone={phone}
      />
    );
  }
  return (
    <div>
      <HeaderLogo />

      <hr className="border-t border-black-300 mx-1 my-2" />

      <div className="text-center my-4">
        <Link
          to={`/signup_animalcaregiver/phone/${phone}`}
          className="no-underline py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          发布新广告
        </Link>
      </div>

      <div className="flex flex-col items-center space-y-2 md:space-y-4 w-full p-2 md:p-4">
        <div className="flex flex-col items-center w-full lg:grid lg:grid-cols-3">
          {myAnimalCaregiverForms.map((myAnimalCaregiverForm) => {
            // Find the associated myAnimalCaregiverdetail for this AnimalCaregiverForm
            const associatedanimalcaregiversDetail = animalcaregivers.find(
              (detail) => detail.animalcaregiverid === myAnimalCaregiverForm.id
            );

            // Find all the associated AnimalCaregiverAds for this AnimalCaregiverForm
            const associatedAds = animalcaregiverAds.find(
              (ad) => ad.animalcaregiverid === myAnimalCaregiverForm.id
            );

            return (
              <AnimalCaregiverCard
                key={myAnimalCaregiverForm.id}
                animalcaregiversForm={myAnimalCaregiverForm}
                animalcaregiver={associatedanimalcaregiversDetail} // Pass the associated schedule as a prop
                animalcaregiverAds={associatedAds}
                onUpdateanimalcaregiverForm={handleAnimalCaregiverFormUpdate}
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

export default MyAnimalCaregiver;
