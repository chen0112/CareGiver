import dayjs from "dayjs";

// types.ts
export interface Caregiver {
  id: number;
  name: string;
  phone: string;
  location: Option[];
  imageurl?: string; // Change property name to "imageurl"
  years_of_experience?: number | null;
  age?: number | null;
  education?: string;
  gender?: string;
  hourlycharge: string;
  // Add other properties as needed
}

interface Option {
  label: string;
  value: string;
}

export interface Careneeder {
  id: number;
  name: string;
  phone: string;
  hourlycharge: string;
  imageurl?: string; // Change property name to "imageurl"
  location: Option[];
  live_in_care: boolean;
  live_out_care: boolean;
  domestic_work: boolean;
  meal_preparation: boolean;
  companionship: boolean;
  washing_dressing: boolean;
  nursing_health_care: boolean;
  mobility_support: boolean;
  transportation: boolean;
  errands_shopping: boolean;
}

// Interface for Client (Patient, Senior, Working Parent)
export interface Client {
  name: string;
  age: number;
  location: string;
  contactNumber: string;
  // Add other properties as needed
}

export interface Schedule {
  id: number;
  scheduletype: string;
  totalhours: string;
  frequency: string;
  startdate: dayjs.Dayjs;
  selectedtimeslots: string[];
  durationdays: string;
  careneeder_id: number;
}

///carenederAds
export interface Ads {
  id: number;
  title: string;
  description: string;
  careneeder_id: number;
}

export interface CaregiverAds {
  id: number;
  title: string;
  description: string;
  caregiver_id: number;
}

export interface AnimalCaregiverAds {
  id: number;
  title: string;
  description: string;
  animalcaregiverid: number;
}

export interface AnimalCaregiverForm {
  id: number;
  name: string;
  phone: string;
  location: Option[];
  imageurl?: string; 
  years_of_experience?: number | null;
  age?: number | null;
  education?: string;
  gender?: string;
  // Add other properties as needed
}

export interface AnimalCaregiver {
  id: number;
  animalcaregiverid: string | number; // Assuming the ID could be string or number
  selectedservices: string[];
  selectedanimals: string[];
  hourlycharge: string;
}


export interface AnimalCareneederForm {
  id: number;
  name: string;
  phone: string;
  location: Option[];
  imageurl?: string; // Change property name to "imageurl"
  years_of_experience?: number | null;
  age?: number | null;
  education?: string;
  gender?: string;
  // Add other properties as needed
}

export interface AnimalCareneeder {
  id: number;
  animalcareneederid: string | number; // Assuming the ID could be string or number
  selectedservices: string[];
  selectedanimals: string[];
  hourlycharge: string;
}

export interface AnimalCareneederAds {
  id: number;
  title: string;
  description: string;
  animalcareneederid: number;
}
