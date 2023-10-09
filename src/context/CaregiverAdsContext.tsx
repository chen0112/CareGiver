import React, { createContext, useState, useContext, useEffect } from "react";
import { CaregiverAds } from "../types/Types"; // Import your CaregiverAds type definition
import { BASE_URL } from "../types/Constant";

interface CaregiverAdsProviderProps {
  children: React.ReactNode;
}

export const CaregiverAdsContext = createContext<{
  caregiverAds: CaregiverAds[];
  setCaregiverAds: React.Dispatch<React.SetStateAction<CaregiverAds[]>>;
  updateCaregiverAds: (newAd: CaregiverAds) => void;
  getCaregiverAds: () => void;
}>({
  caregiverAds: [],
  setCaregiverAds: () => {},
  updateCaregiverAds: () => {},
  getCaregiverAds: () => {},
});

const CaregiverAdsProvider: React.FC<CaregiverAdsProviderProps> = ({
  children,
}) => {
  const [caregiverAds, setCaregiverAds] = useState<CaregiverAds[]>([]);

  const getCaregiverAds = () => {
    fetch(`${BASE_URL}/api/all_caregiverads`) // Temporary URL
      .then((response) => response.json())
      .then((data) => setCaregiverAds(data))
      .catch((error) => console.error("Error fetching caregiver ads:", error));
  };

  useEffect(() => {
    getCaregiverAds();
  }, []);

  const updateCaregiverAds = (newAd: CaregiverAds) => {
    setCaregiverAds((prevAds) => {
      return prevAds.map((ad) => (ad.id === newAd.id ? newAd : ad));
    });
  };

  return (
    <CaregiverAdsContext.Provider
      value={{
        caregiverAds,
        setCaregiverAds,
        updateCaregiverAds,
        getCaregiverAds,
      }}
    >
      {children}
    </CaregiverAdsContext.Provider>
  );
};

export const useCaregiverAdsContext = () => {
  const context = useContext(CaregiverAdsContext);
  if (!context) {
    throw new Error(
      "useCaregiverAdsContext must be used within a CaregiverAdsProvider"
    );
  }
  return context;
};

export default CaregiverAdsProvider;
