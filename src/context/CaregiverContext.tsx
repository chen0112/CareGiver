import React, { createContext, useState, useContext, useEffect } from "react";
import { Caregiver } from "../types/Types";
import { BASE_URL } from "../types/Constant";

interface CaregiverProviderProps {
  children: React.ReactNode;
}

export const CaregiverContext = createContext<{
  caregivers: Caregiver[];
  setCaregivers: React.Dispatch<React.SetStateAction<Caregiver[]>>;
  updateCaregivers: (newCaregiver: Caregiver) => void;
  getCaregivers: () => void;
}>({
  caregivers: [],
  setCaregivers: () => {},
  updateCaregivers: () => {},
  getCaregivers: () => {},
});

const CaregiverProvider: React.FC<CaregiverProviderProps> = ({ children }) => {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);

  const getCaregivers = () => {
    fetch(`${BASE_URL}/api/caregiver/all_caregivers`)
      .then((response) => response.json())
      .then((data) => setCaregivers(data))
      .catch((error) => console.error("Error fetching caregivers:", error));
  };

  useEffect(() => {
    getCaregivers();
  }, []); // Empty array indicates that this effect should only run once on mount, not on updates

  const updateCaregivers = (updatedCaregiver: Caregiver) => {
    console.log("Previous caregivers:", caregivers);
    setCaregivers((prevData) => {
      console.log("Updating caregivers with new caregiver:", updatedCaregiver);
      // Map through the previous caregivers and replace the one with the updated ID
      return prevData.map((caregiver) =>
        caregiver.id === updatedCaregiver.id ? updatedCaregiver : caregiver
      );
    });
  };

  return (
    <CaregiverContext.Provider
      value={{ caregivers, setCaregivers, updateCaregivers, getCaregivers }}
    >
      {children}
    </CaregiverContext.Provider>
  );
};

export const useCaregiverContext = () => {
  const context = useContext(CaregiverContext);
  if (!context) {
    throw new Error(
      "useCaregiverContext must be used within a CaregiverProvider"
    );
  }
  if (!Array.isArray(context.caregivers)) {
    context.caregivers = []; // Ensuring that caregivers is an array
  }
  console.log(
    "Current caregivers state from CaregiverContext:",
    context.caregivers
  );
  return context;
};

export default CaregiverProvider;
