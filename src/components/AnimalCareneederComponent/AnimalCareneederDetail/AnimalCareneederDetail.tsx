import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { AnimalCareneederForm } from "../../../types/Types";
import { Link } from "react-router-dom";
import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useAnimalCareneederAdsContext } from "../../../context/AnimalCareneederAdsContext";
import { useAnimalCareneederContext } from "../../../context/AnimalCareneederContext";
import { BASE_URL } from "../../../types/Constant";
import { defaultImageUrl } from "../../../types/Constant";
import HeaderLogo from "../../HeaderLogoComponent/HeaderLogo";

const AnimalCareneederDetail: React.FC = () => {
  const { id } = useParams();
  const [AnimalCareneederForm, setAnimalCareneederForm] =
    useState<AnimalCareneederForm | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { animalcareneederAds } = useAnimalCareneederAdsContext();
  const { animalcareneeders } = useAnimalCareneederContext();

  console.log("Context animalcareneederAds state:", animalcareneederAds);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const phoneNumber = queryParams.get("phoneNumber");

  useEffect(() => {
    fetch(`${BASE_URL}/api/all_animalcareneederform/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAnimalCareneederForm(data);
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

  const associatedAds = AnimalCareneederForm
    ? animalcareneederAds?.find(
        (ad) => ad.animalcareneederid === AnimalCareneederForm.id
      )
    : null;

  const associatedDetails = AnimalCareneederForm
    ? animalcareneeders.find(
        (details) => details.animalcareneederid === AnimalCareneederForm.id
      )
    : null;

  return (
    <div className="relative">
      <div>
        <div className="flex items-center justify-between py-1 ml-1 w-full">
        < HeaderLogo/>
          {!(
            AnimalCareneederForm?.phone === phoneNumber ||
            !AnimalCareneederForm?.phone ||
            !phoneNumber ||
            phoneNumber === "undefined"
          ) && (
            <Link
              to={`/animalcareneeders/message?id=${
                AnimalCareneederForm?.id
              }&phoneNumber_recipient=${
                AnimalCareneederForm?.phone
              }&phoneNumber_sender=${phoneNumber}&adType=${"animalcareneeders"}`}
              className="bg-blue-500 hover:bg-blue-700 no-underline text-white font-bold py-2 px-4 rounded-full inline-flex items-center mr-4"
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
              src={AnimalCareneederForm?.imageurl || defaultImageUrl}
              alt={AnimalCareneederForm?.name}
            />

            {/* Details section */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl md:text-2xl font-semibold mr-8">
                  {AnimalCareneederForm?.name}
                </h2>
                <div className="flex items-center space-x-2">
                  <FaMapMarkerAlt className="text-black mb-2" />
                  <p className="text-black font-semibold mt-2">
                    {AnimalCareneederForm?.location &&
                    Array.isArray(AnimalCareneederForm.location) &&
                    AnimalCareneederForm.location.length > 0
                      ? AnimalCareneederForm.location
                          .map((loc) => loc.label)
                          .join(", ")
                      : "无"}
                  </p>
                </div>
              </div>

              {/* Age and Gender */}
              <div className="flex space-x-10">
                <p className="text-black font-semibold">
                  年龄: {AnimalCareneederForm?.age}
                </p>
                <p className="text-black font-semibold">
                  性别:{" "}
                  {AnimalCareneederForm?.gender
                    ? AnimalCareneederForm?.gender
                    : "不详"}
                </p>
              </div>

              {/* Education, Experience, Phone */}
              <div className="flex flex-wrap md:space-x-10">
                <div className="w-full md:w-auto mb-2">
                  <p className="text-black font-semibold">
                    <span>每小时费用:</span>
                    <span className="ml-4">
                      {associatedDetails?.hourlycharge
                        ? `${associatedDetails.hourlycharge}元/小时`
                        : "收费不详"}
                    </span>
                  </p>
                </div>
                <div className="w-full md:w-auto mb-2">
                  <p className="text-black font-semibold">
                    <span>教育程度:</span>
                    {AnimalCareneederForm?.education
                      ? AnimalCareneederForm?.education
                      : "不详"}
                  </p>
                </div>
                <div className="w-full md:w-auto mb-2">
                  <p className="text-black font-semibold">
                    工作经验:{" "}
                    {AnimalCareneederForm?.years_of_experience !== null
                      ? `${AnimalCareneederForm?.years_of_experience} 年`
                      : "不详"}
                  </p>
                </div>
                <div className="w-full md:w-auto mb-2">
                  <p className="text-black font-semibold">
                    电话: {AnimalCareneederForm?.phone}
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

export default AnimalCareneederDetail;
