import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCaregiverContext } from "./context/CaregiverContext";
import { useCareneederContext } from "./context/CareneederContext";
import { useAnimalCaregiverFormContext } from "./context/AnimalCaregiverFormContext";
import CaregiverForm from "./components/CaregiverComponent/CaregiverForm/CaregiverForm";
import CaregiverList from "./components/CaregiverComponent/CaregiverList/CaregiverList";
import CaregiverDetail from "./components/CaregiverComponent/CaregiverDetails/CaregiverDetail";
import CaregiverAds from "./components/CaregiverComponent/CaregiverAds/CaregiverAds";
import HomePage from "./components/Home/HomePage";
import { Caregiver, Careneeder, AnimalCaregiverForm } from "./types/Types";
import Register from "./components/Register/Register";
import SignIn from "./components/SignIn/SignIn";
import MyCaregivers from "./components/CaregiverComponent/MyCaregiver/MyCaregiver";
import CareneederForm from "./components/CareneederComponent/CareneederForm/CareneederForm";
import CareneederList from "./components/CareneederComponent/CareneederList/CareneederList";
import CareneederDetail from "./components/CareneederComponent/CareneederDetail/CareneederDetail";
import MyCareneeders from "./components/CareneederComponent/MyCardneeder/MyCareneeder";
import CareneederSchedule from "./components/CareneederComponent/CareneederSchedule/CareneederSchedule";
import CareneederAds from "./components/CareneederComponent/CareneederAds/CareneederAds";
import AnimalCaregiver from "./components/AnimalCaregiverComponent/AnimalCaregiver/AnimalCaregiver";
import AnimalCaregiverWebForm from "./components/AnimalCaregiverComponent/AnimalCaregiverForm/AnimalCaregiverForm";
import AnimalCaregiverAd from "./components/AnimalCaregiverComponent/AnimalCaregiverAd/AnimalCaregiverAd";
import AnimalCaregiverList from "./components/AnimalCaregiverComponent/AnimalCaregiverList/AnimalCaregiverList";
import AnimalCaregiverDetail from "./components/AnimalCaregiverComponent/AnimalCaregiverDetail/AnimalCaregiverDetail";
import MyAnimalCaregiver from "./components/AnimalCaregiverComponent/MyAnimalCaregiver/MyAnimalCaregiver";
import AnimalCareneederWebForm from "./components/AnimalCareneederComponent/AnimalCareneederForm/AnimalCareneederForm";
import AnimalCareneeder from "./components/AnimalCareneederComponent/AnimalCareneeder/AnimalCareneeder";
import AnimalCareneederAds from "./components/AnimalCareneederComponent/AnimalCareneederAd/AnimalCareneederAd";
import AnimalCareneederList from "./components/AnimalCareneederComponent/AnimalCareneederList/AnimalCareneederList";
import AnimalCareneederDetail from "./components/AnimalCareneederComponent/AnimalCareneederDetail/AnimalCareneederDetail";
import MyAnimalCareneeder from "./components/AnimalCareneederComponent/MyAnimalCareneeder/MyAnimalCareneeder";
import ChatWindow from "./components/ChatFeature/ChatWindow/ChatWindow";
import ChatPage from "./components/ChatFeature/ChatPage/ChatPage";
import ChatConversation from "./components/ChatFeature/ChatConversation/ChatConversation";
import { BASE_URL } from "./types/Constant";

const API_URL = `${BASE_URL}/api/all_caregivers`;

const API_URL_UPLOAD = `${BASE_URL}/api/upload`;

const API_URL_careneeders = `${BASE_URL}/api/all_careneeders`;

const API_URL_animalcaregivers = `${BASE_URL}/api/all_animalcaregivers`;

const API_URL_animalcareneeders = `${BASE_URL}/api/all_animalcareneeders`;

const AppRoutes: React.FC = () => {
  const { caregivers, setCaregivers } = useCaregiverContext();
  const { careneeders, setCareneeders } = useCareneederContext();
  const { animalcaregiversForm, setanimalcaregiversForm } =
    useAnimalCaregiverFormContext();

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
    fetch(API_URL_animalcaregivers)
      .then((response) => response.json())
      .then((data) => setCareneeders(data))
      .catch((error) =>
        console.error("Error fetching animalcaregiversForm:", error)
      );
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
        <Route path="/caregivers/phone/:phone/userType/:userType" element={<CaregiverList />} />
        <Route path="/caregivers/id/:id" element={<CaregiverDetail />} />
        <Route path="/mycaregiver/phone/:phone" element={<MyCaregivers />} />
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
        <Route path="/careneeders/phone/:phone/userType/:userType" element={<CareneederList />} />
        <Route path="/careneeders/id/:id" element={<CareneederDetail />} />
        <Route path="/mycareneeder/phone/:phone" element={<MyCareneeders />} />
        <Route
          path="/signup_careneeder/schedule"
          element={<CareneederSchedule />}
        />
        <Route
          path="/signup_careneeder/schedule/ads"
          element={<CareneederAds />}
        />

        {/* pet caregiver */}
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
              API_URL={API_URL_animalcaregivers}
              API_URL_UPLOAD={API_URL_UPLOAD}
            />
          }
        />
        <Route
          path="/signup_animalcaregiver/details"
          element={<AnimalCaregiver />}
        />
        <Route
          path="/signup_animalcaregiver/details/ads"
          element={<AnimalCaregiverAd />}
        />
        <Route
          path="/animalcaregivers/phone/:phone/userType/:userType"
          element={<AnimalCaregiverList />}
        />
        <Route
          path="/animalcaregivers/id/:id"
          element={<AnimalCaregiverDetail />}
        />
        <Route
          path="/myanimalcaregiverform/phone/:phone"
          element={<MyAnimalCaregiver />}
        />

        {/* pet careneeder */}

        <Route
          path="/signin/animalcareneeder"
          element={<SignIn userType="animalcareneeder" />}
        />
        <Route
          path="/register/animalcareneeder"
          element={<Register userType="animalcareneeder" />}
        />
        <Route
          path="/signup_animalcareneeder"
          element={
            <AnimalCareneederWebForm
              updateAnimalCareneeders={updateAnimalCaregiverForm}
              getAnimalCareneeders={getAnimalCaregiverForm}
              API_URL={API_URL_animalcareneeders}
              API_URL_UPLOAD={API_URL_UPLOAD}
            />
          }
        />
        <Route
          path="/signup_animalcareneeder/details"
          element={<AnimalCareneeder />}
        />
        <Route
          path="/animalcareneeders/phone/:phone/userType/:userType"
          element={<AnimalCareneederList />}
        />
        <Route
          path="/signup_animalcareneeders/details/ads"
          element={<AnimalCareneederAds />}
        />
        <Route
          path="/animalcareneeders/id/:id"
          element={<AnimalCareneederDetail />}
        />
        <Route
          path="/myanimalcareneederform/phone/:phone"
          element={<MyAnimalCareneeder />}
        />

        {/* chat window */}
        <Route path="/caregivers/message" element={<ChatWindow />} />
        <Route path="/careneeders/message" element={<ChatWindow />} />
        <Route path="/chatmessagehub" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
