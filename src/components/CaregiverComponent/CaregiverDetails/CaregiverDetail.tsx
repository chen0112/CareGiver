import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Caregiver } from "../../../types/Types";
import { Link } from "react-router-dom";
import { BiHeart } from "react-icons/bi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { useCaregiverAdsContext } from "../../../context/CaregiverAdsContext";
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
    <div className="relative">
      <div className="fixed top-1/4 right-8 z-50">
        <Link
          to={`/caregivers/${caregiver?.id}/message`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full inline-flex items-center"
        >
          <FaEnvelope className="mr-2" /> 发送消息
        </Link>
      </div>

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
          <div className="max-w-4xl w-full flex flex-col md:flex-row items-center p-4 bg-blue-100 shadow-lg rounded-lg">
            {/* Image section */}
            <img
              className="w-32 h-32 rounded-full border-4 border-blue-300 mb-4 md:mb-0 md:mr-4"
              src={caregiver?.imageurl}
              alt={caregiver?.name}
            />

            {/* Details section */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl md:text-2xl font-semibold mr-8">
                  {caregiver?.name}
                </h2>
                <div className="flex items-center space-x-2">
                  <FaMapMarkerAlt className="text-black mb-2" />
                  <p className="text-black font-semibold mt-2">
                    {caregiver?.location &&
                    Array.isArray(caregiver.location) &&
                    caregiver.location.length > 0
                      ? caregiver.location.map((loc) => loc.label).join(", ")
                      : "无"}
                  </p>
                </div>
              </div>

              {/* Age and Gender */}
              <div className="flex space-x-10">
                <p className="text-black font-semibold">
                  年龄: {caregiver?.age}
                </p>
                <p className="text-black font-semibold">
                  性别: {caregiver?.gender ? caregiver?.gender : "不详"}
                </p>
              </div>

              {/* Education, Experience, Phone */}
              <div className="flex flex-wrap md:space-x-10">
                <div className="w-full md:w-auto mb-2">
                  <p className="text-black font-semibold">
                    教育程度:{" "}
                    {caregiver?.education ? caregiver?.education : "不详"}
                  </p>
                </div>
                <div className="w-full md:w-auto mb-2">
                  <p className="text-black font-semibold">
                    工作经验:{" "}
                    {caregiver?.years_of_experience !== null
                      ? `${caregiver?.years_of_experience} 年`
                      : "不详"}
                  </p>
                </div>
                <div className="w-full md:w-auto mb-2">
                  <p className="text-black font-semibold">
                    每小时费用:{" "}
                    {caregiver?.hourlycharge
                      ? `${caregiver?.hourlycharge} 元/小时`
                      : "不详"}
                  </p>
                </div>
                <div className="w-full md:w-auto mb-2">
                  <p className="text-black font-semibold">
                    电话: {caregiver?.phone}
                  </p>
                </div>
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
    </div>
  );
};

export default CaregiverDetail;
