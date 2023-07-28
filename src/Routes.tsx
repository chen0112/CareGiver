import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCaregiverContext } from "./context/CaregiverContext";
import CaregiverForm from "./components/CaregiverForm/CaregiverForm";
import CaregiverList from "./components/CaregiverList";
import HomePage from "./components/Home/HomePage";
import { Caregiver } from "./types/Types";

const API_URL = "http://127.0.0.1:5000/api/caregivers";

const AppRoutes: React.FC = () => {
  const { caregivers, setCaregivers } = useCaregiverContext();

  const updateCaregivers = (newCaregiver: Caregiver) => {
    setCaregivers((prevData) => {
      return [...prevData, newCaregiver];
    });
  };

  const getCaregivers = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setCaregivers(data))
      .catch((error) => console.error('Error fetching caregivers:', error));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Pass updateCaregivers and getCaregivers as props to the CaregiverForm component */}
        <Route
          path="/signup"
          element={
            <CaregiverForm
              updateCaregivers={updateCaregivers}
              getCaregivers={getCaregivers}
              API_URL={API_URL}
            />
          }
        />
        <Route path="/caregivers" element={<CaregiverList />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
