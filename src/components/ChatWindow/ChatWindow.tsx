import React, { useState, useEffect } from "react";
import Ably from "ably";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useCaregiverContext } from "../../context/CaregiverContext";
import { useCaregiverAdsContext } from "../../context/CaregiverAdsContext";
import { Link, useLocation } from "react-router-dom";
import { BiHeart } from "react-icons/bi";

type Message = {
  id?: string; // Add this line
  userType?: string;
  sender_id: string;
  content: string;
  recipient_id: string | null;
  createtime?: string | null;
  status?: "sending" | "sent" | "failed" | null;
};

// const ENDPOINT = `${BASE_URL}`;

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

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idString = queryParams.get("id");
  const phoneNumber_sender = queryParams.get("phoneNumber_sender");
  const phoneNumber_recipient = queryParams.get("phoneNumber_recipient");
  // Guard against undefined and NaN
  const id = idString ? parseInt(idString, 10) : null;

  // Check that id is neither undefined nor NaN before performing the filter
  const caregiver =
    id !== null && !isNaN(id) ? caregivers.find((c) => c.id === id) : undefined;

  const associatedAds = caregiver
    ? caregiverAds?.find((ad) => ad.caregiver_id === caregiver.id)
    : null;

  // Constructing the channel name
  const sortedIds = [
    Number(phoneNumber_sender || 0),
    Number(phoneNumber_recipient || 0),
  ].sort((a, b) => a - b);

  const channelName = `chat_${sortedIds[0]}_${sortedIds[1]}`;
  const channel = realtime.channels.get(channelName);

  console.log("this is channel:", channel);

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

    channel
      .publish("send_message", messageData)
      .then(() => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.createtime === timestamp &&
            msg.sender_id === messageData.sender_id
              ? { ...msg, status: "sent" }
              : msg
          )
        );

        // Start a timer to hide the "sent" status after 5 seconds
        setTimeout(() => {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.createtime === timestamp &&
              msg.sender_id === messageData.sender_id
                ? { ...msg, status: null }
                : msg
            )
          );
        }, 5000);
      })
      .catch((err) => {
        console.error("Error sending message:", err);
        // handle failed message status here
      });

    setInput("");
  };

  channel.on("attached", () => {
    console.log(`Channel ${channelName} attached.`);
  });

  channel.on("detached", (stateChange) => {
    console.error(`Channel ${channelName} detached.`, stateChange.reason);
  });

  channel.on("failed", (stateChange) => {
    console.error(
      `Channel ${channelName} connection failed.`,
      stateChange.reason
    );
  });

  useEffect(() => {
    channel.subscribe("send_message", (message) => {
      const data = message.data;
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: data.id,
            sender_id: data.sender_id,
            content: data.content,
            recipient_id: data.recipient_id,
            status: "sent",
            createtime: data.createtime,
          },
        ]);
    });

    return () => {
      channel.unsubscribe("send_message");
    };
  }, []);

  useEffect(() => {
    const onConnecting = () => {
      console.log("Connecting to Ably...");
    };

    const onConnected = () => {
      console.log("Successfully connected!");
    };

    const onDisconnected = () => {
      console.error("Disconnected from Ably.");
    };

    realtime.connection.on("connecting", onConnecting);
    realtime.connection.on("connected", onConnected);
    realtime.connection.on("disconnected", onDisconnected);

    // Clean-up function to remove the event listeners when the component unmounts
    return () => {
      realtime.connection.off("connecting", onConnecting);
      realtime.connection.off("connected", onConnected);
      realtime.connection.off("disconnected", onDisconnected);
    };
  }, []);

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
        <div className="no-underline w-full md:w-11/12 lg:w-3/4 bg-white shadow-lg rounded-lg overflow-hidden mb-1 flex flex-col md:flex-row h-62 transition-transform transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-2xl cursor-pointer hover:bg-gray-100 p-1">
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
        </div>
      </div>

      {/* Chat */}
      <div className="flex-grow overflow-y-auto">
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

              <span className="ml-2 text-sm">
                {message.status === "sending" && "sending..."}
                {message.status === "failed" && "failed"}
              </span>
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
          发送消息
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
