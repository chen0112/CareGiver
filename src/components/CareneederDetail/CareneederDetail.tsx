import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Careneeder, Schedule } from "../../types/Types";
import { Link } from "react-router-dom";
import { BiHeart } from "react-icons/bi";
import { FaMapMarkerAlt } from "react-icons/fa";
import dayjs from "dayjs";
import { useCareneederScheduleContext } from "../../context/CareneederScheduleContext";
import { useCareneederAdsContext } from "../../context/CareneederAdsContext";

const defaultImageUrl =
  "https://alex-chen.s3.us-west-1.amazonaws.com/blank_image.png"; // Replace with the actual URL

const CareneederDetail: React.FC = () => {
  const { id } = useParams();
  const [careneeder, setCareneeder] = useState<Careneeder | null>(null);
  const [careneederSchedule, setCareneederSchedule] = useState<Schedule | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { careneedersSchedule } = useCareneederScheduleContext();
  console.log("Context careneederSchedule state:", careneedersSchedule);

  const { careneederAds } = useCareneederAdsContext();
  console.log("Context careneederAds state:", careneederAds);

  useEffect(() => {
    // Fetch careneeder data
    fetch(`https://nginx.yongxinguanai.com/api/all_careneeders/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCareneeder(data);
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

  console.log("careneederSchedule:", careneederSchedule);
  console.log("careneederAds:", careneederAds);

  // Check if careneeder is not null before attempting to find the schedule
  const selectedSchedule = careneeder
    ? careneedersSchedule?.find(
        (schedule) => schedule.careneeder_id === careneeder.id
      )
    : null;

  const associatedAds = careneeder
    ? careneederAds?.find((ad) => ad.careneeder_id === careneeder.id)
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
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center p-4 bg-blue-100 shadow-lg rounded-lg">
          {/* Image and Details */}
          <img
            className="w-32 h-32 rounded-full border-4 border-blue-300 mb-4 md:mb-0 md:mr-4"
            src={careneeder?.imageurl || defaultImageUrl}
            alt={careneeder?.name}
          />
          <div className="flex flex-col space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-600">
              {careneeder?.name}
            </h2>
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-blue-600 mb-2" />
              <p className="text-blue-500">
                {careneeder?.location &&
                  careneeder?.location.map((loc) => loc.label).join(", ")}
              </p>
            </div>
            <p>
              <strong>电话:</strong> {careneeder?.phone}
            </p>
          </div>
        </div>
        {/* Schedule Information */}
        {selectedSchedule && (
          <div className="max-w-4xl w-full p-4 bg-blue-100 shadow-lg rounded-lg">
            <h4 className="text-lg font-semibold text-blue-600">排班信息</h4>
            <p>排班类型: {selectedSchedule.scheduletype}</p>
            <p>总时长: {selectedSchedule.totalhours}</p>
            <p>频率: {selectedSchedule.frequency}</p>
            <p>
              开始日期:{" "}
              {selectedSchedule.startdate
                ? dayjs(selectedSchedule.startdate)
                    .toDate()
                    .toLocaleDateString("zh-CN")
                : "日期未定义"}
            </p>
            <p>
              选择的时间段:{" "}
              {selectedSchedule.selectedtimeslots &&
              selectedSchedule.selectedtimeslots.length > 0
                ? selectedSchedule.selectedtimeslots.join(", ")
                : "时间段未定义"}
            </p>
            <p>持续天数: {selectedSchedule.durationdays}</p>
          </div>
        )}
        {/* Associated Ads */}
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

export default CareneederDetail;
