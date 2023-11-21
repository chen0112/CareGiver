import React, { createContext, useState, useContext, useEffect } from "react";
import { CaregiverSchedule } from "../types/Types";
import { BASE_URL } from "../types/Constant";

interface CaregiverScheduleProviderProps {
  children: React.ReactNode;
}

export const CaregiverScheduleContext = createContext<{
  caregiversSchedule: CaregiverSchedule[];
  setCaregiversSchedule: React.Dispatch<
    React.SetStateAction<CaregiverSchedule[]>
  >;
  updateCaregiversSchedule: (newCaregiverSchedule: CaregiverSchedule) => void;
  getCaregiversSchedule: () => void;
}>({
  caregiversSchedule: [],
  setCaregiversSchedule: () => {},
  updateCaregiversSchedule: () => {},
  getCaregiversSchedule: () => {},
});

const CaregiverScheduleProvider: React.FC<CaregiverScheduleProviderProps> = ({
  children,
}) => {
  const [caregiversSchedule, setCaregiversSchedule] = useState<CaregiverSchedule[]>(
    []
  );

  const getCaregiversSchedule = () => {
    fetch(`${BASE_URL}/api/caregiver/all_caregiverschedule`) // Adjust URL
      .then((response) => response.json())
      .then((data) => setCaregiversSchedule(data))
      .catch((error) =>
        console.error("Error fetching care givers schedule:", error)
      );
  };

  useEffect(() => {
    getCaregiversSchedule();
  }, []);

  const updateCaregiversSchedule = (updatedCaregiversSchedule: CaregiverSchedule) => {
    console.log("Previous careneeder schedule:", caregiversSchedule);
    setCaregiversSchedule((prevData) => {
      console.log(
        "Updating caregiver with new caregiverschedule:",
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
    <CaregiverScheduleContext.Provider
      value={{
        caregiversSchedule,
        setCaregiversSchedule,
        updateCaregiversSchedule,
        getCaregiversSchedule,
      }}
    >
      {children}
    </CaregiverScheduleContext.Provider>
  );
};

export const useCaregiverScheduleContext = () => {
  const context = useContext(CaregiverScheduleContext);
  if (!context) {
    throw new Error(
      "useCaregiverContext must be used within a CaregiverProvider"
    );
  }
  return context;
};

export default CaregiverScheduleProvider;
