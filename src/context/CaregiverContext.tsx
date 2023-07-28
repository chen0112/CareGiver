import React, { createContext, useState, useContext, useEffect } from 'react';
import { Caregiver } from '../types/Types';

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
    fetch("http://127.0.0.1:5000/api/caregivers")
      .then((response) => response.json())
      .then((data) => setCaregivers(data))
      .catch((error) => console.error('Error fetching caregivers:', error));
  };

  useEffect(() => {
    getCaregivers();
  }, []); // Empty array indicates that this effect should only run once on mount, not on updates

  const updateCaregivers = (newCaregiver: Caregiver) => {
    console.log("Previous caregivers:", caregivers);
    setCaregivers((prevData) => {
      console.log("Updating caregivers with new caregiver:", newCaregiver);
      return [...prevData, newCaregiver];
    });
  };

  return (
    <CaregiverContext.Provider value={{ caregivers, setCaregivers, updateCaregivers, getCaregivers }}>
      {children}
    </CaregiverContext.Provider>
  );
};

export const useCaregiverContext = () => {
    const context = useContext(CaregiverContext);
    console.log("Current caregivers state:", context.caregivers);
    return context;
};

export default CaregiverProvider;
