import React, { createContext, useState, useContext, useEffect } from "react";
import { Ads } from "../types/Types"; // Import your Ad type definition
import { BASE_URL } from "../types/Constant";

interface CareneederAdsProviderProps {
  children: React.ReactNode;
}

export const CareneederAdsContext = createContext<{
  careneederAds: Ads[];
  setCareneederAds: React.Dispatch<React.SetStateAction<Ads[]>>;
  updateCareneederAds: (newAd: Ads) => void;
  getCareneederAds: () => void;
}>({
  careneederAds: [],
  setCareneederAds: () => {},
  updateCareneederAds: () => {},
  getCareneederAds: () => {},
});

const CareneederAdsProvider: React.FC<CareneederAdsProviderProps> = ({
  children,
}) => {
  const [careneederAds, setCareneederAds] = useState<Ads[]>([]);

  const getCareneederAds = () => {
    fetch(`${BASE_URL}/api/careneeder/all_careneederads`) // Adjust URL
      .then((response) => response.json())
      .then((data) => setCareneederAds(data))
      .catch((error) => console.error("Error fetching careneeder ads:", error));
  };

  useEffect(() => {
    getCareneederAds();
  }, []);

  const updateCareneederAds = (newAd: Ads) => {
    console.log("Previous careneeder ads:", newAd);
    setCareneederAds((prevAds) => {
      return prevAds.map((ad) => (ad.id === newAd.id ? newAd : ad));
    });
  };

  return (
    <CareneederAdsContext.Provider
      value={{
        careneederAds,
        setCareneederAds,
        updateCareneederAds,
        getCareneederAds,
      }}
    >
      {children}
    </CareneederAdsContext.Provider>
  );
};

export const useCareneederAdsContext = () => {
  const context = useContext(CareneederAdsContext);
  if (!context) {
    throw new Error(
      "useCareneederAdsContext must be used within a CareneederAdsProvider"
    );
  }
  return context;
};

export default CareneederAdsProvider;
