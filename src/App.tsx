import React from "react";
import Routes from "./Routes";
import CaregiverProvider from "./context/CaregiverContext";
import CareneederProvider from "./context/CareneederContext"; // Import CareneederProvider
import "./index.css";

const App: React.FC = () => {
  return (
    <div>
      <CaregiverProvider>
        <CareneederProvider>
          {" "}
          {/* Use CareneederProvider here */}
          <Routes />
        </CareneederProvider>
      </CaregiverProvider>
    </div>
  );
};

export default App;
