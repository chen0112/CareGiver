import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Caregiver } from "../../types/Types";
import { Link } from "react-router-dom";
import { BiHeart } from "react-icons/bi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useCaregiverAdsContext } from "../../context/CaregiverAdsContext";
import "./CaregiverDetail.css";

const CaregiverDetail: React.FC = () => {
  const { id } = useParams();
  const [caregiver, setCaregiver] = useState<Caregiver | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { caregiverAds } = useCaregiverAdsContext();
  console.log("Context careneederAds state:", caregiverAds);

  useEffect(() => {
    fetch(`https://nginx.yongxinguanai.com/api/all_caregivers/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCaregiver(data);
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

  const associatedAds = caregiver
    ? caregiverAds?.find((ad) => ad.caregiver_id === caregiver.id)
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
              src={caregiver?.imageurl}
              alt={caregiver?.name}
            />
          </div>

          {/* Details section */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl md:text-2xl font-semibold mr-6">
                {caregiver?.name}
              </h2>
              <FaMapMarkerAlt className="text-gray-600 mb-2" />
              <p className="text-gray-600 font-semibold mt-2">
                {caregiver?.location &&
                  caregiver?.location.map((loc) => loc.label).join(", ")}
              </p>
            </div>

            {/* Age and Gender */}
            <div className="flex" style={{ gap: "1.5rem" }}>
              <p>
                <strong>年龄:</strong> {caregiver?.age}
              </p>
              <p>
                <strong>性别:</strong> {caregiver?.gender}
              </p>
            </div>

            {/* Education, Experience, Phone */}
            <div className="flex flex-wrap space-x-4 md:space-x-10">
              <p>
                <strong>教育程度:</strong> {caregiver?.education}
              </p>
              <p>
                <strong>工作经验:</strong> {caregiver?.years_of_experience}{" "}
                年
              </p>
              <p>
                <strong>电话:</strong> {caregiver?.phone}
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

export default CaregiverDetail;
