import React, { useState, useEffect } from "react";
import { BiHeart } from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";

const services = [
  "遛宠物/刷街",
  "喂养/投食",
  "白天照顾",
  "运输",
  "夜间照顾",
  "驯化",
  "美容",
];

const AnimalCaregiver: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);

  const [hourlyCharge, setHourlyCharge] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isFormValid, setIsFormValid] = useState<boolean | null>(null);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [isFormTouched, setIsFormTouched] = useState<boolean>(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const navigate = useNavigate();
  
  const location = useLocation();

  // Extract the animalcaregiverId from the query parameters
  const queryParams = new URLSearchParams(location.search);
  const animalcaregiverId = queryParams.get("animalcaregiverId");

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const toggleAnimal = (animal: string) => {
    setSelectedAnimals((prev) =>
      prev.includes(animal)
        ? prev.filter((a) => a !== animal)
        : [...prev, animal]
    );
  };

  const handleHourlyChargeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setHourlyCharge(event.target.value);
  };

  const validateForm = () => {
    let errors = [];
    if (selectedServices.length === 0) {
      errors.push("请至少提供一种服务.");
    }
    if (selectedAnimals.length === 0) {
      errors.push("请至少选择一种宠物.");
    }
    if (hourlyCharge === "") {
      errors.push("请选您的小时时薪.");
    }

    const isValid = errors.length === 0;
    setErrorMessage(errors.join(" "));
    setIsFormValid(isValid);
    return isValid;
  };

  useEffect(() => {
    validateForm();
    if (
      selectedServices.length > 0 ||
      selectedAnimals.length > 0 ||
      hourlyCharge !== ""
    ) {
      setIsFormTouched(true);
    }
  }, [selectedServices, selectedAnimals, hourlyCharge]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior

    setIsFormTouched(true);
    setIsFormSubmitted(true); // Set to true here

    if (isFormValid === false) {
      // explicitly check for false
      console.log("Form is invalid.");
      setErrorMessage("请填完所有信息.");
      return;
    }

    if (errorMessage) {
      console.log("Error message:", errorMessage); // Log only when there's an error message
    }

    setIsLoading(true);

    // Data to send to the server
    const payload = {
      animalcaregiverid: animalcaregiverId,
      selectedservices: selectedServices,
      selectedanimals: selectedAnimals,
      hourlycharge: hourlyCharge,
    };

    if (!animalcaregiverId) {
      console.error("Missing animalcaregiverId");
      return;
    }

    // Send a POST request to the Flask backend
    const response = await fetch(
      "https://nginx.yongxinguanai.com/api/animalcaregiver_details",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      // Handle success
      const data = await response.json();
      console.log("New_Animal_Caregiver_Details:------", data);
      
      const animalcaregiverid = data.animalcaregiverid;

      setTimeout(() => {
        navigate(
          `/signup_animalcaregiver/details/ads?animalcaregiverId=${animalcaregiverid}`
        );
      }, 1000);
    } else {
      // Handle error
      console.error("Failed to submit data");
    }
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

      <form onSubmit={handleSubmit}>
        <div className="text-center my-4">
          <h2 className="text-2xl font-bold" style={{ color: "#0ABAB5" }}>
            找到你最喜欢的宠物照顾工作
          </h2>
        </div>

        <div className="my-2">
          <h4
            className="col-span-full text-lg md:text-center ml-4 md:ml-0 mr-4 md:mr-0"
            style={{ color: "#0ABAB5" }}
          >
            请选择你能提供的服务:
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-items-start mx-auto md:mx-auto w-full md:w-1/2">
          {services.map((service, index) => (
            <label
              key={index}
              className={`flex items-center space-x-2 ml-3 md:ml-0 mr-4 md:mr-0 cursor-pointer transition ease-in-out duration-150 ${
                selectedServices.includes(service)
                  ? "bg-green-200 p-2 rounded"
                  : "hover:bg-gray-100 p-2 rounded"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedServices.includes(service)}
                onChange={() => toggleService(service)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
              <span className="text-lg">{service}</span>
            </label>
          ))}
        </div>

        <div className="my-2">
          <h4
            className="col-span-full text-lg md:text-center ml-4 md:ml-0 mr-4 md:mr-0"
            style={{ color: "#0ABAB5" }}
          >
            请选择你喜欢照顾的动物：
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-items-start mx-auto w-full md:w-1/2">
            {["宠物狗", "宠物猫", "宠物鸟", "宠物鱼", "宠物爬行动物"].map(
              (animalType, index) => (
                <label
                  key={index}
                  className={`flex items-center space-x-2 ml-3 md:ml-0 mr-4 md:mr-0 cursor-pointer transition ease-in-out duration-150 ${
                    selectedAnimals.includes(animalType)
                      ? "bg-green-200 p-2 rounded"
                      : "hover:bg-gray-100 p-2 rounded"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAnimals.includes(animalType)}
                    onChange={() => toggleAnimal(animalType)}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                  />
                  <span className="text-xl">{animalType}</span>
                </label>
              )
            )}
          </div>
        </div>

        <div className="my-2">
          <h4
            className="col-span-full text-lg md:text-center ml-4 md:ml-0 mr-4 md:mr-0"
            style={{ color: "#0ABAB5" }}
          >
            每小时收费：
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-items-stretch mx-auto w-full md:w-1/2">
            <div className="col-span-full">
              <select
                value={hourlyCharge}
                onChange={handleHourlyChargeChange}
                className="block w-full ml-4 sm:ml-0 bg-white text-gray-900 border rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="" disabled>
                  选择每小时收费
                </option>
                {/* Generate options dynamically for range 20-100 */}
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
          </div>
        </div>

        <hr className="mt-4 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-items-stretch mx-auto w-full md:w-1/2" />

        <div className="flex justify-center mt-6">
          <button
            disabled={!isFormValid || isLoading || !isFormTouched} // <-- Disable the button while loading
            type="submit"
            className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isLoading ? "提交中..." : "提交"}
          </button>
        </div>

        {isFormSubmitted && isFormValid === false && (
          <div className="text-red-500 mt-2">{errorMessage}</div>
        )}
      </form>
    </div>
  );
};

export default AnimalCaregiver;
