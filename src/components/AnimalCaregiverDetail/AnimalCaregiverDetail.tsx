import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AnimalCaregiverForm } from "../../types/Types";
import { Link } from "react-router-dom";
import { BiHeart } from "react-icons/bi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useAnimalCaregiverAdsContext } from "../../context/AnimalCaregiverAdsContext";


const AnimalCaregiverDetail: React.FC = () => {
  const { id } = useParams();
  const [AnimalCaregiverForm, setAnimalCaregiverForm] = useState<AnimalCaregiverForm | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { animalcaregiverAds } = useAnimalCaregiverAdsContext();

  console.log("Context animalcaregiverAds state:", animalcaregiverAds);

  useEffect(() => {
    fetch(`https://nginx.yongxinguanai.com/api/all_animalcaregiverform/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAnimalCaregiverForm(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <p>卖力为您加载中...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const associatedAds = AnimalCaregiverForm
    ? animalcaregiverAds?.find((ad) => ad.animalcaregiverid === AnimalCaregiverForm.id)
    : null;

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

      <div className="flex flex-col items-center justify-start min-h-screen space-y-6 px-4 md:px-0">
        {/* Top section */}
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-start p-4 bg-white shadow-md rounded-lg">
          {/* Image section */}
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
            <img
              className="w-32 h-32 rounded-full"
              src={AnimalCaregiverForm?.imageurl}
              alt={AnimalCaregiverForm?.name}
            />
          </div>

          {/* Details section */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl md:text-2xl font-semibold mr-6">
                {AnimalCaregiverForm?.name}
              </h2>
              <FaMapMarkerAlt className="text-gray-600 mb-2" />
              <p className="text-gray-600 font-semibold mt-2">
                {AnimalCaregiverForm?.location &&
                  AnimalCaregiverForm?.location.map((loc) => loc.label).join(", ")}
              </p>
            </div>

            {/* Age and Gender */}
            <div className="flex" style={{ gap: "1.5rem" }}>
              <p>
                <strong>年龄:</strong> {AnimalCaregiverForm?.age}
              </p>
              <p>
                <strong>性别:</strong> {AnimalCaregiverForm?.gender}
              </p>
            </div>

            {/* Education, Experience, Phone */}
            <div className="flex flex-wrap space-x-4 md:space-x-10">
              <p>
                <strong>教育程度:</strong> {AnimalCaregiverForm?.education}
              </p>
              <p>
                <strong>工作经验:</strong> {AnimalCaregiverForm?.years_of_experience}{" "}
                年
              </p>
              <p>
                <strong>电话:</strong> {AnimalCaregiverForm?.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Description section */}
        {associatedAds && (
          <div className="max-w-4xl w-full p-4 bg-blue-100 shadow-lg rounded-lg">
            <h4 className="text-lg font-semibold text-blue-600">广告信息</h4>
            <p> {associatedAds.title}</p>
            <p> {associatedAds.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimalCaregiverDetail;
