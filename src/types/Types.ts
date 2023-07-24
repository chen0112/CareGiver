// types.ts
export interface Caregiver {
  id: number,
  name: string;
  description: string;
  imageUrl: string;
  yearsOfExperience: number;
  age: number;
  education: string;
  gender: string;
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
  imageUrl: string;
  yearsOfExperience: number;
  age: number;
  education: string;
  gender: string;
  // Add other properties as needed
}
