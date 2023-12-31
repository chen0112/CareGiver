import React, { useState, useEffect, useRef } from "react";
import Ably from "ably";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useAnimalCaregiverContext } from "../../../context/AnimalCaregiverContext";
import { useAnimalCaregiverAdsContext } from "../../../context/AnimalCaregiverAdsContext";
import { useAnimalCaregiverFormContext } from "../../../context/AnimalCaregiverFormContext";
import { useLocation } from "react-router-dom";
import { BiSend } from "react-icons/bi";
import { BASE_URL } from "../../../types/Constant";
import { useAnimalCareneederContext } from "../../../context/AnimalCareneederContext";
import { useAnimalCareneederAdsContext } from "../../../context/AnimalCareneederAdsContext";
import { useAnimalCareneederFormContext } from "../../../context/AnimalCareneederFormContext";
import {
  AnimalCaregiverForm,
  AnimalCaregiver,
  AnimalCaregiverAds,
  AnimalCareneederForm,
  AnimalCareneeder,
  AnimalCareneederAds,
} from "../../../types/Types";
import { defaultImageUrl } from "../../../types/Constant";
import HeaderLogo from "../../HeaderLogoComponent/HeaderLogo";
import { useAbly } from "../../../context/AblyContext";

type Message = {
  id?: string;
  sender_id: string;
  content: string;
  recipient_id: string | null;
  createtime?: string | null;
  ad_id?: number;
  ad_type?: string;
};

const imageStyle: React.CSSProperties = {
  objectFit: "cover",
  height: "80%",
};

