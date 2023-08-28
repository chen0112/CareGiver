import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCaregiverContext } from "./context/CaregiverContext";
import { useCareneederContext } from "./context/CareneederContext";
import CaregiverForm from "./components/CaregiverForm/CaregiverForm";
import CaregiverList from "./components/CaregiverList/CaregiverList";
import CaregiverDetail from "./components/CaregiverDetails/CaregiverDetail";
import HomePage from "./components/Home/HomePage";
import { Caregiver, Careneeder } from "./types/Types";
import Register from "./components/Register/Register";
import SignIn from "./components/SignIn/SignIn";
import MyCaregivers from "./components/MyCaregiver/MyCaregiver";
import CareneederForm from "./components/CareneederForm/CareneederForm";
import CareneederList from "./components/CareneederList/CareneederList";

const API_URL = "https://nginx.yongxinguanai.com/api/all_caregivers";

const API_URL_UPLOAD = "https://nginx.yongxinguanai.com/api/upload";

const API_URL_careneeders = "https://nginx.yongxinguanai.com/api/all_careneeders";

const AppRoutes: React.FC = () => {
  const { caregivers, setCaregivers } = useCaregiverContext();
  const { careneeders, setCareneeders } = useCareneederContext();
  

  const updateCaregivers = (newCaregiver: Caregiver) => {
    console.log("Updating caregivers with:", caregivers); // Debugging log
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

  const updateCareneeders = (newCareNeeder: Careneeder) => {
    console.log("Updating care needers with:", newCareNeeder); // Debugging log
    setCareneeders((prevData) => {
      return [...(prevData || []), newCareNeeder];
    });
  };
  
  const getCareneeders = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setCareneeders(data))
      .catch((error) => console.error("Error fetching care needers:", error));
  };
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        {/* Pass updateCaregivers and getCaregivers as props to the CaregiverForm component */}
        <Route
          path="/signup_caregivers"
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
        <Route path="/mycaregiver/:phone" element={<MyCaregivers />} />
        <Route
          path="/signup_careneeders"
          element={
            <CareneederForm
              updateCareneeder={updateCareneeders}
              getCareneeder={getCareneeders}
              API_URL={API_URL_careneeders}
              API_URL_UPLOAD={API_URL_UPLOAD}
            />
          }
        />
        <Route path="/careneeders" element={<CareneederList />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
