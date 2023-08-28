import React, { useState } from "react";
import { Caregiver } from "../../types/Types";
import { Link } from "react-router-dom";
import "./CaregiverCard.css";
import { MultiSelect } from "react-multi-select-component";
import { FaMapMarkerAlt } from "react-icons/fa";

interface CaregiverCardProps {
  caregiver: Caregiver;
  loggedInUserPhone?: string; // Add the logged-in user's phone number here
  onUpdateCaregiver?: (updatedCaregiver: Caregiver) => void; // New prop for handling updates
}

interface Option {
  label: string;
  value: string;
}

const locationOptions = [
  { label: "New York", value: "New York" },
  { label: "San Francisco", value: "San Francisco" },
  { label: "Los Angeles", value: "Los Angeles" },
  { label: "Chicago", value: "Chicago" },
  { label: "Miami", value: "Miami" },
];

const CaregiverCard: React.FC<CaregiverCardProps> = ({
  caregiver,
  loggedInUserPhone,
  onUpdateCaregiver, // Receive the update function from the parent component
}) => {
  const imageStyle: React.CSSProperties = {
    objectFit: "cover",
    height: "80%",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedCaregiver, setEditedCaregiver] = useState(caregiver);

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
    setEditedCaregiver({
      ...editedCaregiver,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = () => {
    fetch(
      `https://nginx.yongxinguanai.com/api/mycaregiver/${editedCaregiver.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedCaregiver),
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
        console.error("Error updating caregiver:", error);
      });
  };

  return (
    <div>
      {isEditing ? (
        <div className="bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={editedCaregiver.name}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-600"
            >
              Locations
            </label>
            <MultiSelect
              options={locationOptions} // Make sure locationOptions is defined
              value={editedCaregiver.location ?? []}
              onChange={handleLocationChange} // You will need to define this
              labelledBy="Select"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-600"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              value={editedCaregiver.description}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
        <div className="flex flex-col items-center mb-6 mx-4 sm:mx-6">
          {/* Add horizontal margin */}
          <Link
            to={`/caregivers/${caregiver.id}`}
            className="no-underline w-full sm:w-11/12 md:w-3/4 lg:w-2/3 bg-white shadow-lg rounded-lg overflow-hidden mb-2 flex h-62 transition-transform transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-2xl cursor-pointer hover:bg-gray-100"
          >
            {/* Image Container */}
            <div className="flex-shrink-0 flex items-center justify-center w-1/3">
              <img
                src={caregiver.imageurl}
                alt={caregiver.name}
                style={imageStyle}
              />
            </div>
            {/* Text Container */}
            <div className="flex-grow p-6 flex flex-col justify-between">
              <div className="flex items-center">
                <h3 className="text-xl font-semibold mr-3">{caregiver.name}</h3>
                <FaMapMarkerAlt className="text-gray-600 mb-2" />
                <span
                  className="text-gray-600 ml-2"
                  style={{ marginTop: "-7px" }}
                >
                  {Array.isArray(caregiver.location)
                    ? caregiver.location.map((loc) => loc.label).join(", ")
                    : "无"}
                </span>
              </div>
              <p className="text-gray-600 mb-4 pr-6 line-clamp">
                {caregiver.description}
              </p>
            </div>
          </Link>

          {caregiver.phone === loggedInUserPhone && (
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

export default CaregiverCard;
