import React, { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { Link } from "react-router-dom";
import { BiHeart } from "react-icons/bi";
import { BASE_URL } from "../../types/Constant";
import getCroppedImg from "./CropperImg";
import Cropper from "react-easy-crop";
import { Slider, Button, Typography } from "antd";
import { Point, Area } from "react-easy-crop/types";
import Modal from "react-bootstrap/Modal";
import { v4 as uuidv4 } from "uuid";

interface RegisterProps {
  userType: "caregiver" | "careneeder" | "animalcaregiver" | "animalcareneeder"; // Define the valid user types here
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const initialFormData = {
  name: "",
  phone: "",
  passcode: "",
};

const API_URL_UPLOAD = `${BASE_URL}/api/upload`;

const Register: React.FC<RegisterProps> = ({ userType }) => {
  const [formData, setFormData] = useState(initialFormData);

  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("formData:", formData);
    console.log("imageurl:", imageurl);
    console.log("isSubmitting:", isSubmitting);

    if (isSubmitting) {
      console.log("Exiting handleSubmit due to isSubmitting");
      return;
    }

    const missingFields = [];

    // if (!imageurl) missingFields.push("照片");
    if (!formData.name || formData.name.length === 0)
      missingFields.push("名字");
    if (!formData.phone || formData.phone.length === 0)
      missingFields.push("电话");
    if (!imageurl) missingFields.push("照片");

    if (missingFields.length > 0) {
      setMissingFields(missingFields);
      setShowMissingFieldsModal(true);
      return;
    }
    // Hash the passcode
    const salt = await bcrypt.genSalt(10);
    const hashedPasscode = await bcrypt.hash(formData.passcode, salt);

    // Replace plain text passcode with hashed one
    const payload = {
      ...formData,
      imageurl,
      passcode: hashedPasscode, // this should overrides the passcode in initialform data, so no replacer fucntion in body
    };

    console.log("formDataJson:", payload);

    setIsSubmitting(true);
    setIsFormDisabled(true);
    setShowSuccessModal(true);

    try {
      const response = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();

        if (response.ok && data.success) {
          setSuccessMsg("创建账号成功!");
          resetForm();
          // Navigate immediately without delay
          if (userType === "caregiver") {
            navigate(
              `/careneeders/phone/${formData.phone}/userType/${userType}`
            );
          } else if (userType === "careneeder") {
            navigate(
              `/caregivers/phone/${formData.phone}/userType/${userType}`
            );
          } else if (userType === "animalcaregiver") {
            navigate(
              `/animalcareneeders/phone/${formData.phone}/userType/${userType}`
            );
          } else if (userType === "animalcareneeder") {
            navigate(
              `/animalcaregivers/phone/${formData.phone}/userType/${userType}`
            );
          }
        } else {
          setErrorMsg("注册失败: " + (data.error || "Unknown Error"));
        }
      } else {
        setErrorMsg("注册失败: Invalid response from server");
      }
    } catch (error: any) {
      setErrorMsg("注册失败: " + error.message);
    }
  };

  return (
    <div>
      <div className="flex items-center mx-9 py-3">
        <Link to="/" className="flex items-center text-black no-underline ml-0">
          <BiHeart size={30} className="text-red-500 heart-icon my-auto" />
          <h1 className="font-bold text-3xl ml-2 my-auto align-middle text-red-500">
            关爱网
          </h1>
        </Link>
      </div>

      <hr className="border-t border-black-300 mx-1 my-2" />

      {errorMsg && (
        <div className="text-red-500 text-center mb-4">{errorMsg}</div>
      )}
      {successMsg && (
        <div className="text-green-500 text-center mb-4">{successMsg}</div>
      )}
      <form
        onSubmit={handleRegisterSubmit}
        className="max-w-md mx-auto w-full md:w-1/2 lg:w-1/3"
      >
        {/* ... Other input fields for name, description, age, etc. ... */}
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
            // required={true}
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
            // required={true}
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col items-center justify-center bg-white shadow p-4 rounded-lg mb-4">
          <label className="mb-2 text-gray-700" htmlFor="passcode">
            密码:
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="请输入密码"
            title="请输入密码"
            required={true}
            type="password"
            id="passcode"
            name="passcode"
            value={formData.passcode}
            onChange={handleChange}
          />
        </div>

        <button
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          type="submit"
        >
          注册
        </button>
      </form>
    </div>
  );
};

export default Register;
