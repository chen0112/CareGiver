import React from "react";
import Routes from "./Routes";
import CaregiverProvider from "./context/CaregiverContext";


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
