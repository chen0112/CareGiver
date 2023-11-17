import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Caregiver } from "../../../types/Types";
import { Link } from "react-router-dom";
import { BiHeart } from "react-icons/bi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { useCaregiverAdsContext } from "../../../context/CaregiverAdsContext";
import { useCaregiverScheduleContext } from "../../../context/CaregiverScheduleContext";
import "./CaregiverDetail.css";
import { BASE_URL } from "../../../types/Constant";
import { defaultImageUrl } from "../../../types/Constant";
import HeaderLogo from "../../HeaderLogoComponent/HeaderLogo";
import dayjs from "dayjs";

const CaregiverDetail: React.FC = () => {
  const { id } = useParams();
  const [caregiver, setCaregiver] = useState<Caregiver | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { caregiverAds } = useCaregiverAdsContext();
  const { caregiversSchedule } = useCaregiverScheduleContext();
  console.log("Context careneederAds state:", caregiverAds);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const phoneNumber = queryParams.get("phoneNumber");

  useEffect(() => {
    fetch(`${BASE_URL}/api/all_caregivers/${id}`)
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

  console.log("caregiversSchedule:", caregiversSchedule);

  const selectedSchedule = caregiver
    ? caregiversSchedule?.find(
        (schedule) => schedule.caregiver_id === caregiver.id
      )
    : null;

  const associatedAds = caregiver
    ? caregiverAds?.find((ad) => ad.caregiver_id === caregiver.id)
    : null;

  return (
    <div className="relative">
      <div>
        <div className="flex items-center justify-between py-1 ml-1 w-full">
          <HeaderLogo />

          {!(
            caregiver?.phone === phoneNumber ||
            !caregiver?.phone ||
            !phoneNumber ||
            phoneNumber === "undefined"
          ) && (
            <Link
              to={`/caregivers/message?id=${
                caregiver?.id
              }&phoneNumber_recipient=${
                caregiver?.phone
              }&phoneNumber_sender=${phoneNumber}&adType=${"caregivers"}`}
              className="bg-blue-500 no-underline hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full inline-flex items-center mr-4"
            >
              <FaEnvelope className="mr-2" /> 发送消息
            </Link>
          )}
        </div>

        <hr className="border-t border-black-300 mx-1 my-2" />

        <div className="flex flex-col items-center justify-start min-h-screen space-y-6 px-4 md:px-0">
          {/* Top section */}
          <div className="max-w-4xl w-full flex flex-col md:flex-row items-center p-4 bg-blue-100 shadow-lg rounded-lg">
            {/* Image section */}
            <img
              className="w-32 h-32 rounded-full border-4 border-blue-300 mb-4 md:mb-0 md:mr-4"
              src={caregiver?.imageurl || defaultImageUrl}
              alt={caregiver?.name}
            />

            {/* Details section */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-14">
                <h2 className="text-xl text-center md:text-2xl font-semibold text-blue-600">
                  {caregiver?.name}
                </h2>
                <div>
                  <p className="flex flex-row text-black font-semibold mt-2">
                    <FaMapMarkerAlt className="text-black mt-1 mr-1" />
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
              <div className="w-full md:w-auto">
                <p className="text-black font-semibold">
                  教育程度:{" "}
                  {caregiver?.education ? caregiver?.education : "不详"}
                </p>
              </div>
              <div className="w-full md:w-auto">
                <p className="text-black font-semibold">
                  工作经验:{" "}
                  {caregiver?.years_of_experience !== null
                    ? `${caregiver?.years_of_experience} 年`
                    : "不详"}
                </p>
              </div>
              <div className="w-full md:w-auto">
                <p className="text-black font-semibold">
                  每小时费用:{" "}
                  {caregiver?.hourlycharge
                    ? `${caregiver?.hourlycharge} 元/小时`
                    : "不详"}
                </p>
              </div>
              <div className="w-full md:w-auto">
                <p className="text-black font-semibold">
                  电话: {caregiver?.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Schedule Information */}
          {selectedSchedule && (
            <div className="max-w-4xl w-full p-4 bg-blue-100 shadow-lg rounded-lg">
              <h4 className="text-lg font-semibold text-blue-600">排班信息</h4>
              <p>排班类型: {selectedSchedule.scheduletype}</p>
              <p>总时长: {selectedSchedule.totalhours}小时</p>
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
                持续天数:{" "}
                {selectedSchedule.durationdays
                  ? `${selectedSchedule.durationdays}天`
                  : "无"}
              </p>
            </div>
          )}
          {/* 
          <div className="max-w-4xl w-full p-4 bg-blue-100 shadow-lg rounded-lg">
            <h4 className="text-lg font-semibold text-blue-600">服务信息</h4>
            <ul className="list-disc list-inside pl-1">
              {caregiver?.live_in_care && <li>居家照护: ✔️</li>}
              {careneeder?.live_out_care && <li>非居家照护: ✔️</li>}
              {careneeder?.domestic_work && <li>家务: ✔️</li>}
              {careneeder?.meal_preparation && <li>餐食准备: ✔️</li>}
              {careneeder?.companionship && <li>陪伴: ✔️</li>}
              {careneeder?.washing_dressing && <li>洗浴与穿着: ✔️</li>}
              {careneeder?.nursing_health_care && <li>护理与医疗护理: ✔️</li>}
              {careneeder?.mobility_support && <li>行动支持: ✔️</li>}
              {careneeder?.transportation && <li>交通: ✔️</li>}
              {careneeder?.errands_shopping && <li>外出购物: ✔️</li>}
            </ul>
          </div> */}

          {selectedSchedule && selectedSchedule.selectedtimeslots && (
            <div className="max-w-4xl w-full p-4 bg-blue-100 shadow-lg rounded-lg overflow-x-auto">
              <h4 className="text-lg font-semibold text-blue-600">日程表</h4>
              <table className="w-full border-collapse border border-black">
                <thead>
                  <tr>
                    <th className="border-t border-l border-black"></th>
                    <th className="text-center border border-black">周一</th>
                    <th className="text-center border border-black">周二</th>
                    <th className="text-center border border-black">周三</th>
                    <th className="text-center border border-black">周四</th>
                    <th className="text-center border border-black">周五</th>
                    <th className="text-center border border-black">周六</th>
                    <th className="text-center border border-black">周天</th>
                  </tr>
                </thead>
                <tbody>
                  {["早上", "下午", "晚上"].map((period) => (
                    <tr key={period}>
                      <td className="font-bold border border-black">
                        {period}
                      </td>
                      {[
                        "周一",
                        "周二",
                        "周三",
                        "周四",
                        "周五",
                        "周六",
                        "周天",
                      ].map((day) => (
                        <td
                          key={day}
                          className="text-center border border-black"
                        >
                          <div
                            className={`circle ${
                              selectedSchedule.selectedtimeslots.includes(
                                `${day}_${period}`
                              )
                                ? "selected"
                                : ""
                            }`}
                          ></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

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
