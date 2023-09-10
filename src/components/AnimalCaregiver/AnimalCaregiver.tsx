import React, { useState } from "react";
import { BiHeart } from "react-icons/bi";
import { Link } from "react-router-dom";

const services = [
  "刷街",
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

  const [yearsOfExperience, setYearsOfExperience] = useState<string>("");

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

  const handleExperienceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setYearsOfExperience(event.target.value);
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
          照顾经验：
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-items-start mx-auto w-full md:w-1/2">
          <div className="col-span-full">
            <select
              value={yearsOfExperience}
              onChange={handleExperienceChange}
              className="block w-full bg-white text-gray-900 border rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="" disabled>
                选择工作年限
              </option>
              <option value="0-1">0-1 Years</option>
              <option value="1-3">1-3 Years</option>
              <option value="3-5">3-5 Years</option>
              <option value="5+">5+ Years</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalCaregiver;
