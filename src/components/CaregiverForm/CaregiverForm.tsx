// components/CaregiverForm.tsx
import React, { useState } from "react";
import { Caregiver } from "../../types/Types";
import "./CaregiverForm.css";

interface CaregiverFormProps {
  API_URL: string;
  updateCaregivers: (newCaregiver: Caregiver) => void;
  getCaregivers: () => void;
}

const initialFormData: Partial<Caregiver> = {
  name: "",
  description: "",
  age: null,
  education: "",
  gender: "",
  years_of_experience: null,
};

const CaregiverForm: React.FC<CaregiverFormProps> = ({API_URL, updateCaregivers, getCaregivers }) => {
  const [formData, setFormData] = useState<Partial<Caregiver>>(initialFormData); // Type annotation for formData
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  // Function to reset the form after successful submission
  const resetForm = () => {
    setIsSubmitted(true);
    setIsSubmitting(false);
    setIsFormDisabled(false);
    setTimeout(() => {
      setIsSubmitted(false); // Reset the success message after a short delay
    }, 3000); // Adjust the duration of the success message display as needed (in milliseconds)
    setFormData(initialFormData); // Clear the form fields after successful submission
  };

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

    // Convert the formData object to JSON, including undefined values
    const formDataJson = JSON.stringify(formData, (key, value) => {
      // If the value is undefined, return "undefined" as a string
      return value === undefined ? "undefined" : value;
    });

    console.log(formData);

    // Set the isSubmitting flag to true to prevent duplicate submissions
    setIsSubmitting(true);

    // Disable the form to prevent user interaction during submission
    setIsFormDisabled(true);

    // Send the caregiver data to the backend
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formDataJson,
    })
      .then((response) => response.json())
      .then((newCaregiver) => {
        // Display the newly added caregiver in the frontend list
        updateCaregivers(newCaregiver);
        // Fetch the updated list of caregivers from the backend
        getCaregivers();
        // Reset the form after successful submission
        resetForm();
      })
      .catch((error) => console.error("Error adding caregiver:", error));
  };

  return (
    <form onSubmit={handleSubmit} className={isFormDisabled ? "disabled" : ""}>
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
      <button type="submit" disabled={isSubmitting || isFormDisabled}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
      {isSubmitted && (
        <div className="success-message">
          <p>Form submitted successfully!</p>
        </div>
      )}
      {/* Show success message */}
    </form>
  );
};

export default CaregiverForm;
