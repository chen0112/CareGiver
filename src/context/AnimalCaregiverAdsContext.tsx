import React, { createContext, useState, useContext, useEffect } from "react";
import { AnimalCaregiverAds } from "../types/Types"; // Import your Ad type definition
import { BASE_URL } from "../types/Constant";

interface AnimalCaregiverAdsProviderProps {
  children: React.ReactNode;
}

export const AnimalCaregiverAdsContext = createContext<{
  animalcaregiverAds: AnimalCaregiverAds[];
  setanimalcaregiverAds: React.Dispatch<
    React.SetStateAction<AnimalCaregiverAds[]>
  >;
  updateanimalcaregiverAds: (newAd: AnimalCaregiverAds) => void;
  getanimalcaregiverAds: () => void;
}>({
  animalcaregiverAds: [],
  setanimalcaregiverAds: () => {},
  updateanimalcaregiverAds: () => {},
  getanimalcaregiverAds: () => {},
});

const AnimalCaregiverAdsProvider: React.FC<AnimalCaregiverAdsProviderProps> = ({
  children,
}) => {
  const [animalcaregiverAds, setanimalcaregiverAds] = useState<
    AnimalCaregiverAds[]
  >([]);

  const getanimalcaregiverAds = () => {
    fetch(`${BASE_URL}/api/animalcaregiver/all_animal_caregiver_ads`) // Adjust URL
      .then((response) => response.json())
      .then((data) => setanimalcaregiverAds(data))
      .catch((error) =>
        console.error("Error fetching AnimalCaregiver Ads:", error)
      );
  };

  useEffect(() => {
    getanimalcaregiverAds();
  }, []);

  const updateanimalcaregiverAds = (newAd: AnimalCaregiverAds) => {
    console.log("Previous animalcaregiver ads:", newAd);
    setanimalcaregiverAds((prevAds) => {
      return prevAds.map((ad) => (ad.id === newAd.id ? newAd : ad));
    });
  };

  return (
    <AnimalCaregiverAdsContext.Provider
      value={{
        animalcaregiverAds,
        setanimalcaregiverAds,
        updateanimalcaregiverAds,
        getanimalcaregiverAds,
      }}
    >
      {children}
    </AnimalCaregiverAdsContext.Provider>
  );
};

export const useAnimalCaregiverAdsContext = () => {
  const context = useContext(AnimalCaregiverAdsContext);
  if (!context) {
    throw new Error(
      "useAnimalCaregiverAdsContext must be used within a AnimalCaregiverAds provider"
    );
  }
  return context;
};

export default AnimalCaregiverAdsProvider;
