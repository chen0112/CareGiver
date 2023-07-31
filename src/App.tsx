import React from "react";
import Routes from "./Routes";
import CaregiverProvider from "./context/CaregiverContext";
import "./index.css";


const App: React.FC = () => {
  return (
    <div>
      <CaregiverProvider>
        <Routes />
      </CaregiverProvider>
    </div>
  );
};

export default App;
