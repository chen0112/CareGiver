import React, { useState, useEffect } from "react";
import {
  AnimalCaregiver,
  AnimalCaregiverAds,
  AnimalCaregiverForm,
} from "../../../types/Types";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BASE_URL, LOCATION_OPTIONS } from "../../../types/Constant";
import { defaultImageUrl } from "../../../types/Constant";

interface AnimalcaregiverCardProps {
  animalcaregiver: AnimalCaregiver | undefined;
  animalcaregiversForm: AnimalCaregiverForm;
  animalcaregiverAds: AnimalCaregiverAds | undefined;
  loggedInUserPhone?: string; // Add the logged-in user's phone number here
  onUpdateanimalcaregiverForm?: (
    updatedanimalcaregiverForm: AnimalCaregiverForm
  ) => void; // New prop for handling updates
  className?: string; // Add this line
  phoneNumber?: string;
}

interface Option {
  label: string;
  value: string;
}

const locationOptions = LOCATION_OPTIONS;

const AnimalCaregiverCard: React.FC<AnimalcaregiverCardProps> = ({
  animalcaregiver,
  animalcaregiversForm,
  animalcaregiverAds,
  loggedInUserPhone,
  onUpdateanimalcaregiverForm, // Receive the update function from the parent component
  phoneNumber,
}) => {
  const imageStyle: React.CSSProperties = {
    objectFit: "cover",
    height: "80%",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedanimalcaregiverForm, setEditedanimalcaregiverForm] =
    useState(animalcaregiversForm);
  const [editedanimalcaregiverAds, setEditedanimalcaregiverAds] = useState(
    animalcaregiverAds || { title: "", description: "" }
  );

  useEffect(() => {
    setEditedanimalcaregiverAds(
      animalcaregiverAds || { title: "", description: "" }
    );
  }, [animalcaregiverAds]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleLocationChange = (newLocation: Option[]) => {
    if (newLocation && newLocation.length <= 2) {
      setEditedanimalcaregiverForm((prev) => ({
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
    setEditedanimalcaregiverAds({
      ...editedanimalcaregiverAds,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = () => {
    fetch(
      `${BASE_URL}/api/myanimalcaregiver/${editedanimalcaregiverForm.id}/ad`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedanimalcaregiverAds),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Response data:", data);
        if (onUpdateanimalcaregiverForm) {
          onUpdateanimalcaregiverForm(editedanimalcaregiverForm); // Call the update function provided by the parent component
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
              value={editedanimalcaregiverAds.title}
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
              value={editedanimalcaregiverAds.description}
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
        <div className="flex flex-row justify-center flex-wrap items-center mb-6 mx-2 md:h-auto">
          {/* Link to Animal Caregiver's Profile */}
          <Link
            to={`/animalcaregivers/id/${animalcaregiversForm.id}?phoneNumber=${phoneNumber}`}
            className="no-underline w-full md:w-11/12 lg:w-3/4 bg-white shadow-lg rounded-lg overflow-hidden mb-1 flex flex-col md:h-96 transition-transform transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-2xl cursor-pointer hover:bg-gray-100 p-1"
          >
            {/* Image */}
            <div className="flex justify-center items-center p-3 md:p-1">
              <img
                src={animalcaregiversForm.imageurl || defaultImageUrl}
                alt={animalcaregiversForm.name}
                className="rounded w-1/2 md:w-full"
              />
            </div>

            {/* Text */}
            <div className="flex-grow mx-2 flex flex-col justify-between md:-ml-3">
              <div className="flex items-center">
                <h3 className="text-base md:text-lg font-semibold text-blue-700 mr-1 mt-1">
                  {animalcaregiversForm.name}
                </h3>
                <FaMapMarkerAlt className="text-gray-600 mb-1" />
                <span className="text-gray-600 ml-1 mb-1 text-xs md:text-xs">
                  {animalcaregiversForm.location &&
                  Array.isArray(animalcaregiversForm.location) &&
                  animalcaregiversForm.location.length > 0
                    ? animalcaregiversForm.location
                        .map((loc) => loc.label)
                        .join(", ")
                    : "无"}
                </span>
                <span className="mb-1 ml-1 text-xs text-black">
                  {animalcaregiver?.hourlycharge
                    ? `¥ ${animalcaregiver.hourlycharge}元/小时`
                    : "¥ 收费不详"}
                </span>
              </div>
              <div className="text-gray-600 mb-1 line-clamp text-xs md:text-sm">
                {editedanimalcaregiverAds && (
                  <div>
                    <p>{editedanimalcaregiverAds.title}</p>
                    <p className="line-clamp-2">
                      {editedanimalcaregiverAds.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Link>

          {animalcaregiversForm.phone === loggedInUserPhone && (
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

export default AnimalCaregiverCard;