const formatTimestamp = (timestamp: string) => {
  if (!timestamp) return ""; // Return an empty string if no timestamp is provided

  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds()
  ).padStart(2, "0")}`;
};

const ChatWindow: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { animalcaregivers } = useAnimalCaregiverContext();
  const { animalcaregiverAds } = useAnimalCaregiverAdsContext();
  const { animalcaregiversForm } = useAnimalCaregiverFormContext();

  const { animalcareneeders } = useAnimalCareneederContext();
  const { animalcareneederAds } = useAnimalCareneederAdsContext();
  const { animalcareneedersForm } = useAnimalCareneederFormContext();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idString = queryParams.get("id");
  const phoneNumber_sender = queryParams.get("phoneNumber_sender");
  const phoneNumber_recipient = queryParams.get("phoneNumber_recipient");
  // Guard against undefined and NaN
  const id = idString ? parseInt(idString, 10) : null;

  const adType = queryParams.get("adType");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  let individual: AnimalCaregiverForm | AnimalCareneederForm | undefined;
  let associatedAds:
    | AnimalCaregiverAds
    | AnimalCareneederAds
    | null
    | undefined = undefined;
  let associatedAnimals: AnimalCaregiver | AnimalCareneeder | null | undefined;

  console.log("adType:", adType);
  console.log("idddddd:", id);

  if (adType === "animalcaregivers") {
    individual =
      id !== null && !isNaN(id)
        ? animalcaregiversForm.find((c) => c.id === id)
        : undefined;

    console.log("Fetched animalcaregivers individual:", individual);

    associatedAds = individual
      ? animalcaregiverAds?.find(
          (ad) => ad.animalcaregiverid === individual!.id
        )
      : null;
    console.log("Fetched animalassociatedAds for caregivers:", associatedAds);

    associatedAnimals = individual
      ? animalcaregivers?.find((ad) => ad.animalcaregiverid === individual!.id)
      : null;
    console.log(
      "Fetched animal associatedAds for caregivers:",
      associatedAnimals
    );
  } else if (adType === "animalcareneeders") {
    individual =
      id !== null && !isNaN(id)
        ? animalcareneedersForm.find((c) => c.id === id)
        : undefined;
    console.log("Fetched animalcareneeders individual:", individual);

    associatedAds = individual
      ? animalcareneederAds?.find(
          (ad) => ad.animalcareneederid === individual!.id
        )
      : null;
    console.log("Fetched associatedAds for animalcareneeders:", associatedAds);

    associatedAnimals = individual
      ? animalcareneeders?.find(
          (ad) => ad.animalcareneederid === individual!.id
        )
      : null;
    console.log(
      "Fetched associatedAds for animalcareneeders:",
      associatedAnimals
    );
  }

  // Constructing the channel name
  const sortedIds = [
    Number(phoneNumber_sender || 0),
    Number(phoneNumber_recipient || 0),
  ].sort((a, b) => a - b);

  const ably = useAbly();

  const channelName = `chat_${sortedIds[0]}_${sortedIds[1]}`;

  const fetchChatHistory = () => {
    fetch(
      `${BASE_URL}/api/fetch_messages?sender_id=${phoneNumber_sender}&recipient_id=${phoneNumber_recipient}&ad_id=${id}&ad_type=${adType}`
    )
      .then((response) => response.json())
      .then((data: Message[]) => {
        console.log("data from chatwindow-----:", data);
        // Create a Set from existing message ids
        const existingMessageIds = new Set(
          messages.map((message) => message.id)
        );

        // Filter out duplicates
        const uniqueNewMessages = data.filter(
          (newMsg) => !existingMessageIds.has(newMsg.id)
        );
        setMessages([...messages, ...uniqueNewMessages]);
      })
      .catch((error) => {
        console.error("Error fetching chat history:", error);
      });
  };

  const sendMessage = () => {
    const trimmedInput = input.trim();

    // Check if the input is empty after trimming
    if (!trimmedInput) {
      console.log("Cannot send an empty message");
      return; // Exit the function to prevent sending an empty message
    }

    const timestamp = new Date().toISOString();
    const uniqueMessageId = `${new Date().getTime()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const messageData = {
      sender_id: phoneNumber_sender || "unknown",
      recipient_id: phoneNumber_recipient,
      content: trimmedInput,
      createtime: timestamp,
      id: uniqueMessageId,
    };

    console.log("Sending ad_id:", id);

    if (ably) {
      const channel = ably.channels.get(`[?rewind=10]${channelName}`);
      channel.publish("send_message", messageData, (err) => {
        if (err) {
          console.error("Error sending message:", err);
          return;
        }

        // Now send the message data to your backend
        fetch(`${BASE_URL}/api/handle_message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_id: phoneNumber_sender || "unknown",
            recipient_id: phoneNumber_recipient,
            content: trimmedInput,
            ad_id: id,
            ad_type: adType,
            ably_message_id: uniqueMessageId,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Message stored in backend:", data);
          })
          .catch((error) => {
            console.error("Error storing message in backend:", error);
          });
      });
    }

    setInput("");
  };

  // This effect will run every time `messages` changes, to auto-scroll to the end
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Dependency on messages array

  useEffect(() => {
    if (ably) {
      const channel = ably.channels.get(`[?rewind=10]${channelName}`);
      channel.subscribe("send_message", (message) => {
        const data = message.data;
        setMessages((prevMessages) => {
          const updatedMessages = [
            ...prevMessages,
            {
              id: data.id,
              sender_id: data.sender_id,
              content: data.content,
              recipient_id: data.recipient_id,
              createtime: data.createtime,
            },
          ];
          updatedMessages.sort(
            (a, b) =>
              new Date(a.createtime).getTime() -
              new Date(b.createtime).getTime()
          );
          return updatedMessages;
        });
      });

      fetchChatHistory();

      return () => {
        channel.unsubscribe("send_message");
      };
    }
  }, [ably, phoneNumber_sender, phoneNumber_recipient, channelName]);

  return (
    <div className="flex flex-col h-screen">
      <HeaderLogo />

      <hr className="border-t border-black-300 mx-1 my-2" />
      {/* Caregiver Info */}
      <div className="flex items-center bg-gray-100 p-3">
        <div className="no-underline w-full bg-white shadow-lg rounded-lg overflow-hidden mb-1 flex flex-col md:flex-row h-62 md:h-48 transition-transform transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-2xl cursor-pointer hover:bg-gray-100">
          {/* Image */}
          <div className="flex flex-row justify-center md:flex-shrink-0 items-center w-full md:w-1/3 p-1 md:p-1">
            <img
              src={individual?.imageurl || defaultImageUrl}
              alt={individual?.name}
              style={imageStyle}
              className="rounded w-2/5 md:w-1/4"
            />
          </div>

          {/* Text */}
          <div className="flex-grow flex flex-col justify-between mx-auto md:p-5">
            <div className="flex items-center">
              <h3 className="text-xl font-semibold text-blue-700 mr-3">
                {individual?.name}
              </h3>
              <FaMapMarkerAlt className="text-gray-600 mb-1" />
              <span className="text-gray-600 ml-2 mb-1">
                {individual?.location &&
                Array.isArray(individual.location) &&
                individual.location.length > 0
                  ? individual.location.map((loc) => loc.label).join(", ")
                  : "无"}
              </span>
              <span className="mb-1 ml-3 text-black">
                {associatedAnimals?.hourlycharge
                  ? `¥ ${associatedAnimals.hourlycharge}元/小时`
                  : "¥ 收费不详"}
              </span>
            </div>
            <div className="text-gray-600 line-clamp mb-1">
              {associatedAds && (
                <div>
                  <p>{associatedAds.title}</p>
                  <p className="line-clamp-3">{associatedAds.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="flex flex-col h-screen">
        <div className="flex-grow overflow-y-auto max-h-[calc(100vh-500px)] md:max-h-[calc(100vh-400px)]">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.sender_id === (phoneNumber_sender || "")
                  ? "text-right"
                  : "text-left"
              } my-2 mx-4`}
            >
              <div
                className={`inline-block p-2 rounded ${
                  message.sender_id === (phoneNumber_sender || "")
                    ? "bg-blue-400 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {message.content}
                <div className="mt-1 text-xs">
                  {formatTimestamp(message.createtime || "")}
                </div>
              </div>
            </div>
          ))}
          <div id="endOfMessages" ref={endOfMessagesRef}></div>
          {/* Moved inside scrollable div */}
        </div>

        {/* Input - Fixed at the bottom */}
        <div className="flex items-center mt-2 sm:mt-4 border-t pt-2 sm:pt-4 w-full bottom-5">
          <input
            className="flex-grow rounded p-2 border border-gray-300 mr-2 ml-5 mb-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请在这里输入..."
          />
          <button
            className="p-2 sm:p-3 rounded bg-teal-400 text-white mr-4 mb-2"
            onClick={sendMessage}
          >
            <BiSend size={16} className="sm:text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
