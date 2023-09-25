import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useCaregiverContext } from "../../context/CaregiverContext";
import { useCaregiverAdsContext } from "../../context/CaregiverAdsContext";
import { Link, useParams } from "react-router-dom";
import { BiHeart } from "react-icons/bi";

type Message = {
  sender: "user" | "caregiver";
  text: string;
};

const imageStyle: React.CSSProperties = {
  objectFit: "cover",
  height: "80%",
};

const ChatWindow: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { caregivers } = useCaregiverContext();
  const { caregiverAds } = useCaregiverAdsContext();

  const { id: idString } = useParams<{ id?: string }>(); // Note the "?" indicating it can be undefined

  // Guard against undefined and NaN
  const id = idString ? parseInt(idString, 10) : undefined;

  // Check that id is neither undefined nor NaN before performing the filter
  const caregiver =
    id !== undefined && !isNaN(id)
      ? caregivers.find((c) => c.id === id)
      : undefined;

  const associatedAds = caregiver
    ? caregiverAds?.find((ad) => ad.caregiver_id === caregiver.id)
    : null;

  const sendMessage = () => {
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
    // Add your backend logic here to send the message to the caregiver and receive a reply
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mx-9 py-3">
        <Link to="/" className="flex items-center text-black no-underline ml-0">
          <BiHeart size={30} className="text-red-500 heart-icon my-auto" />
          <h1 className="font-bold text-3xl ml-2 my-auto align-middle text-red-500">
            关爱网
          </h1>
        </Link>
      </div>

      <hr className="border-t border-black-300 mx-1 my-2" />
      {/* Caregiver Info */}
      <div className="flex items-center bg-gray-100 p-4">
        <Link
          to={`/caregivers/${caregiver?.id}`}
          className="no-underline w-full md:w-11/12 lg:w-3/4 bg-white shadow-lg rounded-lg overflow-hidden mb-1 flex flex-col md:flex-row h-62 transition-transform transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-2xl cursor-pointer hover:bg-gray-100 p-1"
        >
          {/* Image */}
          <div className="flex flex-row justify-center md:flex-shrink-0 items-center w-full md:w-1/3 p-2 md:p-1">
            <img
              src={caregiver?.imageurl}
              alt={caregiver?.name}
              style={imageStyle}
              className="rounded w-1/2 md:w-full"
            />
          </div>

          {/* Text */}
          <div className="flex-grow p-6 flex flex-col justify-between md:-ml-3">
            <div className="flex items-center">
              <h3 className="text-xl font-semibold text-blue-700 mr-3">
                {caregiver?.name}
              </h3>
              <FaMapMarkerAlt className="text-gray-600 mb-1" />
              <span className="text-gray-600 ml-2 mb-1">
                {caregiver?.location &&
                Array.isArray(caregiver.location) &&
                caregiver.location.length > 0
                  ? caregiver.location.map((loc) => loc.label).join(", ")
                  : "无"}
              </span>
              <span className="mb-1 ml-3 text-black">
                {caregiver?.hourlycharge
                  ? `¥ ${caregiver.hourlycharge}元/小时`
                  : "¥ 收费不详"}
              </span>
            </div>
            <div className="text-gray-600 mb-8 line-clamp">
              {associatedAds && (
                <div>
                  <p>{associatedAds.title}</p>
                  <p className="line-clamp-3">{associatedAds.description}</p>
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Chat */}
      <div className="flex-grow overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.sender === "user" ? "text-right" : "text-left"
            } my-2 mx-4`}
          >
            <div
              className={`inline-block p-2 rounded ${
                message.sender === "user"
                  ? "bg-blue-400 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex justify-between p-4 border-t border-gray-300">
        <input
          className="w-full rounded p-2 border border-gray-300"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="ml-2 bg-blue-500 text-white p-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
