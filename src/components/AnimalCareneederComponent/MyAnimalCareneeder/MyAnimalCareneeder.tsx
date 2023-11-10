import React, { useEffect, useState } from "react";
import AnimalCareneederCard from "../AnimalCareneederCard/AnimalCareneederCard"; // Replace with appropriate component
import { BiHeart } from "react-icons/bi";
import { AnimalCareneederForm } from "../../../types/Types"; // Adjust the import for Careneeder type
import { Link, useParams } from "react-router-dom";
import { useAnimalCareneederContext } from "../../../context/AnimalCareneederContext";
import { useAnimalCareneederAdsContext } from "../../../context/AnimalCareneederAdsContext";
import { BASE_URL } from "../../../types/Constant";
import ErrorComponent from "../../ErrorComponent/ErrorComponent";
import HeaderLogo from "../../HeaderLogoComponent/HeaderLogo";

const MyAnimalCareneeder: React.FC = () => {
  const { phone } = useParams<{ phone: string }>();
  const [myAnimalCareneederForms, setMyAnimalCareneederForm] = useState<
    AnimalCareneederForm[]
  >([]); // Adjust the type here
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { animalcareneeders } = useAnimalCareneederContext();
  console.log("Context animalcareneeders state:", animalcareneeders);

  const { animalcareneederAds } = useAnimalCareneederAdsContext();
  console.log("Context animalcareneederAds state:", animalcareneederAds);

  useEffect(() => {
    fetch(`${BASE_URL}/api/myanimalcareneederform/${phone}`) // Adjust the API endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error("请先发布您的广告！");
        }
        return response.json();
      })
      .then((data) => {
        setMyAnimalCareneederForm(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, [phone]);

  const handleAnimalCareneederFormUpdate = (
    updatedAnimalCareneeder: AnimalCareneederForm
  ) => {
    setMyAnimalCareneederForm((prevAnimalCareneeders) =>
      prevAnimalCareneeders.map((animalcareneeder) =>
        animalcareneeder.id === updatedAnimalCareneeder.id
          ? updatedAnimalCareneeder
          : animalcareneeder
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
        userType={"animalcareneeder"}
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
          to={`/signup_animalcareneeder/phone/${phone}`}
          className="no-underline py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          发布新广告
        </Link>
      </div>

      <div className="flex flex-col items-center space-y-2 md:space-y-4 w-full p-2 md:p-4">
        <div className="flex flex-col items-center w-full lg:grid lg:grid-cols-3">
          {myAnimalCareneederForms.map((myAnimalCareneederForm) => {
            // Find the associated myAnimalCareneederdetail for this AnimalCareneederForm
            const associatedanimalcareneedersDetail = animalcareneeders.find(
              (detail) =>
                detail.animalcareneederid === myAnimalCareneederForm.id
            );

            // Find all the associated AnimalCareneederAds for this AnimalCareneederForm
            const associatedAds = animalcareneederAds.find(
              (ad) => ad.animalcareneederid === myAnimalCareneederForm.id
            );

            return (
              <AnimalCareneederCard
                key={myAnimalCareneederForm.id}
                animalcareneedersForm={myAnimalCareneederForm}
                animalcareneeder={associatedanimalcareneedersDetail} // Pass the associated schedule as a prop
                animalcareneederAds={associatedAds}
                onUpdateanimalcareneederForm={handleAnimalCareneederFormUpdate}
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

export default MyAnimalCareneeder;
