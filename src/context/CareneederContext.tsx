import React, { createContext, useState, useContext, useEffect } from "react";
import { Careneeder } from "../types/Types";

interface CareneederProviderProps {
  children: React.ReactNode;
}

export const CareneederContext = createContext<{
  careneeders: Careneeder[];
  setCareneeders: React.Dispatch<React.SetStateAction<Careneeder[]>>;
  updateCareneeders: (newCareNeeder: Careneeder) => void;
  getCareneeders: () => void;
}>({
  careneeders: [],
  setCareneeders: () => {},
  updateCareneeders: () => {},
  getCareneeders: () => {},
});

const CareneederProvider: React.FC<CareneederProviderProps> = ({
  children,
}) => {
  const [careneeders, setCareneeders] = useState<Careneeder[]>([]);

  const getCareneeders = () => {
    fetch("https://nginx.yongxinguanai.com/api/all_careneeders") // Adjust URL
      .then((response) => response.json())
      .then((data) => setCareneeders(data))
      .catch((error) => console.error("Error fetching care needers:", error));
  };

  useEffect(() => {
    getCareneeders();
  }, []);

  const updateCareneeders = (updatedCareneeders: Careneeder) => {
    console.log("Previous careneeder:", careneeders);
    setCareneeders((prevData) => {
      console.log("Updating caregivers with new caregiver:", updatedCareneeders);
      // Map through the previous caregivers and replace the one with the updated ID
      return prevData.map((Careneeder) =>
      Careneeder.id === updatedCareneeders.id ? updatedCareneeders : Careneeder
      );
    });
  };

  return (
    <CareneederContext.Provider
      value={{ careneeders, setCareneeders, updateCareneeders, getCareneeders }}
    >
      {children}
    </CareneederContext.Provider>
  );
};

export const useCareneederContext = () => {
  const context = useContext(CareneederContext);
  if (!context) {
    throw new Error(
      "useCareNeederContext must be used within a CareNeederProvider"
    );
  }
  return context;
};

export default CareneederProvider;
