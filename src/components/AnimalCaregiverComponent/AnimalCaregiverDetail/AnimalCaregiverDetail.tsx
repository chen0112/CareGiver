import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { AnimalCaregiverForm } from "../../../types/Types";
import { Link } from "react-router-dom";
import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useAnimalCaregiverAdsContext } from "../../../context/AnimalCaregiverAdsContext";
import { useAnimalCaregiverContext } from "../../../context/AnimalCaregiverContext";
import { useAnimalCaregiverScheduleContext } from "../../../context/AnimalCaregiverScheduleContext";
import { BASE_URL } from "../../../types/Constant";
import { defaultImageUrl } from "../../../types/Constant";
import HeaderLogo from "../../HeaderLogoComponent/HeaderLogo";
import dayjs from "dayjs";

const AnimalCaregiverDetail: React.FC = () => {
  const { id } = useParams();
  const [AnimalCaregiverForm, setAnimalCaregiverForm] =
    useState<AnimalCaregiverForm | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { animalcaregiverAds } = useAnimalCaregiverAdsContext();
  const { animalcaregivers } = useAnimalCaregiverContext();
  const { animalcaregiversSchedule } = useAnimalCaregiverScheduleContext();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const phoneNumber = queryParams.get("phoneNumber");

  console.log("Context animalcaregiverAds state:", animalcaregiverAds);

  useEffect(() => {
    fetch(`${BASE_URL}/api/animalcaregiver/all_animalcaregiverform/${id}`)
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
    ? animalcaregiverAds?.find(
        (ad) => ad.animalcaregiverid === AnimalCaregiverForm.id
      )
    : null;

  const associatedDetails = AnimalCaregiverForm
    ? animalcaregivers.find(
        (details) => details.animalcaregiverid === AnimalCaregiverForm.id
      )
    : null;

  const selectedSchedule = AnimalCaregiverForm
    ? animalcaregiversSchedule.find(
        (schedule) => schedule.animalcaregiverform_id === AnimalCaregiverForm.id
      )
    : null;

  return (
    <div className="relative">
      <div>
        <div className="flex items-center justify-between py-1 ml-1 w-full">
          <HeaderLogo />

          {!(
            AnimalCaregiverForm?.phone === phoneNumber ||
            !AnimalCaregiverForm?.phone ||
            !phoneNumber ||
            phoneNumber === "undefined"
          ) && (
            <Link
              to={`/animalcaregivers/message?id=${
                AnimalCaregiverForm?.id
              }&phoneNumber_recipient=${
                AnimalCaregiverForm?.phone
              }&phoneNumber_sender=${phoneNumber}&adType=${"animalcaregivers"}`}
              className="no-underline bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full inline-flex items-center mr-4"
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
              src={AnimalCaregiverForm?.imageurl || defaultImageUrl}
              alt={AnimalCaregiverForm?.name}
            />

            {/* Details section */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-14">
                <h2 className="text-xl md:text-2xl font-semibold text-blue-600">
                  {AnimalCaregiverForm?.name}
                </h2>
                <div>
                  <p className="flex flex-row text-black font-semibold mt-2">
                    <FaMapMarkerAlt className="text-black mt-1 mr-1" />
                    {AnimalCaregiverForm?.location &&
                    Array.isArray(AnimalCaregiverForm.location) &&
                    AnimalCaregiverForm.location.length > 0
                      ? AnimalCaregiverForm.location
                          .map((loc) => loc.label)
                          .join(", ")
                      : "无"}
                  </p>
                </div>
              </div>

              {/* Age and Gender */}
              <div className="flex space-x-10">
                <p className="text-black font-semibold">
                  年龄: {AnimalCaregiverForm?.age}
                </p>
                <p className="text-black font-semibold">
                  性别:{" "}
                  {AnimalCaregiverForm?.gender
                    ? AnimalCaregiverForm?.gender
                    : "不详"}
                </p>
              </div>

              {/* Education, Experience, Phone */}

              <div className="w-full md:w-auto">
                <p className="text-black font-semibold">
                  <span>每小时费用:</span>
                  <span className="ml-3">
                    {associatedDetails?.hourlycharge
                      ? `${associatedDetails.hourlycharge}元/小时`
                      : "收费不详"}
                  </span>
                </p>
              </div>
              <div className="w-full md:w-auto">
                <p className="text-black font-semibold">
                  <span>教育程度:</span>
                  {AnimalCaregiverForm?.education
                    ? AnimalCaregiverForm?.education
                    : "不详"}
                </p>
              </div>
              <div className="w-full md:w-auto">
                <p className="text-black font-semibold">
                  工作经验:{" "}
                  {AnimalCaregiverForm?.years_of_experience !== null
                    ? `${AnimalCaregiverForm?.years_of_experience} 年`
                    : "不详"}
                </p>
              </div>
              <div className="w-full md:w-auto">
                <p className="text-black font-semibold">
                  电话: {AnimalCaregiverForm?.phone}
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

          <div className="max-w-4xl w-full p-4 bg-blue-100 shadow-lg rounded-lg">
            <h4 className="text-lg font-semibold text-blue-600">服务信息</h4>
            <ul className="list-disc list-inside pl-1">
              <li>{associatedDetails?.selectedanimals} : ✔️</li>
              <li>{associatedDetails?.selectedservices}: ✔️</li>
            </ul>
          </div>

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

export default AnimalCaregiverDetail;
