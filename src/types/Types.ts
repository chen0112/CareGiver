// types.ts
export interface Caregiver {
  id: number;
  name: string;
  phone: string;
  description: string;
  imageurl?: string; // Change property name to "imageurl"
  years_of_experience?: number | null;
  age?: number | null;
  education?: string;
  gender?: string;
  // Add other properties as needed
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
