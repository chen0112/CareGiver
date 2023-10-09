import React, { createContext, useState, useContext, useEffect } from "react";
import { AnimalCareneederForm } from "../types/Types";
import { BASE_URL } from "../types/Constant";

interface CareneederProviderProps {
  children: React.ReactNode;
}

export const AnimalCareneederFormContext = createContext<{
  animalcareneedersForm: AnimalCareneederForm[];
  setanimalcareneedersForm: React.Dispatch<
    React.SetStateAction<AnimalCareneederForm[]>
  >;
  updateanimalcareneeders: (
    newAnimalCareneederForm: AnimalCareneederForm
  ) => void;
  getanimalcareneeders: () => void;
}>({
  animalcareneedersForm: [],
  setanimalcareneedersForm: () => {},
  updateanimalcareneeders: () => {},
  getanimalcareneeders: () => {},
});

const AnimalCareneederFormProvider: React.FC<CareneederProviderProps> = ({
  children,
}) => {
  const [animalcareneedersForm, setanimalcareneedersForm] = useState<
    AnimalCareneederForm[]
  >([]);

  const getanimalcareneeders = () => {
    fetch(`${BASE_URL}/api/all_animalcareneeders`)
      .then((response) => response.json())
      .then((data) => setanimalcareneedersForm(data))
      .catch((error) =>
        console.error("Error fetching animalcareneedersForm:", error)
      );
  };

  useEffect(() => {
    getanimalcareneeders();
  }, []); // Empty array indicates that this effect should only run once on mount, not on updates

  const updateanimalcareneeders = (
    updatedanimalcareneeders: AnimalCareneederForm
  ) => {
    console.log("Previous animalcareneedersForm:", animalcareneedersForm);
    setanimalcareneedersForm((prevData) => {
      console.log(
        "Updating animalcareneedersForm with new animalcareneederForm:",
        updatedanimalcareneeders
      );
      // Map through the previous careneeders and replace the one with the updated ID
      return prevData.map((animalcareneedersForm) =>
        animalcareneedersForm.id === updatedanimalcareneeders.id
          ? updatedanimalcareneeders
          : animalcareneedersForm
      );
    });
  };

  return (
    <AnimalCareneederFormContext.Provider
      value={{
        animalcareneedersForm,
        setanimalcareneedersForm,
        updateanimalcareneeders,
        getanimalcareneeders,
      }}
    >
      {children}
    </AnimalCareneederFormContext.Provider>
  );
};

export const useAnimalCareneederFormContext = () => {
  const context = useContext(AnimalCareneederFormContext);
  if (!context) {
    throw new Error(
      "useanimalCaregiverFormContext must be used within a animalCaregiverFormProvider"
    );
  }
  if (!Array.isArray(context.animalcareneedersForm)) {
    context.animalcareneedersForm = []; // Ensuring that caregivers is an array
  }
  console.log(
    "Current aniamlcaregiversForm state from animalCaregiverFormContext:",
    context.animalcareneedersForm
  );
  return context;
};

export default AnimalCareneederFormProvider;
