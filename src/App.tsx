import React from "react";
import Routes from "./Routes";
import CaregiverProvider from "./context/CaregiverContext";
import CareneederProvider from "./context/CareneederContext"; // Import CareneederProvider
import CareneederScheduleProvider from "./context/CareneederScheduleContext"; // Import CareneederScheduleProvider
import CareneederAdsProvider from "./context/CareneederAdsContext";
import CaregiverAdsProvider from "./context/CaregiverAdsContext";
import "./index.css";
import AnimalCaregiverFormProvider from "./context/AnimalCaregiverFormContext";
import AnimalCaregiverProvider from "./context/AnimalCaregiverContext";
import AnimalCaregiverAdsProvider from "./context/AnimalCaregiverAdsContext";
import AnimalCareneederProvider from "./context/AnimalCareneederContext";
import AnimalCareneederFormProvider from "./context/AnimalCareneederFormContext";
import AnimalCareneederAdsProvider from "./context/AnimalCareneederAdsContext";
import AuthProvider from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <div className="">
      <CaregiverProvider>
        <CareneederProvider>
          <CareneederScheduleProvider>
            <CareneederAdsProvider>
              <CaregiverAdsProvider>
                <AnimalCaregiverFormProvider>
                  <AnimalCaregiverProvider>
                    <AnimalCaregiverAdsProvider>
                      <AnimalCareneederAdsProvider>
                        <AnimalCareneederProvider>
                          <AnimalCareneederFormProvider>
                            <AuthProvider>
                              <Routes />
                            </AuthProvider>
                          </AnimalCareneederFormProvider>
                        </AnimalCareneederProvider>
                      </AnimalCareneederAdsProvider>
                    </AnimalCaregiverAdsProvider>
                  </AnimalCaregiverProvider>
                </AnimalCaregiverFormProvider>
              </CaregiverAdsProvider>
            </CareneederAdsProvider>
          </CareneederScheduleProvider>
        </CareneederProvider>
      </CaregiverProvider>
    </div>
  );
};

export default App;
