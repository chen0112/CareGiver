import React, { createContext, useState, useContext, useEffect } from "react";
import { AnimalcaregiversSchedule } from "../types/Types";
import { BASE_URL } from "../types/Constant";

interface AnimalcaregiverScheduleProviderProps {
  children: React.ReactNode;
}

export const AnimalcaregiverScheduleContext = createContext<{
  animalcaregiversSchedule: AnimalcaregiversSchedule[];
  setCaregiversSchedule: React.Dispatch<
    React.SetStateAction<AnimalcaregiversSchedule[]>
  >;
  updateCaregiversSchedule: (newCaregiverSchedule: AnimalcaregiversSchedule) => void;
  getCaregiversSchedule: () => void;
}>({
  animalcaregiversSchedule: [],
  setCaregiversSchedule: () => {},
  updateCaregiversSchedule: () => {},
  getCaregiversSchedule: () => {},
});

const AnimalCaregiverScheduleProvider: React.FC<AnimalcaregiverScheduleProviderProps> = ({
  children,
}) => {
  const [animalcaregiversSchedule, setCaregiversSchedule] = useState<AnimalcaregiversSchedule[]>(
    []
  );

  const getCaregiversSchedule = () => {
    fetch(`${BASE_URL}/api/all_animalcaregiverschedule`) // Adjust URL
      .then((response) => response.json())
      .then((data) => setCaregiversSchedule(data))
      .catch((error) =>
        console.error("Error fetching animal caregivers schedule:", error)
      );
  };

  useEffect(() => {
    getCaregiversSchedule();
  }, []);

  const updateCaregiversSchedule = (updatedCaregiversSchedule: AnimalcaregiversSchedule) => {
    console.log("Previous animalcaregivers schedule:", animalcaregiversSchedule);
    setCaregiversSchedule((prevData) => {
      console.log(
        "Updating caregiver with new animalcaregiverschedule:",
        updatedCaregiversSchedule
      );
      // Map through the previous caregivers and replace the one with the updated ID
      return prevData.map((Schedule) =>
        Schedule.id === updatedCaregiversSchedule.id
          ? updatedCaregiversSchedule
          : Schedule
      );
    });
  };

  return (
    <AnimalcaregiverScheduleContext.Provider
      value={{
        animalcaregiversSchedule,
        setCaregiversSchedule,
        updateCaregiversSchedule,
        getCaregiversSchedule,
      }}
    >
      {children}
    </AnimalcaregiverScheduleContext.Provider>
  );
};

export const useAnimalCaregiverScheduleContext = () => {
  const context = useContext(AnimalcaregiverScheduleContext);
  if (!context) {
    throw new Error(
      "useAnimalCaregiverContext must be used within a CaregiverProvider"
    );
  }
  return context;
};

export default AnimalCaregiverScheduleProvider;
