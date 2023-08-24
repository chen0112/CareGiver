import React, { useState } from "react";
import { Caregiver } from "../../types/Types";
import { Link } from "react-router-dom";
import "./CaregiverCard.css";

interface CaregiverCardProps {
  caregiver: Caregiver;
  loggedInUserPhone?: string; // Add the logged-in user's phone number here
}

const CaregiverCard: React.FC<CaregiverCardProps> = ({
  caregiver,
  loggedInUserPhone,
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
              Save
            </button>
            <button
              onClick={handleEditClick}
              className="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <Link
            to={`/caregivers/${caregiver.id}`}
            className="no-underline block"
          >
            <div className="w-full sm:w-3/4 md:w-1/2 lg:w-4/7 mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-6 flex h-62 transition-transform transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-2xl cursor-pointer hover:bg-gray-100">
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
                <h3 className="text-xl font-semibold mb-4 underline">
                  {caregiver.name}
                </h3>
                {/* Explicitly added underline */}
                <p className="text-gray-600 mb-4 pr-6 line-clamp">
                  {caregiver.description}
                </p>
              </div>
            </div>
          </Link>
          {/* Edit button will only be visible if the logged-in user's phone number matches the caregiver's phone number */}
          {caregiver.phone === loggedInUserPhone && (
            <button className="edit-button" onClick={handleEditClick}>
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CaregiverCard;
