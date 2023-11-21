import React, { createContext, useState, useContext, useEffect } from "react";
import { Schedule } from "../types/Types";
import { BASE_URL } from "../types/Constant";

interface CareneederScheduleProviderProps {
  children: React.ReactNode;
}

export const CareneederScheduleContext = createContext<{
  careneedersSchedule: Schedule[];
  setCareneedersSchedule: React.Dispatch<React.SetStateAction<Schedule[]>>;
  updateCareneedersSchedule: (newCareNeederSchedule: Schedule) => void;
  getCareneedersSchedule: () => void;
}>({
  careneedersSchedule: [],
  setCareneedersSchedule: () => {},
  updateCareneedersSchedule: () => {},
  getCareneedersSchedule: () => {},
});

const CareneederScheduleProvider: React.FC<CareneederScheduleProviderProps> = ({
  children,
}) => {
  const [careneedersSchedule, setCareneedersSchedule] = useState<Schedule[]>(
    []
  );

  const getCareneedersSchedule = () => {
    fetch(`${BASE_URL}/api/careneeder/all_careneederschedule`) // Adjust URL
      .then((response) => response.json())
      .then((data) => setCareneedersSchedule(data))
      .catch((error) =>
        console.error("Error fetching care needers schedule:", error)
      );
  };

  useEffect(() => {
    getCareneedersSchedule();
  }, []);

  const updateCareneedersSchedule = (updatedCareneedersSchedule: Schedule) => {
    console.log("Previous careneeder schedule:", careneedersSchedule);
    setCareneedersSchedule((prevData) => {
      console.log(
        "Updating careneeder with new careneederschedule:",
        updatedCareneedersSchedule
      );
      // Map through the previous caregivers and replace the one with the updated ID
      return prevData.map((Schedule) =>
        Schedule.id === updatedCareneedersSchedule.id
          ? updatedCareneedersSchedule
          : Schedule
      );
    });
  };

  return (
    <CareneederScheduleContext.Provider
      value={{
        careneedersSchedule,
        setCareneedersSchedule,
        updateCareneedersSchedule,
        getCareneedersSchedule,
      }}
    >
      {children}
    </CareneederScheduleContext.Provider>
  );
};

export const useCareneederScheduleContext = () => {
  const context = useContext(CareneederScheduleContext);
  if (!context) {
    throw new Error(
      "useCareNeederContext must be used within a CareNeederProvider"
    );
  }
  return context;
};

export default CareneederScheduleProvider;
