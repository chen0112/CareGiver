// components/CaregiverForm.tsx
import React, { useState } from "react";
import { Caregiver } from "../types/Types";

interface CaregiverFormProps {
  onSubmit: (caregiver: Caregiver) => void;
  API_URL: string;
}

const CaregiverForm: React.FC<CaregiverFormProps> = ({ onSubmit, API_URL }) => {
  const [formData, setFormData] = useState<Partial<Caregiver>>({}); // Type annotation for formData

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the form data here (e.g., check if required fields are filled)
    if (!formData.name || !formData.description) {
      alert("Please fill in all required fields.");
      return;
    }

    // Send the caregiver data to the backend
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((newCaregiver) => {
        // Display the newly added caregiver in the frontend list
        onSubmit(newCaregiver);
        // Reset the form data after submission
        setFormData({});
      })
      .catch((error) => console.error("Error adding caregiver:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      {/* Add other input fields for other properties */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default CaregiverForm;
