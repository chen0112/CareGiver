import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCaregiverContext } from "./context/CaregiverContext";
import { useCareneederContext } from "./context/CareneederContext";
import { useAnimalCaregiverFormContext } from "./context/AnimalCaregiverFormContext";
import CaregiverForm from "./components/CaregiverForm/CaregiverForm";
import CaregiverList from "./components/CaregiverList/CaregiverList";
import CaregiverDetail from "./components/CaregiverDetails/CaregiverDetail";
import CaregiverAds from "./components/CaregiverAds/CaregiverAds";
import HomePage from "./components/Home/HomePage";
import { Caregiver, Careneeder, AnimalCaregiverForm } from "./types/Types";
import Register from "./components/Register/Register";
import SignIn from "./components/SignIn/SignIn";
import MyCaregivers from "./components/MyCaregiver/MyCaregiver";
import CareneederForm from "./components/CareneederForm/CareneederForm";
import CareneederList from "./components/CareneederList/CareneederList";
import CareneederDetail from "./components/CareneederDetail/CareneederDetail";
import MyCareneeders from "./components/MyCardneeder/MyCareneeder";
import CareneederSchedule from "./components/CareneederSchedule/CareneederSchedule";
import CareneederAds from "./components/CareneederAds/CareneederAds";
import AnimalCaregiver from "./components/AnimalCaregiver/AnimalCaregiver";
import AnimalCaregiverWebForm from "./components/AnimalCaregiverForm/AnimalCaregiverForm";
import AnimalCaregiverAd from "./components/AnimalCaregiverAd/AnimalCaregiverAd"
import AnimalCaregiverList from "./components/AnimalCaregiverList/AnimalCaregiverList";
import AnimalCaregiverDetail from "./components/AnimalCaregiverDetail/AnimalCaregiverDetail";
import MyAnimalCaregiver from "./components/MyAnimalCaregiver/MyAnimalCaregiver";

const API_URL = "https://nginx.yongxinguanai.com/api/all_caregivers";

const API_URL_UPLOAD = "https://nginx.yongxinguanai.com/api/upload";

const API_URL_careneeders =
  "https://nginx.yongxinguanai.com/api/all_careneeders";

const API_URL_animalcaregiver = "https://nginx.yongxinguanai.com/api/all_animalcaregivers";

const AppRoutes: React.FC = () => {
  const { caregivers, setCaregivers } = useCaregiverContext();
  const { careneeders, setCareneeders } = useCareneederContext();
  const { animalcaregiversForm, setanimalcaregiversForm } = useAnimalCaregiverFormContext();

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
    console.log("Updating care needers with:", careneeders); // Debugging log
    setCareneeders((prevData) => {
      return [...(prevData || []), newCareNeeder];
    });
  };

  const getCareneeders = () => {
    fetch(API_URL_careneeders)
      .then((response) => response.json())
      .then((data) => setCareneeders(data))
      .catch((error) => console.error("Error fetching care needers:", error));
  };

  const updateAnimalCaregiverForm = (newCareNeeder: AnimalCaregiverForm) => {
    console.log("Updating animalcaregiversForm with:", animalcaregiversForm); // Debugging log
    setanimalcaregiversForm((prevData) => {
      return [...(prevData || []), newCareNeeder];
    });
  };

  const getAnimalCaregiverForm = () => {
    fetch(API_URL_animalcaregiver)
      .then((response) => response.json())
      .then((data) => setCareneeders(data))
      .catch((error) => console.error("Error fetching animalcaregiversForm:", error));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/register/caregiver"
          element={<Register userType="caregiver" />}
        />
        {/* Pass updateCaregivers and getCaregivers as props to the CaregiverForm component */}
        <Route
          path="/signup_caregiver"
          element={
            <CaregiverForm
              updateCaregivers={updateCaregivers}
              getCaregivers={getCaregivers}
              API_URL={API_URL}
              API_URL_UPLOAD={API_URL_UPLOAD}
            />
          }
        />
        <Route
          path="/signin/caregiver"
          element={<SignIn userType="caregiver" />}
        />
        <Route path="/caregivers" element={<CaregiverList />} />
        <Route path="/caregivers/:id" element={<CaregiverDetail />} />
        <Route path="/mycaregiver/:phone" element={<MyCaregivers />} />
        <Route path="/signup_caregiver/ads" element={<CaregiverAds />} />

        {/* careneeder */}

        <Route
          path="/signup_careneeder"
          element={
            <CareneederForm
              updateCareneeder={updateCareneeders}
              getCareneeder={getCareneeders}
              API_URL={API_URL_careneeders}
              API_URL_UPLOAD={API_URL_UPLOAD}
            />
          }
        />
        <Route
          path="/signin/careneeder"
          element={<SignIn userType="careneeder" />}
        />
        <Route
          path="/register/careneeder"
          element={<Register userType="careneeder" />}
        />
        <Route path="/careneeders" element={<CareneederList />} />
        <Route path="/careneeders/:id" element={<CareneederDetail />} />
        <Route path="/mycareneeder/:phone" element={<MyCareneeders />} />
        <Route
          path="/signup_careneeder/schedule"
          element={<CareneederSchedule />}
        />
        <Route
          path="/signup_careneeder/schedule/ads"
          element={<CareneederAds />}
        />

        {/* pet care */}
        <Route
          path="/signin/animalcaregiver"
          element={<SignIn userType="animalcaregiver" />}
        />
        <Route
          path="/register/animalcaregiver"
          element={<Register userType="animalcaregiver" />}
        />
        <Route
          path="/signup_animalcaregiver"
          element={
            <AnimalCaregiverWebForm
              updateCaregivers={updateAnimalCaregiverForm}
              getCaregivers={getAnimalCaregiverForm}
              API_URL={API_URL_animalcaregiver}
              API_URL_UPLOAD={API_URL_UPLOAD}
            />
          }
        />
          <Route
          path="/signup_animalcaregiver/details"
          element={<AnimalCaregiver />}
        />
         <Route path="/signup_animalcaregiver/details/ads" element={<AnimalCaregiverAd />} />
         <Route path="/animalcaregivers" element={<AnimalCaregiverList />} />
         <Route path="/animalcaregivers/:id" element={<AnimalCaregiverDetail />} /> 
         <Route path="/myanimalcaregiverform/:phone" element={<MyAnimalCaregiver />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
