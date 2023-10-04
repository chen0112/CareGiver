import React, { createContext, useState, useContext, useEffect } from "react";
import { AnimalCareneederAds } from "../types/Types"; // Import your Ad type definition

interface AnimalCareneederAdsProviderProps {
  children: React.ReactNode;
}

export const AnimalCareneederAdsContext = createContext<{
  animalcareneederAds: AnimalCareneederAds[];
  setanimalcareneederAds: React.Dispatch<
    React.SetStateAction<AnimalCareneederAds[]>
  >;
  updateanimalcareneederAds: (newAd: AnimalCareneederAds) => void;
  getanimalcareneederAds: () => void;
}>({
  animalcareneederAds: [],
  setanimalcareneederAds: () => {},
  updateanimalcareneederAds: () => {},
  getanimalcareneederAds: () => {},
});

const AnimalCareneederAdsProvider: React.FC<
  AnimalCareneederAdsProviderProps
> = ({ children }) => {
  const [animalcareneederAds, setanimalcareneederAds] = useState<
    AnimalCareneederAds[]
  >([]);

  const getanimalcareneederAds = () => {
    fetch("https://nginx.yongxinguanai.com/api/all_animal_careneeder_ads") // Adjust URL
      .then((response) => response.json())
      .then((data) => setanimalcareneederAds(data))
      .catch((error) =>
        console.error("Error fetching AnimalCareneeder Ads:", error)
      );
  };

  useEffect(() => {
    getanimalcareneederAds();
  }, []);

  const updateanimalcareneederAds = (newAd: AnimalCareneederAds) => {
    console.log("Previous animalcareneeder ads:", newAd);
    setanimalcareneederAds((prevAds) => {
      return prevAds.map((ad) => (ad.id === newAd.id ? newAd : ad));
    });
  };

  return (
    <AnimalCareneederAdsContext.Provider
      value={{
        animalcareneederAds,
        setanimalcareneederAds,
        updateanimalcareneederAds,
        getanimalcareneederAds,
      }}
    >
      {children}
    </AnimalCareneederAdsContext.Provider>
  );
};

export const useAnimalCareneederAdsContext = () => {
  const context = useContext(AnimalCareneederAdsContext);
  if (!context) {
    throw new Error(
      "useAnimalCaregiverAdsContext must be used within a AnimalCaregiverAds provider"
    );
  }
  return context;
};

export default AnimalCareneederAdsProvider;
