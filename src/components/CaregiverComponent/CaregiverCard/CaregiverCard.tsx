import React, { useState, useEffect } from "react";
import { Caregiver, CaregiverAds } from "../../../types/Types";
import { Link } from "react-router-dom";
import "./CaregiverCard.css";
import { MultiSelect } from "react-multi-select-component";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  BASE_URL,
  LOCATION_OPTIONS,
  defaultImageUrl,
} from "../../../types/Constant";

interface CaregiverCardProps {
  caregiver: Caregiver;
  caregiverAd: CaregiverAds | undefined;
  loggedInUserPhone?: string; // Add the logged-in user's phone number here
  onUpdateCaregiver?: (updatedCaregiver: Caregiver) => void; // New prop for handling updates
  onUpdateCaregiverAd?: (updatedCaregiverAd: CaregiverAds) => void; // New prop for handling ads updates
  className?: string; // Add this line
  phoneNumber?: string;
}

interface Option {
  label: string;
  value: string;
}

const locationOptions = LOCATION_OPTIONS;

const CaregiverCard: React.FC<CaregiverCardProps> = ({
  caregiver,
  caregiverAd,
  loggedInUserPhone,
  onUpdateCaregiver, // Receive the update function from the parent component
  phoneNumber,
}) => {
  const imageStyle: React.CSSProperties = {
    objectFit: "cover",
    height: "80%",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedCaregiver, setEditedCaregiver] = useState(caregiver);
  const [editedCaregiverAd, setEditedCaregiverAd] = useState(
    caregiverAd || { title: "", description: "" }
  );

  useEffect(() => {
    setEditedCaregiverAd(caregiverAd || { title: "", description: "" });
  }, [caregiverAd]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleLocationChange = (newLocation: Option[]) => {
    if (newLocation && newLocation.length <= 2) {
      setEditedCaregiver((prev) => ({
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
    setEditedCaregiverAd({
      ...editedCaregiverAd,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = () => {
    fetch(`${BASE_URL}/api/caregiver/mycaregiver/${editedCaregiver.id}/ad`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedCaregiverAd),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response data:", data);
        if (onUpdateCaregiver) {
          onUpdateCaregiver(editedCaregiver); // Call the update function provided by the parent component
        }
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating caregiverAd:", error);
      });
  };

  return (
    <div>
      {isEditing ? (
        <div className="bg-white p-4 md:p-6 rounded shadow-lg">
          {/* Title */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-blue-700"
            >
              标题
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={editedCaregiverAd.title}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md shadow-sm"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-blue-700"
            >
              描述
            </label>
            <textarea
              name="description"
              id="description"
              value={editedCaregiverAd.description}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md shadow-sm"
            />
          </div>

          {/* Save and Cancel Buttons */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              保存
            </button>
            <button
              onClick={handleEditClick}
              className="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center flex-wrap items-center mb-3 mx-2 md:h-auto">
        {/* Link to Careneeder's Profile */}
        <Link
            to={`/caregivers/id/${caregiver.id}?phoneNumber=${phoneNumber}`}
            className="no-underline w-full md:w-11/12 lg:w-3/4 bg-white shadow-lg rounded-lg overflow-hidden mb-1 flex flex-col md:h-72 transition-transform transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-2xl cursor-pointer hover:bg-gray-100 p-1"
            >
            {/* Image */}
            <div className="flex justify-center items-center p-3 md:p-1">
              <img
                src={caregiver.imageurl || defaultImageUrl}
                alt={caregiver.name}
                className="rounded w-1/2"
              />
            </div>

            {/* Text */}
            <div className="mx-2 flex flex-col justify-between md:-ml-3">
              <div className="flex items-center">
                <h3 className="text-base md:text-lg font-semibold text-blue-700 mr-1 mt-1">
                  {caregiver.name}
                </h3>
                <FaMapMarkerAlt className="text-gray-600 mb-1" />
                <span className="text-gray-600 ml-1 mb-1 text-xs md:text-xs">
                  {caregiver.location &&
                  Array.isArray(caregiver.location) &&
                  caregiver.location.length > 0
                    ? caregiver.location.map((loc) => loc.label).join(", ")
                    : "无"}
                </span>
                <span className="mb-1 ml-1 text-xs md:text-xs text-black">
                  {caregiver?.hourlycharge
                    ? `¥ ${caregiver.hourlycharge}元/小时`
                    : "¥ 收费不详"}
                </span>
              </div>
              <div className="text-gray-600 mb-1 line-clamp text-xs md:text-sm">
                {caregiverAd && (
                  <div>
                    <p>{caregiverAd.title}</p>
                    <p className="line-clamp-2">{caregiverAd.description}</p>
                  </div>
                )}
              </div>
            </div>
          </Link>

          {/* Edit Button */}
          {caregiver.phone === loggedInUserPhone && (
            <button
              onClick={handleEditClick}
              className="bg-blue-600 mt-2 hover:bg-blue-700 text-xs md:text-base text-white font-semibold py-2 px-4 rounded text-center"
            >
              编辑
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CaregiverCard;
