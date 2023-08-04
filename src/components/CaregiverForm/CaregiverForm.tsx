import React, { useState, useCallback } from "react";
import { Caregiver } from "../../types/Types";
import "./CaregiverForm.css";
import { useNavigate, Link } from "react-router-dom";
import { BiHeart } from "react-icons/bi";
import Cropper from 'react-easy-crop';

interface CaregiverFormProps {
  API_URL: string;
  API_URL_UPLOAD: string;
  updateCaregivers: (newCaregiver: Caregiver) => void;
  getCaregivers: () => void;
}

const initialFormData: Partial<Caregiver> = {
  name: "",
  phone: "",
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

    if (
      !formData.name ||
      !formData.description ||
      !imageUrl ||
      !formData.phone
    ) {
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
    <div>
      <div className="flex items-center mx-9 py-3">
        <Link
          to="/"
          className="flex items-center mx-8 py-3 text-black no-underline"
        >
          <BiHeart size={30} className="text-red-500 heart-icon my-auto" />
          <h1 className="font-bold text-4xl ml-2 my-auto align-middle text-red-500">
            关爱网
          </h1>
        </Link>
      </div>

      <hr className="border-t border-black-300 mx-1 my-2" />

      <header className="flex items-center justify-center text-2xl font-bold text-gray-700 mb-4">
        发布工作
      </header>
      <form
        onSubmit={handleSubmit}
        className={`max-w-lg mx-auto ${isFormDisabled ? "disabled" : ""}`}
      >
        <div className="flex flex-col items-center justify-center bg-white shadow p-2 rounded-lg mb-2">
          <div className="flex items-center mb-2">
            <label className="text-gray-700 mr-2" htmlFor="image">
              照片：
            </label>
            <div className="border-2 border-gray-200 rounded-md p-2 cursor-pointer bg-blue-500 text-white">
              <label htmlFor="image">上传照片</label>
            </div>
          </div>
          <input
            className="hidden"
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imageDataUrl && (
            <div className="w-64 h-auto">
              <img
                src={imageDataUrl}
                alt="Preview"
                className="w-full object-contain"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center bg-white shadow p-4 rounded-lg mb-4">
          <label className="mb-2 text-gray-700" htmlFor="name">
            名字:
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-full"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col items-center justify-center bg-white shadow p-4 rounded-lg mb-4">
          <label className="mb-2 text-gray-700" htmlFor="phone">
            电话:
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="联系方式"
            title="请输入联系方式"
            required={true}
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col items-center justify-center bg-white shadow p-4 rounded-lg mb-4">
          <label className="mb-2 text-gray-700" htmlFor="description">
            服务内容:
          </label>
          <textarea
            className="border border-gray-300 rounded-md p-2 w-full"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col items-center justify-center bg-white shadow p-4 rounded-lg mb-4">
          <label className="mb-2 text-gray-700" htmlFor="age">
            年龄:
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-full"
            type="number"
            id="age"
            name="age"
            value={formData.age || ""}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col items-center justify-center bg-white shadow p-4 rounded-lg mb-4">
          <label className="mb-2 text-gray-700" htmlFor="education">
            教育程度:
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-full"
            type="text"
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col items-center justify-center bg-white shadow p-4 rounded-lg mb-4">
          <label className="mb-2 text-gray-700" htmlFor="gender">
            性别:
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="男性/女性"
            maxLength={6}
            title="请输入性别"
            autoComplete="off"
            type="text"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col items-center justify-center bg-white shadow p-4 rounded-lg mb-4">
          <label className="mb-2 text-gray-700" htmlFor="years_of_experience">
            工作经验:
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-full"
            title="请输入工作经验"
            autoComplete="off"
            type="number"
            id="years_of_experience"
            name="years_of_experience"
            value={formData.years_of_experience || ""}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || isFormDisabled}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          {isSubmitting ? "提交中..." : "提交"}
        </button>
        {isSubmitted && (
          <div className="text-center mt-4 text-green-500">
            <p>表单提交成功！</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CaregiverForm;
