import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCaregiverContext } from "./context/CaregiverContext";
import CaregiverForm from "./components/CaregiverForm/CaregiverForm";
import CaregiverList from "./components/CaregiverList/CaregiverList";
import CaregiverDetail from "./components/CaregiverDetails/CaregiverDetail";
import HomePage from "./components/Home/HomePage";
import { Caregiver } from "./types/Types";

const API_URL = "https://54.183.20.207/api/caregivers";
const API_URL_UPLOAD = "https://54.183.20.207/api/upload";

const AppRoutes: React.FC = () => {
  const { caregivers, setCaregivers } = useCaregiverContext();

  const updateCaregivers = (newCaregiver: Caregiver) => {
    console.log('Updating caregivers with:', caregivers); // Debugging log
    setCaregivers((prevData) => {
      return [...(prevData || []), newCaregiver];
    });
  };

  const getCaregivers = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setCaregivers(data))
      .catch((error) => console.error("Error fetching caregivers:", error));
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
              API_URL_UPLOAD={API_URL_UPLOAD}
            />
          }
        />
        <Route path="/caregivers" element={<CaregiverList />} />
        <Route path="/caregivers/:id" element={<CaregiverDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
