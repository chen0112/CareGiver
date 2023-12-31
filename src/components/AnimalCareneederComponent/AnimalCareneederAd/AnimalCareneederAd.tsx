import React, { useState } from "react";
import { BiHeart } from "react-icons/bi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Modal from "react-bootstrap/Modal"; // Import the Modal component
import Button from "react-bootstrap/Button"; // Import the Button component
import { BASE_URL } from "../../../types/Constant";
import HeaderLogo from "../../HeaderLogoComponent/HeaderLogo";

const AnimalCareneederAds: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for the success modal
  const [titleError, setTitleError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const navigate = useNavigate();
  const userType = "animalcaregiver";

  const location = useLocation();

  // Extract the caregiverId from the query parameters
  const queryParams = new URLSearchParams(location.search);
  const animalcareneederid = queryParams.get("animalcareneederformId");
  const phoneNumber = queryParams.get("phone");

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const titleText = e.target.value;
    setTitle(titleText);

    // Check the Chinese word count in the title
    const chineseWordCount = (titleText.match(/[\u4e00-\u9fa5]|[\s\S]/g) || [])
      .length;

    if (chineseWordCount < 3) {
      setTitleError("请输入更多内容。");
    } else {
      setTitleError(""); // Clear the error message when requirements are met
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const descriptionText = e.target.value;
    setDescription(descriptionText);

    // Check the Chinese word count in the description
    const chineseWordCount = (
      descriptionText.match(/[\u4e00-\u9fa5]|[\s\S]/g) || []
    ).length;

    if (chineseWordCount < 10) {
      setDescriptionError("请输入更多内容。");
    } else {
      setDescriptionError(""); // Clear the error message when requirements are met
    }
  };

  const handlePostAd = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (titleError || descriptionError) {
      // If there are errors in either the title or description, don't submit the form
      return;
    }

    // Create an object with the data to send to the backend
    const requestData = {
      animalcareneederid: animalcareneederid,
      title: title,
      description: description,
    };

    // Replace with your actual API URL
    const API_URL = `${BASE_URL}/api/animalcareneeder/animalcareneeder_ads`;

    if (!animalcareneederid) {
      console.error("Missing animalcareneederid");
      return;
    }

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            // Handle 400
          } else if (response.status === 500) {
            // Handle 500
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
      })
      .then((data) => {
        // Handle success response here
        console.log("Success of adding animalcareneederads:", data);
        // Show the success modal
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate(
            `/animalcaregivers/phone/${phoneNumber}/userType/${userType}`
          );
        }, 2000);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
        // You can show an error message to the user
      });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <HeaderLogo />
      <hr className="border-t border-black-300 mx-1 my-2" />

      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4">
        发布广告
      </h1>

      <form onSubmit={handlePostAd}>
        <div className="container mx-auto px-4 py-6">
          <div className="mt-4">
            <label htmlFor="title" className="block font-semibold">
              标题:
            </label>
            <textarea
              id="title"
              className="w-full px-4 py-2 mt-2 border rounded-md"
              value={title}
              required={true} // Make the title input mandatory
              onChange={handleTitleChange}
              placeholder="请保持简介的标题，比如遛狗小时工."
            />
            {titleError && <p className="text-red-500">{titleError}</p>}
          </div>

          <div className="mt-4">
            <label htmlFor="description" className="block font-semibold">
              内容:
            </label>
            <textarea
              id="description"
              className="w-full px-4 py-2 mt-2 border rounded-md"
              value={description}
              required={true} // Make the description input mandatory
              rows={5}
              onChange={handleDescriptionChange}
              placeholder="请让您的广告尽量简洁，但包括一些重要信息， 比如：照顾内容，你的经验等等。这样能让雇主们很快了解您能提供的服务."
            />
            {descriptionError && (
              <p className="text-red-500">{descriptionError}</p>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit" // Specify the button type as "submit"
              className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              发布广告
            </button>
          </div>
        </div>
      </form>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>发布成功</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>广告发布成功！</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowSuccessModal(false)}>关闭</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AnimalCareneederAds;
