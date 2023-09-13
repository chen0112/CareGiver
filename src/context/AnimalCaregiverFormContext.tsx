import React, { createContext, useState, useContext, useEffect } from "react";
import { AnimalCaregiverForm } from "../types/Types";

interface CaregiverProviderProps {
  children: React.ReactNode;
}

export const AnimalCaregiverFormContext = createContext<{
  animalcaregiversForm: AnimalCaregiverForm[];
  setanimalcaregiversForm: React.Dispatch<React.SetStateAction<AnimalCaregiverForm[]>>;
  updateanimalcaregivers: (newCaregiver: AnimalCaregiverForm) => void;
  getanimalcaregivers: () => void;
}>({
    animalcaregiversForm: [],
    setanimalcaregiversForm: () => {},
  updateanimalcaregivers: () => {},
  getanimalcaregivers: () => {},
});

const AnimalCaregiverFormProvider: React.FC<CaregiverProviderProps> = ({ children }) => {
  const [animalcaregiversForm, setanimalcaregiversForm] = useState<AnimalCaregiverForm[]>([]);

  const getanimalcaregivers = () => {
    fetch("https://nginx.yongxinguanai.com/api/all_animalcaregivers")
      .then((response) => response.json())
      .then((data) => setanimalcaregiversForm(data))
      .catch((error) => console.error("Error fetching animalcaregiversForm:", error));
  };

  useEffect(() => {
    getanimalcaregivers();
  }, []); // Empty array indicates that this effect should only run once on mount, not on updates

  const updateanimalcaregivers = (updatedanimalcaregivers: AnimalCaregiverForm) => {
    console.log("Previous animalcaregiversForm:", animalcaregiversForm);
    setanimalcaregiversForm((prevData) => {
      console.log("Updating animalcaregiversForm with new animalcaregiverForm:", updatedanimalcaregivers);
      // Map through the previous caregivers and replace the one with the updated ID
      return prevData.map((animalcaregiversForm) =>
      animalcaregiversForm.id === updatedanimalcaregivers.id ? updatedanimalcaregivers : animalcaregiversForm
      );
    });
  };

  return (
    <AnimalCaregiverFormContext.Provider
      value={{ animalcaregiversForm, setanimalcaregiversForm, updateanimalcaregivers, getanimalcaregivers }}
    >
      {children}
    </AnimalCaregiverFormContext.Provider>
  );
};

export const useAnimalCaregiverFormContext = () => {
  const context = useContext(AnimalCaregiverFormContext);
  if (!context) {
    throw new Error(
      "useanimalCaregiverFormContext must be used within a animalCaregiverFormProvider"
    );
  }
  if (!Array.isArray(context.animalcaregiversForm)) {
    context.animalcaregiversForm = []; // Ensuring that caregivers is an array
  }
  console.log(
    "Current aniamlcaregiversForm state from animalCaregiverFormContext:",
    context.animalcaregiversForm
  );
  return context;
};

export default AnimalCaregiverFormProvider;
