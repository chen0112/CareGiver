import React from "react";
import Routes from "./Routes";
import CaregiverProvider from "./context/CaregiverContext";
import CareneederProvider from "./context/CareneederContext"; // Import CareneederProvider
import CareneederScheduleProvider from "./context/CareneederScheduleContext"; // Import CareneederScheduleProvider
import "./index.css";

const App: React.FC = () => {
  return (
    <div>
      <CaregiverProvider>
        <CareneederProvider>
          <CareneederScheduleProvider> {/* Use CareneederScheduleProvider here */}
            <Routes />
          </CareneederScheduleProvider>
        </CareneederProvider>
      </CaregiverProvider>
    </div>
  );
};

export default App;
