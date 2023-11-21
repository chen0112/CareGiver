import React from "react";
import Routes from "./Routes";
import CaregiverProvider from "./context/CaregiverContext";
import CareneederProvider from "./context/CareneederContext"; // Import CareneederProvider
import CareneederScheduleProvider from "./context/CareneederScheduleContext"; // Import CareneederScheduleProvider
import CareneederAdsProvider from "./context/CareneederAdsContext";
import CaregiverAdsProvider from "./context/CaregiverAdsContext";
import CaregiverScheduleProvider from "./context/CaregiverScheduleContext";
import "./index.css";
import AnimalCaregiverFormProvider from "./context/AnimalCaregiverFormContext";
import AnimalCaregiverProvider from "./context/AnimalCaregiverContext";
import AnimalCaregiverAdsProvider from "./context/AnimalCaregiverAdsContext";
import AnimalCareneederProvider from "./context/AnimalCareneederContext";
import AnimalCareneederFormProvider from "./context/AnimalCareneederFormContext";
import AnimalCareneederAdsProvider from "./context/AnimalCareneederAdsContext";
import AnimalCaregiverScheduleProvider from "./context/AnimalCaregiverScheduleContext";
import AnimalCareneederScheduleProvider from "./context/AnimalCareneederScheduleContext";
import AuthProvider from "./context/AuthContext";
import { AblyProvider } from "./context/AblyContext";

const App: React.FC = () => {
  return (
    <div>
      <CaregiverProvider>
        <CaregiverScheduleProvider>
          <CareneederProvider>
            <CareneederScheduleProvider>
              <CareneederAdsProvider>
                <CaregiverAdsProvider>
                  <AnimalCaregiverFormProvider>
                    <AnimalCaregiverProvider>
                      <AnimalCaregiverScheduleProvider>
                        <AnimalCaregiverAdsProvider>
                          <AnimalCareneederAdsProvider>
                            <AnimalCareneederProvider>
                              <AnimalCareneederFormProvider>
                                <AnimalCareneederScheduleProvider>
                                  <AuthProvider>
                                    <AblyProvider>
                                      <Routes />
                                    </AblyProvider>
                                  </AuthProvider>
                                </AnimalCareneederScheduleProvider>
                              </AnimalCareneederFormProvider>
                            </AnimalCareneederProvider>
                          </AnimalCareneederAdsProvider>
                        </AnimalCaregiverAdsProvider>
                      </AnimalCaregiverScheduleProvider>
                    </AnimalCaregiverProvider>
                  </AnimalCaregiverFormProvider>
                </CaregiverAdsProvider>
              </CareneederAdsProvider>
            </CareneederScheduleProvider>
          </CareneederProvider>
        </CaregiverScheduleProvider>
      </CaregiverProvider>
    </div>
  );
};

export default App;
