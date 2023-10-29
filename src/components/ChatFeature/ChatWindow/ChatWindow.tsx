import React, { useState, useEffect, useRef } from "react";
import Ably from "ably";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useCaregiverContext } from "../../../context/CaregiverContext";
import { useCaregiverAdsContext } from "../../../context/CaregiverAdsContext";
import { Link, useLocation } from "react-router-dom";
import { BiHeart, BiSend } from "react-icons/bi";
import { BASE_URL } from "../../../types/Constant";
import { useCareneederContext } from "../../../context/CareneederContext";
import { useCareneederAdsContext } from "../../../context/CareneederAdsContext";
import { Caregiver, Careneeder, CaregiverAds, Ads } from "../../../types/Types";

type Message = {
  id?: string;
  sender_id: string;
  content: string;
  recipient_id: string | null;
  createtime?: string | null;
  ad_id?: number;
  ad_type?: string;
};

const realtime = new Ably.Realtime.Promise(
  "iP9ymA.8JTs-Q:XJkf6tU_20Q-62UkTi1gbXXD21SHtpygPTPnA7GX0aY"
);

realtime.connection.on("failed", (stateChange) => {
  console.error("Ably realtime connection error:", stateChange.reason);
});

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

  const { caregivers } = useCaregiverContext();
  const { caregiverAds } = useCaregiverAdsContext();

  const { careneeders } = useCareneederContext();
  const { careneederAds } = useCareneederAdsContext();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idString = queryParams.get("id");
  const phoneNumber_sender = queryParams.get("phoneNumber_sender");
  const phoneNumber_recipient = queryParams.get("phoneNumber_recipient");
  // Guard against undefined and NaN
  const id = idString ? parseInt(idString, 10) : null;

  const adType = queryParams.get("adType");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const defaultImageUrl =
    "https://alex-chen.s3.us-west-1.amazonaws.com/blank_image.png"; // Replace with the actual URL

  let individual: Caregiver | Careneeder | undefined;
  let associatedAds: CaregiverAds | Ads | null | undefined = undefined;

  console.log("adType:", adType);
  console.log("idddddd:", id);

  if (adType === "caregivers") {
    individual =
      id !== null && !isNaN(id)
        ? caregivers.find((c) => c.id === id)
        : undefined;

    console.log("Fetched caregivers individual:", individual);
    associatedAds = individual
      ? caregiverAds?.find((ad) => ad.caregiver_id === individual!.id)
      : null;
    console.log("Fetched associatedAds for caregivers:", associatedAds);
  } else if (adType === "careneeders") {
    individual =
      id !== null && !isNaN(id)
        ? careneeders.find((c) => c.id === id)
        : undefined;
    console.log("Fetched careneeders individual:", individual);
    associatedAds = individual
      ? careneederAds?.find((ad) => ad.careneeder_id === individual!.id)
      : null;
    console.log("Fetched associatedAds for careneeders:", associatedAds);
  }

  // Constructing the channel name
  const sortedIds = [
    Number(phoneNumber_sender || 0),
    Number(phoneNumber_recipient || 0),
  ].sort((a, b) => a - b);

  const channelName = `chat_${sortedIds[0]}_${sortedIds[1]}`;

  const channel = realtime.channels.get(`[?rewind=10]${channelName}`);

  console.log("this is channel:", channel);

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
    const timestamp = new Date().toISOString();

    const uniqueMessageId = `${new Date().getTime()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const messageData = {
      sender_id: phoneNumber_sender || "unknown",
      recipient_id: phoneNumber_recipient,
      content: input,
      createtime: timestamp,
      id: uniqueMessageId,
    };

    console.log("Sending ad_id:", id);

    channel
      .publish("send_message", messageData)
      .then(() => {
        // Now send the message data to your backend
        fetch(`${BASE_URL}/api/handle_message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_id: phoneNumber_sender || "unknown",
            recipient_id: phoneNumber_recipient,
            content: input,
            ad_id: id,
            ad_type: adType,
          }),
        })
          .then((response) => response.json()) // Assuming server responds with json
          .then((data) => {
            console.log("Message stored in backend:", data);
          })
          .catch((error) => {
            console.error("Error storing message in backend:", error);
          });
      })
      .catch((err) => {
        console.error("Error sending message:", err);
      });

    setInput("");
  };

  // This effect will run every time `messages` changes, to auto-scroll to the end
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Dependency on messages array

  useEffect(() => {
    fetchChatHistory();
    channel.subscribe("send_message", (message) => {
      const data = message.data;
      setMessages((prevMessages) => {
        // Combine previous messages with the new message
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

        // Sort messages by their `createtime`
        updatedMessages.sort((a, b) => {
          const dateA = new Date(a.createtime).getTime();
          const dateB = new Date(b.createtime).getTime();
          return dateA - dateB; // sort in ascending order
        });

        return updatedMessages;
      });
    });

    return () => {
      channel.unsubscribe("send_message");
    };
  }, [phoneNumber_sender, phoneNumber_recipient]);

  return (
    <div className="flex flex-col h-screen">
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
          <div className="flex-grow flex flex-col justify-between p-1 md:p-5">
            <div className="flex items-center justify-center md:justify-start ">
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
                {individual?.hourlycharge
                  ? `¥ ${individual.hourlycharge}元/小时`
                  : "¥ 收费不详"}
              </span>
            </div>
            <div className="text-gray-600 line-clamp mb-1">
              {associatedAds && (
                <div className="mx-auto">
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
        </div>

        <div className="flex items-center mt-2 sm:mt-4 border-t pt-2 sm:pt-4 w-full">
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
