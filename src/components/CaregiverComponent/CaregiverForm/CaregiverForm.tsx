import React, { useState, useCallback, useRef } from "react";
import { Caregiver } from "../../../types/Types";
import "./CaregiverForm.css";
import { useNavigate, Link, useParams } from "react-router-dom";
import { BiHeart } from "react-icons/bi";
import getCroppedImg from "./CropperImg";
import Cropper from "react-easy-crop";
import { Slider, Button, Typography } from "antd";
import { Point } from "react-easy-crop/types";
import Modal from "react-bootstrap/Modal";
import { v4 as uuidv4 } from "uuid";
import { MultiSelect } from "react-multi-select-component";
import { LOCATION_OPTIONS } from "../../../types/Constant";

interface CaregiverFormProps {
  API_URL: string;
  API_URL_UPLOAD: string;
  updateCaregivers: (newCaregiver: Caregiver) => void;
  getCaregivers: () => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Option {
  label: string;
  value: string;
}

const locationOptions = LOCATION_OPTIONS;

const CaregiverForm: React.FC<CaregiverFormProps> = ({
  API_URL,
  API_URL_UPLOAD,
  updateCaregivers,
  getCaregivers,
}) => {
  const { phone } = useParams<{ phone: string }>();
  const initialFormData: Partial<Caregiver> = {
    name: "",
    phone: phone,
    location: [],
    age: null,
    education: "",
    gender: "",
    years_of_experience: null,
    hourlycharge: "",
  };
  const [formData, setFormData] = useState<Partial<Caregiver>>(initialFormData);

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null); // Define a specific type if you know the shape of the object
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [imageurl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: CropArea) => {
    console.log("onCropComplete called with:", croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const MIN_WIDTH = 1000; // Replace with your minimum width
  const MIN_HEIGHT = 1000; // Replace with your minimum height

  const [showSizeErrorModal, setShowSizeErrorModal] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const image = new Image();
      image.onload = function () {
        const imgElement = this as HTMLImageElement; // Correcting the type here

        if (imgElement.width < MIN_WIDTH || imgElement.height < MIN_HEIGHT) {
          console.log(
            `Image dimensions should be at least ${MIN_WIDTH}x${MIN_HEIGHT}`
          );
          // Show some message to the user that their image is too small
          setShowSizeErrorModal(true);
          return;
        }

        // Continue with setting the image data URL
        const dataURL = e.target?.result;
        if (typeof dataURL === "string") {
          setImageDataUrl(dataURL);
          setShowSizeErrorModal(false);
        }
      };
      image.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = async () => {
    if (!imageDataUrl) {
      console.error("No image data URL to crop");
      return;
    }
    // Perform cropping based on the current image, crop, and zoom states.
    const croppedImageBlob = await getCroppedImg(
      imageDataUrl,
      croppedAreaPixels
    );

    if (croppedImageBlob) {
      // Preview the cropped image.
      const objectUrl = URL.createObjectURL(croppedImageBlob);

      // Use the objectUrl here
      if (!objectUrl) {
        console.error("Failed to crop image");
        return;
      }

      setCroppedImage(objectUrl);

      setShowModal(true);

      setPreviewImage(croppedImage);

      // Now upload the image to the server.
      const filename = `croppedImage_${uuidv4()}.jpg`;
      const formData = new FormData();
      formData.append("file", croppedImageBlob, filename);
      fetch(API_URL_UPLOAD, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setImageUrl(data.url); // Set the S3 URL to state after it's uploaded.
        })
        .catch((error) => {
          console.error("Error:", error);
        });
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const { name, value, type } = target;

    // Check for maximum length of 'name'
    if (name === "name") {
      if (value.length > 10) {
        alert("请确保名字在5个字内");
        e.target.value = value.substring(0, 10);
        return;
      }
    }

    // New check for years_of_experience
    if (name === "years_of_experience") {
      const numValue = parseInt(value);
      if (numValue <= 0) {
        alert("工作经验必须大于 0");
        return;
      }
    }

    // New check for years_of_experience
    if (name === "age") {
      const numValue = parseInt(value);
      if (numValue <= 0) {
        alert("年龄必须大于 18");
        return;
      }
    }

    if (type === "select-multiple") {
      const select = target as HTMLSelectElement;
      const values = Array.from(select.selectedOptions).map(
        (option) => option.value
      );
      setFormData((prevData) => ({
        ...prevData,
        [name]: values.length > 0 ? values : [],
      }));
    } else {
      const inputValue =
        type === "checkbox" ? (target as HTMLInputElement).checked : value;
      setFormData((prevData) => ({
        ...prevData,
        [name]: inputValue !== undefined ? inputValue : "",
      }));
    }
  };

  const handleMultiSelectChange = (selectedOptions: Option[] | null) => {
    if (selectedOptions && selectedOptions.length <= 2) {
      setFormData((prevData) => ({
        ...prevData,
        location: selectedOptions,
      }));
    } else {
      // Display a notification to the user about the selection limit
      alert("请最多选择两个地点");
    }
  };

  const handleCancelCrop = () => {
    setImageDataUrl(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setImageDataUrl(null);
  };

  const [showMissingFieldsModal, setShowMissingFieldsModal] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("formData:", formData);
    console.log("imageurl:", imageurl);
    console.log("isSubmitting:", isSubmitting); // Debugging log

    if (isSubmitting) {
      console.log("Exiting handleSubmit due to isSubmitting");
      return;
    }

    const missingFields = [];
    if (!formData.name || formData.name.length === 0)
      missingFields.push("名字");
    if (!formData.phone || formData.phone.length === 0)
      missingFields.push("电话");
    if (!imageurl) missingFields.push("照片");
    if (!formData.location || formData.location.length === 0)
      missingFields.push("地址");

    if (missingFields.length > 0) {
      setMissingFields(missingFields);
      setShowMissingFieldsModal(true);
      return;
    }

    const formDataJson = JSON.stringify(
      { ...formData, imageurl },
      (key, value) => {
        return value === undefined ? "undefined" : value;
      }
    );

    console.log(formData);

    setIsSubmitting(true);
    setIsFormDisabled(true);
    setShowSuccessModal(true);

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

        // After successfully creating the careneeder, navigate to the schedule page
        // by extracting the careneeder's ID from the response and including it in the URL
        const caregiverId = newCaregiver.id;

        resetForm();
        setTimeout(() => {
          navigate(
            `/signup_caregiver/ads?caregiverId=${caregiverId}&phone=${formData.phone}`
          );
        }, 2000);
      })
      .catch((error) => console.error("Error adding caregiver:", error));
  };

