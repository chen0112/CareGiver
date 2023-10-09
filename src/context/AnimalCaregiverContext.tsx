import React, { createContext, useState, useContext, useEffect } from "react";
import { AnimalCaregiver } from "../types/Types";
import { BASE_URL } from "../types/Constant";

interface CaregiverProviderProps {
  children: React.ReactNode;
}

export const AnimalCaregiverContext = createContext<{
  animalcaregivers: AnimalCaregiver[];
  setanimalcaregivers: React.Dispatch<React.SetStateAction<AnimalCaregiver[]>>;
  updateanimalcaregivers: (newCaregiver: AnimalCaregiver) => void;
  getanimalcaregivers: () => void;
}>({
  animalcaregivers: [],
  setanimalcaregivers: () => {},
  updateanimalcaregivers: () => {},
  getanimalcaregivers: () => {},
});

const AnimalCaregiverProvider: React.FC<CaregiverProviderProps> = ({
  children,
}) => {
  const [animalcaregivers, setanimalcaregivers] = useState<AnimalCaregiver[]>(
    []
  );

  const getanimalcaregivers = () => {
    fetch(`${BASE_URL}//api/all_animal_caregivers_details`)
      .then((response) => response.json())
      .then((data) => setanimalcaregivers(data))
      .catch((error) =>
        console.error("Error fetching animalcaregivers:", error)
      );
  };

  useEffect(() => {
    getanimalcaregivers();
  }, []); // Empty array indicates that this effect should only run once on mount, not on updates

  const updateanimalcaregivers = (updatedanimalcaregivers: AnimalCaregiver) => {
    console.log("Previous animalcaregivers:", animalcaregivers);
    setanimalcaregivers((prevData) => {
      console.log(
        "Updating animalcaregivers with new animalcaregiver:",
        updatedanimalcaregivers
      );
      // Map through the previous caregivers and replace the one with the updated ID
      return prevData.map((animalcaregivers) =>
        animalcaregivers.id === updatedanimalcaregivers.id
          ? updatedanimalcaregivers
          : animalcaregivers
      );
    });
  };

  return (
    <AnimalCaregiverContext.Provider
      value={{
        animalcaregivers,
        setanimalcaregivers,
        updateanimalcaregivers,
        getanimalcaregivers,
      }}
    >
      {children}
    </AnimalCaregiverContext.Provider>
  );
};

export const useAnimalCaregiverContext = () => {
  const context = useContext(AnimalCaregiverContext);
  if (!context) {
    throw new Error(
      "use animalCaregiverContext must be used within a animalCaregiverProvider"
    );
  }
  if (!Array.isArray(context.animalcaregivers)) {
    context.animalcaregivers = []; // Ensuring that caregivers is an array
  }
  console.log(
    "Current aniamlcaregivers state from animalCaregiverContext:",
    context.animalcaregivers
  );
  return context;
};

export default AnimalCaregiverProvider;
