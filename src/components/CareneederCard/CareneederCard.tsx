import React, { useState, useEffect } from "react";
import { Careneeder, Schedule, Ads } from "../../types/Types";
import { Link } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";
import { FaMapMarkerAlt } from "react-icons/fa";
import dayjs from "dayjs";
import { LOCATION_OPTIONS } from "../../types/Constant";

const defaultImageUrl =
  "https://alex-chen.s3.us-west-1.amazonaws.com/blank_image.png"; // Replace with the actual URL

interface CareneederCardProps {
  careneeder: Careneeder;
  careneederSchedule: Schedule | undefined;
  careneederAd: Ads | undefined;
  loggedInUserPhone?: string; // Add the logged-in user's phone number here
  onUpdateCareneeder?: (updatedCareneeder: Careneeder) => void; // New prop for handling updates
}

interface Option {
  label: string;
  value: string;
}

const locationOptions = LOCATION_OPTIONS;

const CareneederCard: React.FC<CareneederCardProps> = ({
  careneeder,
  careneederSchedule,
  careneederAd,
  loggedInUserPhone,
  onUpdateCareneeder, // Receive the update function from the parent component
}) => {
  const imageStyle: React.CSSProperties = {
    objectFit: "cover",
    height: "80%",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedCareneeder, setEditedCareneeder] = useState(careneeder);
  const [editedCareneederAd, setEditedCareneederAd] = useState(
    careneederAd || { title: "", description: "" }
  );

  useEffect(() => {
    setEditedCareneederAd(careneederAd || { title: "", description: "" });
  }, [careneederAd]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleLocationChange = (newLocation: Option[]) => {
    if (newLocation && newLocation.length <= 2) {
      setEditedCareneeder((prev) => ({
        ...prev,
        location: newLocation,
      }));
    } else {
      // Display a notification to the user about the selection limit
      alert("请最多选择两个地点");
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedCareneederAd({
      ...editedCareneederAd,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = () => {
    fetch(
      `https://nginx.yongxinguanai.com/api/mycareneeder/${editedCareneeder.id}/ad`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedCareneederAd),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Response data:", data);
        if (onUpdateCareneeder) {
          onUpdateCareneeder(editedCareneeder); // Call the update function provided by the parent component
        }
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating careneederAd:", error);
      });
  };

  return (
    <div>
      {isEditing ? (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              标题
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={editedCareneederAd.title}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              描述
            </label>
            <textarea
              name="description"
              id="description"
              value={editedCareneederAd.description}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md shadow-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="inline-flex items-center justify-center px-4 py-2 text-white bg-green-500 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              保存
            </button>
            <button
              onClick={handleEditClick}
              className="ml-2 inline-flex items-center justify-center px-4 py-2 text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center mb-6 mx-4 sm:mx-6">
          {/* Add horizontal margin */}
          <Link
            to={`/careneeders/${careneeder.id}`}
            className="no-underline w-full sm:w-11/12 md:w-3/4 lg:w-2/3 bg-white shadow-lg rounded-lg overflow-hidden mb-1 flex h-62 transition-transform transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-2xl cursor-pointer hover:bg-gray-100"
          >
            {/* Image Container */}
            <div className="flex-shrink-0 flex items-center justify-center w-1/3">
              <img
                src={careneeder.imageurl || defaultImageUrl} // Use the imageurl if available, otherwise use defaultImageUrl
                alt={careneeder.name}
                style={imageStyle}
              />
            </div>
            {/* Text Container */}
            <div className="flex-grow p-6 flex flex-col justify-between">
              <div className="flex items-center">
                <h3 className="text-xl font-semibold mr-3">
                  {careneeder.name}
                </h3>
                <FaMapMarkerAlt className="text-gray-600 mb-2" />
                <span
                  className="text-gray-600 ml-2"
                  style={{ marginTop: "-7px" }}
                >
                  {Array.isArray(careneeder.location)
                    ? careneeder.location.map((loc) => loc.label).join(", ")
                    : "无"}
                </span>
              </div>
              <div className="text-gray-600 mb-3 pr-6">
                {careneederAd && ( // New section for displaying ad details
                  <div>
                    <p>{careneederAd.title}</p>
                    <p className="line-clamp-3">{careneederAd.description}</p>
                  </div>
                )}
              </div>
            </div>
          </Link>

          {careneeder.phone === loggedInUserPhone && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto text-center"
              onClick={handleEditClick}
            >
              编辑
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CareneederCard;
