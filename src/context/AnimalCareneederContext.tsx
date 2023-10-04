import React, { createContext, useState, useContext, useEffect } from "react";
import { AnimalCareneeder } from "../types/Types";

interface CareneederProviderProps {
  children: React.ReactNode;
}

export const AnimalCareneederContext = createContext<{
  animalcareneeders: AnimalCareneeder[];
  setanimalcareneeders: React.Dispatch<
    React.SetStateAction<AnimalCareneeder[]>
  >;
  updateanimalcareneeders: (newAnimalCareneeder: AnimalCareneeder) => void;
  getanimalcareneeders: () => void;
}>({
  animalcareneeders: [],
  setanimalcareneeders: () => {},
  updateanimalcareneeders: () => {},
  getanimalcareneeders: () => {},
});

const AnimalCareneederProvider: React.FC<CareneederProviderProps> = ({
  children,
}) => {
  const [animalcareneeders, setanimalcareneeders] = useState<
    AnimalCareneeder[]
  >([]);

  const getanimalcareneeders = () => {
    fetch("https://nginx.yongxinguanai.com//api/all_animal_careneeders_details")
      .then((response) => response.json())
      .then((data) => setanimalcareneeders(data))
      .catch((error) =>
        console.error("Error fetching animalcareneeders:", error)
      );
  };

  useEffect(() => {
    getanimalcareneeders();
  }, []); // Empty array indicates that this effect should only run once on mount, not on updates

  const updateanimalcareneeders = (
    updatedanimalcareneeders: AnimalCareneeder
  ) => {
    console.log("Previous animalcareneeders:", animalcareneeders);
    setanimalcareneeders((prevData) => {
      console.log(
        "Updating animalcareneeders with new animalcareneeders:",
        updatedanimalcareneeders
      );
      // Map through the previous caregivers and replace the one with the updated ID
      return prevData.map((animalcareneeders) =>
        animalcareneeders.id === updatedanimalcareneeders.id
          ? updatedanimalcareneeders
          : animalcareneeders
      );
    });
  };

  return (
    <AnimalCareneederContext.Provider
      value={{
        animalcareneeders,
        setanimalcareneeders,
        updateanimalcareneeders,
        getanimalcareneeders,
      }}
    >
      {children}
    </AnimalCareneederContext.Provider>
  );
};

export const useAnimalCareneederContext = () => {
  const context = useContext(AnimalCareneederContext);
  if (!context) {
    throw new Error(
      "use animalneederContext must be used within a animalCareneederrProvider"
    );
  }
  if (!Array.isArray(context.animalcareneeders)) {
    context.animalcareneeders = []; // Ensuring that caregivers is an array
  }
  console.log(
    "Current aniamlcareneeders state from animalCareneederContext:",
    context.animalcareneeders
  );
  return context;
};

export default AnimalCareneederProvider;
