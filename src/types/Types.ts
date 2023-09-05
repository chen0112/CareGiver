import dayjs from "dayjs";

// types.ts
export interface Caregiver {
  id: number;
  name: string;
  phone: string;
  description: string;
  location: Option[];
  imageurl?: string; // Change property name to "imageurl"
  years_of_experience?: number | null;
  age?: number | null;
  education?: string;
  gender?: string;
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

// Interface for the Form Data submitted by caregivers
export interface CaregiverFormData {
  name: string;
  description: string;
  imageurl: string;
  years_of_experience: number;
  age: number;
  education: string;
  gender: string;
  // Add other properties as needed
}

export interface Schedule {
  id: number
  scheduletype: string;
  totalhours: string;
  frequency: string;
  startdate: dayjs.Dayjs;
  selectedtimeslots: string[];
  durationdays: string;
  careneeder_id: number;
}

export interface Ads {
  id: number
  title: string;
  description: string;
  careneeder_id: number;
}
