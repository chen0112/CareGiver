import React, { createContext, useState, useContext, useEffect } from "react";
import { AnimalcareneedersSchedule } from "../types/Types";
import { BASE_URL } from "../types/Constant";

interface AnimalcareneederScheduleProviderProps {
  children: React.ReactNode;
}

export const AnimalcareneederScheduleContext = createContext<{
  animalcareneedersSchedule: AnimalcareneedersSchedule[];
  setCareneedersSchedule: React.Dispatch<
    React.SetStateAction<AnimalcareneedersSchedule[]>
  >;
  updateCareneedersSchedule: (newCareneederSchedule: AnimalcareneedersSchedule) => void;
  getCareneedersSchedule: () => void;
}>({
  animalcareneedersSchedule: [],
  setCareneedersSchedule: () => {},
  updateCareneedersSchedule: () => {},
  getCareneedersSchedule: () => {},
});

const AnimalCareneederScheduleProvider: React.FC<AnimalcareneederScheduleProviderProps> = ({
  children,
}) => {
  const [animalcareneedersSchedule, setCareneedersSchedule] = useState<AnimalcareneedersSchedule[]>(
    []
  );

  const getCareneedersSchedule = () => {
    fetch(`${BASE_URL}/api/animalcareneeder/all_animalcareneederschedule`) // Adjust URL
      .then((response) => response.json())
      .then((data) => setCareneedersSchedule(data))
      .catch((error) =>
        console.error("Error fetching animal careneeders schedule:", error)
      );
  };

  useEffect(() => {
    getCareneedersSchedule();
  }, []);

  const updateCareneedersSchedule = (updatedCareneedersSchedule: AnimalcareneedersSchedule) => {
    console.log("Previous animalcareneeders schedule:", animalcareneedersSchedule);
    setCareneedersSchedule((prevData) => {
      console.log(
        "Updating careneeder with new animalcareneederschedule:",
        updatedCareneedersSchedule
      );
      // Map through the previous careneeders and replace the one with the updated ID
      return prevData.map((Schedule) =>
        Schedule.id === updatedCareneedersSchedule.id
          ? updatedCareneedersSchedule
          : Schedule
      );
    });
  };

  return (
    <AnimalcareneederScheduleContext.Provider
      value={{
        animalcareneedersSchedule,
        setCareneedersSchedule,
        updateCareneedersSchedule,
        getCareneedersSchedule,
      }}
    >
      {children}
    </AnimalcareneederScheduleContext.Provider>
  );
};

export const useAnimalCareneederScheduleContext = () => {
  const context = useContext(AnimalcareneederScheduleContext);
  if (!context) {
    throw new Error(
      "useAnimalCareneederContext must be used within a CareneederProvider"
    );
  }
  return context;
};

export default AnimalCareneederScheduleProvider;