  return (
    <div>
      <div className="flex items-center mx-9 py-3">
        <Link
          to="/"
          className="flex items-center text-black no-underline ml-0" // Remove 'mx-8 py-3' and add 'ml-0' to push it to the far left
        >
          <BiHeart size={30} className="text-red-500 heart-icon my-auto" />
          <h1 className="font-bold text-3xl ml-2 my-auto align-middle text-red-500">
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
              照片（必选）：
            </label>
            <div className="border-2 border-gray-200 rounded-md p-2 cursor-pointer bg-blue-500 text-white">
              <label htmlFor="image">上传照片</label>
            </div>
          </div>
          <input
            ref={imageInputRef}
            className="hidden"
            type="file"
            // required={true}
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />

          {imageDataUrl && (
            <div className="flex flex-col items-center w-full">
              <div
                className="relative w-full max-w-screen-md"
                style={{ paddingBottom: "75%" }}
              >
                <div className="absolute top-0 left-0 w-full h-full">
                  <Cropper
                    image={imageDataUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={1 / 1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    objectFit="cover"
                  />
                </div>
              </div>

              <div className="mb-4">
                <Typography.Text
                  style={{
                    display: "block",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  放大
                </Typography.Text>

                <Slider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(value) => {
                    console.log("Zoom value:", value);
                    setZoom(value);
                  }}
                />
                <Button
                  onClick={handleButtonClick}
                  type="primary"
                  className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                >
                  提交图片
                </Button>

                <Button
                  onClick={handleCancelCrop}
                  type="default"
                  className="mt-4 ml-2 bg-red-500 text-white hover:bg-red-600"
                >
                  取消截图
                </Button>
              </div>
              <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>截图</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {croppedImage && <img src={croppedImage} alt="Cropped" />}
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={handleClose}>关闭</Button>
                </Modal.Footer>
              </Modal>
            </div>
          )}

          <Modal
            show={showSizeErrorModal}
            onHide={() => setShowSizeErrorModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>图片大小错误</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>上传的图片不符合最低大小要求，请上传更大的图片。</p>
              <p>图片大小至少在 {`${MIN_WIDTH}x${MIN_HEIGHT}`} 像素</p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setShowSizeErrorModal(false)}>关闭</Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={showMissingFieldsModal}
            onHide={() => setShowMissingFieldsModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>缺少信息</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>以下信息缺失:</p>
              <ul>
                {missingFields.map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setShowMissingFieldsModal(false)}>
                关闭
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Display the previewImage here */}
          {croppedImage && (
            <div className="mt-4">
              <img
                src={croppedImage}
                alt="Preview"
                className="w-full h-[200px] object-cover"
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
            placeholder="名字 （必填）"
            required={true}
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col items-center justify-center bg-white shadow p-4 rounded-lg mb-4">
          <label className="mb-2 text-gray-700" htmlFor="phone">
            电话 (请与注册电话一致):
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="联系方式 （必填）"
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
          <label className="mb-2 text-gray-700" htmlFor="location">
            地点 (必选，可多选):
          </label>
          <MultiSelect
            className="wide-dropdown"
            options={locationOptions}
            value={formData.location ?? []}
            onChange={handleMultiSelectChange}
            labelledBy="Select"
            hasSelectAll={false}
            overrideStrings={{
              selectSomeItems: "请选择", // This changes "Select" text
              search: "搜索", // This changes "Search" text
            }}
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
          <select
            className="border border-gray-300 rounded-md p-2 w-full"
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
          >
            <option value="" disabled className="text-gray-400">
              选择教育程度
            </option>
            <option value="本科">本科</option>
            <option value="专科">专科</option>
            <option value="职高">职高</option>
            <option value="高中">高中</option>
            <option value="初中">初中</option>
            <option value="小学">小学</option>
          </select>
        </div>

        <div className="flex flex-col items-center justify-center bg-white shadow p-4 rounded-lg mb-4">
          <label className="mb-2 text-gray-700" htmlFor="gender">
            性别:
          </label>
          <select
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="男性/女性"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="" disabled className="text-gray-400">
              选择性别
            </option>
            <option value="男性">男性</option>
            <option value="女性">女性</option>
          </select>
        </div>

        <div className="flex flex-col items-center justify-center bg-white shadow p-4 rounded-lg mb-4">
          <label className="mb-2 text-gray-700" htmlFor="years_of_experience">
            工作经验:
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-full"
            title="请输入工作经验"
            placeholder="请只输入数字年限"
            autoComplete="off"
            type="number"
            id="years_of_experience"
            name="years_of_experience"
            value={formData.years_of_experience || ""}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col items-center justify-center bg-white shadow p-4 rounded-lg mb-4">
          <label className="mb-2 text-gray-700" htmlFor="hourlyCharge">
            每小时收费：
          </label>
          <select
            id="hourlycharge"
            name="hourlycharge"
            value={formData.hourlycharge || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            <option value="" disabled>
              选择每小时收费
            </option>
            {[...Array(81)].map((_, i) => {
              const charge = i + 20; // Start from 20
              return (
                <option key={charge} value={charge}>
                  {`${charge} 元`}
                </option>
              );
            })}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isFormDisabled}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          {isSubmitting ? "下一步..." : "下一步"}
        </button>
        <Modal
          show={showSuccessModal}
          onHide={() => setShowSuccessModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>提交成功</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>表单提交成功！</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setShowSuccessModal(false)}>关闭</Button>
          </Modal.Footer>
        </Modal>
      </form>
    </div>
  );
};

export default CaregiverForm;
