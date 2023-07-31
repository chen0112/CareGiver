import React, { useState } from "react";
import { Caregiver } from "../../types/Types";
import "./CaregiverForm.css";
import { useNavigate } from "react-router-dom";

interface CaregiverFormProps {
  API_URL: string;
  API_URL_UPLOAD: string;
  updateCaregivers: (newCaregiver: Caregiver) => void;
  getCaregivers: () => void;
}

const initialFormData: Partial<Caregiver> = {
  name: "",
  description: "",
  age: null,
  education: "",
  gender: "",
  years_of_experience: null,
};

const CaregiverForm: React.FC<CaregiverFormProps> = ({
  API_URL,
  API_URL_UPLOAD,
  updateCaregivers,
  getCaregivers,
}) => {
  const [formData, setFormData] = useState<Partial<Caregiver>>(initialFormData);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageDataUrl(event.target?.result as string); // Use this to preview image

        // Now upload the image to the server
        const formData = new FormData();
        formData.append("file", file);
        fetch(API_URL_UPLOAD, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.text())
          .then((data) => {
            setImageUrl(data); // Set the S3 URL to state after it's uploaded
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setIsSubmitted(true);
    setIsSubmitting(false);
    setIsFormDisabled(false);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
    setFormData(initialFormData);
    setImageDataUrl(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("formData:", formData);
    console.log("imageUrl:", imageUrl);

    if (isSubmitting) {
      return;
    }

    if (!formData.name || !formData.description || !imageUrl) {
      alert("请输入必要信息！");
      return;
    }

    const formDataJson = JSON.stringify(
      { ...formData, imageUrl },
      (key, value) => {
        return value === undefined ? "undefined" : value;
      }
    );

    console.log(formData);

    setIsSubmitting(true);
    setIsFormDisabled(true);

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formDataJson,
    })
      .then((response) => response.json())
      .then((newCaregiver) => {
        console.log("NewCaregiver:------", newCaregiver);
        updateCaregivers(newCaregiver);
        getCaregivers();
        resetForm();
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((error) => console.error("Error adding caregiver:", error));
  };

  return (
    <form onSubmit={handleSubmit} className={isFormDisabled ? "disabled" : ""}>
      <div className="flex flex-col items-center justify-center bg-white shadow p-4 rounded-lg mb-4">
        <label className="mb-2 text-gray-700" htmlFor="image">Portrait:</label>
        <input
          className="border-2 border-gray-200 rounded-md p-2"
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imageDataUrl && (
          <img src={imageDataUrl} alt="Preview" className="image-preview mt-4 w-64" />
        )}
      </div>

      <div className="flex flex-col items-center justify-center bg-white shadow p-4 rounded-lg mb-4">
        <label className="mb-2 text-gray-700" htmlFor="name">Name:</label>
        <input
          className="border-2 border-gray-200 rounded-md p-2 w-full"
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col items-center justify-center bg-white shadow p-4 rounded-lg mb-4">
        <label className="mb-2 text-gray-700" htmlFor="description">Description:</label>
        <textarea
          className="border-2 border-gray-200 rounded-md p-2 w-full"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="education">Education:</label>
        <input
          type="text"
          id="education"
          name="education"
          value={formData.education}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="gender">Gender:</label>
        <input
          type="text"
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="years_of_experience">Years of Experience:</label>
        <input
          type="number"
          id="years_of_experience"
          name="years_of_experience"
          value={formData.years_of_experience || ""}
          onChange={handleChange}
        />
      </div>

      <button type="submit" disabled={isSubmitting || isFormDisabled}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
      {isSubmitted && (
        <div className="success-message">
          <p>Form submitted successfully!</p>
        </div>
      )}
    </form>
  );
};

export default CaregiverForm;
