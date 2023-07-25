// components/CaregiverForm.tsx
import React, { useState } from "react";
import { Caregiver } from "../types/Types";

interface CaregiverFormProps {
  onSubmit: (caregiver: Caregiver) => void;
  API_URL: string;
}

const initialFormData: Partial<Caregiver> = {
  name: "",
  description: "",
  age: undefined,
  education: "",
  gender: "",
  years_of_experience: undefined,
};

const CaregiverForm: React.FC<CaregiverFormProps> = ({ onSubmit, API_URL }) => {
  const [formData, setFormData] = useState<Partial<Caregiver>>(initialFormData); // Type annotation for formData
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    // Validate the form data here (e.g., check if required fields are filled)
    if (!formData.name || !formData.description) {
      alert("Please fill in all required fields.");
      return;
    }

    // Set the isSubmitting flag to true to prevent duplicate submissions
    setIsSubmitting(true);

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
      <div>
        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="education">Education:</label>
        <input
          type="text"
          id="education"
          name="education"
          value={formData.education}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="gender">Gender:</label>
        <input
          type="text"
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="years_of_experience">Years of Experience:</label>
        <input
          type="number"
          id="years_of_experience"
          name="years_of_experience"
          value={formData.years_of_experience || ""}
          onChange={handleChange}
        />
      </div>
      {/* Add other input fields for other properties */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default CaregiverForm;
