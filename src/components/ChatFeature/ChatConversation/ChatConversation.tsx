import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Ably from "ably";
import { BASE_URL } from "../../../types/Constant";
import { BiSend } from "react-icons/bi";
import {
  Caregiver,
  Careneeder,
  AnimalCaregiverForm,
  AnimalCareneederForm,
} from "../../../types/Types";
import { defaultImageUrl } from "../../../types/Constant";
import { v4 as uuidv4 } from "uuid";
import { useAbly } from "../../../context/AblyContext";

type Message = {
  id?: string;
  sender_id: string;
  content: string;
  recipient_id: string | null;
  createtime?: string | null;
  ad_id?: number;
  ad_type?: string;
  ably_message_id?: string;
};

type ChatConversationProps = {
  activeConversationKey: string | null;
  loggedInUser_phone: string | null;
  recipientId: string | null;
  conversations: Conversation[];
  setIsUserOnline: (value: boolean) => void;
  isUserOnline: boolean | false;
};

type ConversationId = number;
type AdId = number;

type Conversation = {
  conversation_id: number;
  other_user_phone: string;
  name: string;
  profileImage: string;
  lastMessage: string;
  timestamp: string;
  ad_id: number;
  ad_type: string;
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

const ChatConversation: React.FC<ChatConversationProps> = ({
  activeConversationKey,
  loggedInUser_phone,
  recipientId,
  conversations,
  setIsUserOnline,
  isUserOnline,
}) => {
  console.log("ChatConversation rendered");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState(false); // Added loading state
  const lastFetchedConversationId = useRef<string | null>(null);

  const [caregiver, setCaregiver] = useState<Caregiver | null>(null);
  const [careneeder, setCareneeder] = useState<Careneeder | null>(null);
  const [animalcaregiver, setAnimalCaregiver] =
    useState<AnimalCaregiverForm | null>(null);
  const [animalcareneeder, setAnimalCareneeder] =
    useState<AnimalCareneederForm | null>(null);

  const [ActiveConversationId, setActiveConversationId] = useState<
    number | null
  >(null);
  const [ActiveAdId, setActiveAdId] = useState<number | null>(null);

  const [receivedMessageIds, setReceivedMessageIds] = useState(new Set());

  const splitConversationKey = (key: string): [ConversationId, AdId] => {
    const parts = key.split("-");
    return [Number(parts[0]), Number(parts[1])];
  };

  // Extracting the conversation ID and Ad ID from the activeConversationKey
  useEffect(() => {
    if (activeConversationKey) {
      const [activeConvId, activeAdId] = splitConversationKey(
        activeConversationKey
      );
      setActiveConversationId(activeConvId);
      setActiveAdId(activeAdId);
    }
  }, [activeConversationKey]);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const sortedIds = [
    Number(loggedInUser_phone || 0),
    Number(recipientId || 0),
  ].sort((a, b) => a - b);

  const ably = useAbly();

  const channelName = `chat_${sortedIds[0]}_${sortedIds[1]}`;

  console.log("this is recipientId:", recipientId);

  console.log(
    "this is activeconversationid and activeadId:",
    ActiveConversationId,
    ActiveAdId
  );

  const fetchChatHistory = async () => {
    setMessages([]);
    if (
      lastFetchedConversationId.current === null ||
      lastFetchedConversationId.current === activeConversationKey
    ) {
      setLoading(true); // Start loading
      fetch(
        `${BASE_URL}/api/fetch_messages_chat_conversation?conversation_id=${ActiveConversationId}&ad_id=${ActiveAdId}`
      )
        .then((response) => response.json())
        .then((data: Message[]) => {
          if (!Array.isArray(data)) {
            console.error("Data from server is not an array:", data);
            setLoading(false);
            return;
          }
          console.log("Parsed chatconversation data from server:", data);

          // Filter out duplicates based on 'ably_message_id'
          const uniqueNewMessages = data.filter(
            (newMsg) => !receivedMessageIds.has(newMsg.ably_message_id)
          );

          console.log("receivedMessageIds: ", receivedMessageIds);
          console.log("uniquemessage: ", uniqueNewMessages);
          setMessages([...messages, ...uniqueNewMessages]);
          setLoading(false); // Turn off the loading state
        })
        .catch((error) => {
          console.error("Error fetching chat history:", error);
          setLoading(false); // Stop loading even if there's an error
        });
    }
  };

  // This effect will run every time `messages` changes, to auto-scroll to the end
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Dependency on messages array

  useEffect(() => {
    let isMounted = true;

    if (ably && activeConversationKey && ActiveAdId) {
      setLoading(true);
      const channel = ably.channels.get(`[?rewind=10]${channelName}`);

      const handleNewMessage = (message: any) => {
        if (isMounted) {
          const data = message.data;
          console.log("ably data: ", data)
          // Check if message is already received
          if (!receivedMessageIds.has(data.id)) {
            setMessages((prevMessages) =>
              [
                ...prevMessages,
                {
                  ably_message_id: data.id,
                  sender_id: data.sender_id,
                  content: data.content,
                  recipient_id: data.recipient_id,
                  createtime: data.createtime,
                },
              ].sort(
                (a, b) =>
                  new Date(a.createtime).getTime() -
                  new Date(b.createtime).getTime()
              )
            );
          }
          setReceivedMessageIds((prevIds) => new Set(prevIds).add(data.id));
        }
      };

      channel.subscribe("send_message", handleNewMessage);

      return () => {
        if (isMounted) {
          channel.unsubscribe("send_message", handleNewMessage);
        }
      };
    }
  }, [ably, activeConversationKey, ActiveAdId, channelName]);

  useEffect(() => {
    if (activeConversationKey && ActiveAdId) {
      setLoading(true);
      fetchChatHistory()
        .then(() => {
          setLoading(false);
          lastFetchedConversationId.current = activeConversationKey;
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [activeConversationKey, ActiveAdId]);

  const sendMessage = () => {
    const trimmedInput = newMessage.trim();

    // Check if the input is empty after trimming
    if (!trimmedInput) {
      console.log("Cannot send an empty message");
      return; // Exit the function to prevent sending an empty message
    }

    if (ably) {
      const channel = ably.channels.get(`[?rewind=10]${channelName}`);
      const uniqueMessageId = `${new Date().getTime()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const payload = {
        sender_id: loggedInUser_phone,
        recipient_id: recipientId,
        content: newMessage,
        createtime: new Date().toISOString(),
        id: uniqueMessageId,
      };

      channel.publish("send_message", payload, (err) => {
        if (err) {
          console.error("Error sending message:", err);
          return;
        }

        // After successfully publishing the message to Ably, send it to the backend
        fetch(`${BASE_URL}/api/handle_message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_id: loggedInUser_phone || "unknown",
            recipient_id: recipientId,
            content: newMessage,
            ad_id: activeConversation?.ad_id,
            ad_type: activeConversation?.ad_type,
            ably_message_id: uniqueMessageId,
          }),
        })
          .then((response) => response.json())
          .then((data) => console.log("Message stored in backend:", data))
          .catch((error) =>
            console.error("Error storing message in backend:", error)
          );
      });
    }
    setNewMessage("");
  };

  const activeConversation = conversations.find(
    //this ActiveConversationId will be the same
    (convo) =>
      convo.conversation_id === ActiveConversationId &&
      convo.ad_id === ActiveAdId
  );
  console.log("conversations---", conversations);
  console.log("activeConversation:", activeConversation);

  //retrieve ad's profile and name using ad_id and ad_type

  const fetchData = (endpoint: string, setIdFunction: (data: any) => void) => {
    console.log("Fetching from endpoint:", endpoint);

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data fetched from endpoint:", endpoint, data);
        setIdFunction(data);
      })
      .catch((error) => {
        console.error(
          "Error fetching data from endpoint:",
          endpoint,
          error.message
        );
      });
  };

  // 1. Create a flag to keep track of the current request
  const activeRequest = useRef<number>(0);

  useEffect(() => {
    // Reset data when the activeConversationKey changes
    setCaregiver(null);
    setCareneeder(null);
    setAnimalCareneeder(null);
    setAnimalCaregiver(null);

    console.log("Active Conversation key changed:", activeConversationKey);
  }, [activeConversationKey]);

  useEffect(() => {
    console.log("Running useEffect for conversation_id:", ActiveConversationId);
    console.log("Active Conversation data:", activeConversation);
    console.log("Active Conversation ad_id:", activeConversation?.ad_id);
    console.log("Active Conversation ad_type:", activeConversation?.ad_type);

    if (activeConversation) {
      // Increment the request counter
      activeRequest.current += 1;
      const thisRequest = activeRequest.current;

      const handleData = (data: any) => {
        if (thisRequest === activeRequest.current) {
          // Only update the state if this is the current active request
          if (activeConversation.ad_type === "careneeders") {
            setCareneeder(data);
          } else if (activeConversation.ad_type === "caregivers") {
            setCaregiver(data);
          } else if (activeConversation.ad_type === "animalcaregivers") {
            setAnimalCaregiver(data);
          } else if (activeConversation.ad_type === "animalcareneeders") {
            setAnimalCareneeder(data);
          }
        }
      };

      if (activeConversation.ad_type === "careneeders") {
        fetchData(
          `${BASE_URL}/api/careneeder/all_careneeders/${activeConversation.ad_id}`,
          handleData
        );
      } else if (activeConversation.ad_type === "caregivers") {
        fetchData(
          `${BASE_URL}/api/caregiver/all_caregivers/${activeConversation.ad_id}`,
          handleData
        );
      } else if (activeConversation.ad_type === "animalcaregivers") {
        fetchData(
          `${BASE_URL}/api/animalcaregiver/all_animalcaregiverform/${activeConversation.ad_id}`,
          handleData
        );
      } else if (activeConversation.ad_type === "animalcareneeders") {
        fetchData(
          `${BASE_URL}/api/animalcareneeder/all_animalcareneederform/${activeConversation.ad_id}`,
          handleData
        );
      }
    }
  }, [activeConversation]);

  console.log("Current caregiver:", caregiver);

  const currentData =
    activeConversation?.ad_type === "careneeders"
      ? careneeder
      : activeConversation?.ad_type === "caregivers"
      ? caregiver
      : activeConversation?.ad_type === "animalcaregivers"
      ? animalcaregiver
      : activeConversation?.ad_type === "animalcareneeders"
      ? animalcareneeder
      : null;

  console.log("activeConversation?.ad_type:", activeConversation?.ad_type);

  console.log("Current data:", currentData);

  return (
    <div className="flex flex-col h-screen bg-white overflow-x-hidden mx-auto border-l min-height: 100vh">
      {currentData ? (
        <Link
          to={`/${activeConversation?.ad_type}/id/${activeConversation?.ad_id}?phoneNumber=${loggedInUser_phone}`}
          className="no-underline"
        >
          <h1 className="text-lg font-bold mb-2 flex items-center bg-gray-100 p-4 border-b border-gray-300">
            <img
              src={currentData.imageurl || defaultImageUrl}
              alt="Profile"
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full mr-2"
            />
            {currentData.name || "未知"}
          </h1>
        </Link>
      ) : (
        <div className="text-lg font-bold mb-2 flex items-center bg-gray-100 p-4 border-b border-gray-300">
          <img
            src={activeConversation?.profileImage || defaultImageUrl}
            alt="Profile"
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full mr-2"
          />
          {activeConversation?.name || "未知"}
        </div>
      )}
      {/* <div
        className={`mx-4 mt-2 text-center ${
          isUserOnline ? "text-green-500" : "text-gray-500"
        }`}
      >
        {isUserOnline ? "在线中" : "下线中，请留言"}
      </div> */}
      <div className="flex-grow overflow-y-auto  border-gray-300 p-2 sm:p-4">
        {loading ? (
          <p className="text-sm sm:text-base">加载中...</p>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.sender_id === (loggedInUser_phone || "")
                  ? "text-right"
                  : "text-left"
              } my-2 mx-2 sm:mx-4`}
            >
              <div
                className={`inline-block p-2 sm:p-3 rounded-3xl ${
                  message.sender_id === (loggedInUser_phone || "")
                    ? "bg-teal-400 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {message.content}
              </div>
              <div className="mt-1 text-xs sm:text-sm text-gray-500">
                {formatTimestamp(message.createtime || "")}
              </div>
            </div>
          ))
        )}
        <div id="endOfMessages" ref={endOfMessagesRef}></div>
      </div>

      {/* Input - Fixed at the bottom */}
      <div className="flex items-center mt-2 sm:mt-4 border-t pt-2 sm:pt-4 w-full bottom-5">
        <input
          className="flex-grow rounded p-2 border border-gray-300 mr-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="请在这里输入..."
        />
        <button
          className="p-2 sm:p-3 rounded bg-teal-400 text-white mr-1"
          onClick={sendMessage}
        >
          <BiSend size={16} className="sm:text-xl" />
        </button>
      </div>
    </div>
  );
};

export default ChatConversation;
