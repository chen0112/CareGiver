import React from "react";
import Routes from "./Routes";
import CaregiverProvider from "./context/CaregiverContext";
import CareneederProvider from "./context/CareneederContext"; // Import CareneederProvider
import CareneederScheduleProvider from "./context/CareneederScheduleContext"; // Import CareneederScheduleProvider
import CareneederAdsProvider from "./context/CareneederAdsContext";
import "./index.css";

const App: React.FC = () => {
  return (
    <div>
      <CaregiverProvider>
        <CareneederProvider>
          <CareneederScheduleProvider>
            <CareneederAdsProvider>
              <Routes />
            </CareneederAdsProvider>
          </CareneederScheduleProvider>
        </CareneederProvider>
      </CaregiverProvider>
    </div>
  );
};

export default App;
