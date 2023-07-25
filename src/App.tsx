// App.tsx
import React, { useEffect, useState } from "react";
import CaregiverForm from "./components/CaregiverForm";
import CaregiverList from "./components/CaregiverList";
import { Caregiver } from "./types/Types"; 

const API_URL = "http://127.0.0.1:5000/api/caregivers"; // Replace with your actual backend URL

const App: React.FC = () => {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);

  const handleFormSubmit = (caregiver: Caregiver) => {
    // Send the caregiver data to the backend using the API_URL
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(caregiver),
    })
      .then((response) => response.json())
      .then((newCaregiver) => {
        // Add the newly added caregiver to the caregiversData state
        setCaregivers((prevData) => [...prevData, newCaregiver]);
      })
      .catch((error) => console.error("Error adding caregiver:", error));
  };

  return (
    <div>
      {/* Render the caregiver data in the CaregiverList component */}
      <CaregiverList caregivers={caregivers} />
      {/* Pass the API_URL and handleFormSubmit to the CaregiverForm component */}
      <CaregiverForm onSubmit={handleFormSubmit} API_URL={API_URL} />
    </div>
  );
};

export default App;
