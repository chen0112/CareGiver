import React, { useState, useEffect } from "react";
import { Caregiver, CaregiverAds } from "../../types/Types";
import { Link } from "react-router-dom";
import "./CaregiverCard.css";
import { MultiSelect } from "react-multi-select-component";
import { FaMapMarkerAlt } from "react-icons/fa";
import { LOCATION_OPTIONS } from "../../types/Constant";

interface CaregiverCardProps {
  caregiver: Caregiver;
  caregiverAd: CaregiverAds | undefined;
  loggedInUserPhone?: string; // Add the logged-in user's phone number here
  onUpdateCaregiver?: (updatedCaregiver: Caregiver) => void; // New prop for handling updates
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
    fetch(
      `https://nginx.yongxinguanai.com/api/mycaregiver/${editedCaregiver.id}/ad`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedCaregiverAd),
      }
    )
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
        <div className="flex flex-col items-center mb-6 mx-2 md:mx-6">
          {/* Link to Caregiver's Profile */}
          <Link
            to={`/caregivers/${caregiver.id}`}
            className="no-underline w-full md:w-11/12 lg:w-3/4 bg-white shadow-lg rounded-lg overflow-hidden mb-1 flex flex-col md:flex-row h-62 transition-transform transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-2xl cursor-pointer hover:bg-gray-100 p-1"
          >
            {/* Image */}
            <div className="flex-shrink-0 flex items-center justify-center w-1/3">
              <img
                src={caregiver.imageurl}
                alt={caregiver.name}
                style={imageStyle}
              />
            </div>

            {/* Text */}
            <div className="flex-grow p-6 flex flex-col justify-between">
              <div className="flex items-center">
                <h3 className="text-xl font-semibold text-blue-700 mr-3">
                  {caregiver.name}
                </h3>
                <FaMapMarkerAlt className="text-gray-600 mb-1" />
                <span className="text-gray-600 ml-2">
                  {Array.isArray(caregiver.location)
                    ? caregiver.location.map((loc) => loc.label).join(", ")
                    : "无"}
                </span>
              </div>
              <div className="text-gray-600 mb-8 line-clamp">
                {caregiverAd && (
                  <div>
                    <p>{caregiverAd.title}</p>
                    <p className="line-clamp-3">{caregiverAd.description}</p>
                  </div>
                )}
              </div>
            </div>
          </Link>

          {/* Edit Button */}
          {caregiver.phone === loggedInUserPhone && (
            <button
              onClick={handleEditClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
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
