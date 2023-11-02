import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import Ably from "ably";
import { BASE_URL } from "../../../types/Constant";
import { BiSend } from "react-icons/bi";
import { Caregiver, Careneeder } from "../../../types/Types";
import { defaultImageUrl } from "../../../types/Constant";
import { v4 as uuidv4 } from "uuid";

type Message = {
  id?: string; // Add this line
  sender_id: string;
  content: string;
  recipient_id: string | null;
  createtime?: string | null;
  ad_id?: number;
  ad_type?: string;
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

  const [ActiveConversationId, setActiveConversationId] = useState<
    number | null
  >(null);
  const [ActiveAdId, setActiveAdId] = useState<number | null>(null);

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

  const realtimeRef = useRef<InstanceType<typeof Ably.Realtime.Promise> | null>(
    null
  );
  const channelRef = useRef<Ably.Types.RealtimeChannelPromise | null>(null);

  const channelName = `chat_${sortedIds[0]}_${sortedIds[1]}`;

  useEffect(() => {
    // Initialization of realtime
    if (!realtimeRef.current) {
      realtimeRef.current = new Ably.Realtime.Promise({
        key: "iP9ymA.8JTs-Q:XJkf6tU_20Q-62UkTi1gbXXD21SHtpygPTPnA7GX0aY",
        clientId: loggedInUser_phone || uuidv4(),
      });

      realtimeRef.current.connection.on("failed", (stateChange) => {
        console.error("Ably realtime connection error:", stateChange.reason);
      });
    }
    // Initialization of the channel reference
    if (realtimeRef.current) {
      // If the channelRef already exists, detach from the channel
      // to cleanup before re-initializing.
      if (channelRef.current && channelRef.current.state === 'attached') {
        channelRef.current.detach();
      }

      channelRef.current = realtimeRef.current.channels.get(
        `[?rewind=10]${channelName}`
      );
    }
    // Return cleanup function to detach from the channel when the component is unmounted
    return () => {
      if (channelRef.current && channelRef.current.state === 'attached') {
        channelRef.current.detach();
      }
    };
  }, [channelName]);

  useEffect(() => {
    if (!channelRef.current) return;

    // Define the state change handler
    const onStateChange = (stateChange: Ably.Types.ChannelStateChange) => {
      if (stateChange.current === "attached") {
        // Once the channel is attached, we can proceed with other operations

        // Enter the chat
        channelRef
          .current!.presence.enter("User has entered the chat.")
          .then(() => {
            console.log("Successfully announced entry into the chat.");
          })
          .catch((err) => {
            console.error("Error entering the chat:", err);
          });

        // Handle presence events
        const handlePresence = (message: Ably.Types.PresenceMessage) => {
          console.log(
            "Presence event:",
            message.action,
            "for user",
            message.clientId
          );
        };

        channelRef.current!.presence.subscribe(handlePresence);

        // Cleanup function to unsubscribe
        return () => {
          channelRef.current!.presence.unsubscribe(handlePresence);
        };
      }
      // ... handle other states if needed
    };

    // Attach the state change handler
    channelRef.current.on(onStateChange);

    // Cleanup
    return () => {
      if (channelRef.current) {
        channelRef.current.off(onStateChange);
        // If needed, you can add detach or other cleanup logic related to the channel
      }
    };
  }, [channelRef.current]);

  useEffect(() => {
    if (!channelRef.current) return;

    // Listener for users entering the channel
    const handleEnter = (member: Ably.Types.PresenceMessage) => {
      console.log("User entered:", member.clientId);
      if (member.clientId === recipientId) {
        setIsUserOnline(true);
      }
    };

    // Listener for users leaving the channel
    const handleLeave = (member: Ably.Types.PresenceMessage) => {
      console.log("User left:", member.clientId);
      if (member.clientId === recipientId) {
        setIsUserOnline(false);
      }
    };

    channelRef.current.presence.subscribe("enter", handleEnter);
    channelRef.current.presence.subscribe("leave", handleLeave);

    // Fetch the initial presence set when the component mounts
    if (channelRef.current.state === "attached") {
      channelRef.current.presence
        .get()
        .then((members) => {
          console.log("Members in the channel:", members);
          const isRecipientOnline = members.some(
            (member) => member.clientId === recipientId
          );
          setIsUserOnline(isRecipientOnline);
        })
        .catch((err) => {
          console.error("Error fetching presence data:", err);
        });
    }

    // Cleanup function
    return () => {
      channelRef.current!.presence.unsubscribe("enter", handleEnter);
      channelRef.current!.presence.unsubscribe("leave", handleLeave);
      if (
        channelRef.current!.state !== "detaching" &&
        channelRef.current!.state !== "detached"
      ) {
        channelRef
          .current!.presence.leave("User has left the chat.")
          .catch((err) => {
            console.error("Error leaving the chat:", err);
          });
      }
    };
  }, [channelRef.current, recipientId]);

  console.log("this is channel:", channelRef.current);
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
          // Create a Set from existing message ids
          const existingMessageIds = new Set(
            messages.map((message) => message.id)
          );

          console.log("Existing message IDs:", existingMessageIds);

          // Filter out duplicates
          const uniqueNewMessages = data.filter(
            (newMsg) => !existingMessageIds.has(newMsg.id)
          );
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
    let currentSubscription: { unsubscribe: () => void } | null = null;

    const handleNewMessage = (message: any) => {
      if (isMounted) {
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
      }
    };
    console.log("useEffect activeConversationKey:", activeConversationKey);

    if (activeConversationKey && ActiveAdId) {
      setLoading(true);

      fetchChatHistory()
        .then(() => {
          // After successfully fetching the chat history,
          // update the last fetched conversation ID to the current active one.
          if (isMounted) {
            lastFetchedConversationId.current = activeConversationKey;
            setLoading(false); // Turn off loading
          }
        })
        .catch(() => {
          if (isMounted) {
            setLoading(false); // Turn off loading in case of an error
          }
        });

      // Unsubscribe from previous subscription if any
      if (currentSubscription) {
        channelRef.current!.unsubscribe();
        currentSubscription = null;
      }

      // Subscribe to new messages on the channel
      channelRef.current!.subscribe("send_message", handleNewMessage);

      return () => {
        if (currentSubscription) {
          currentSubscription.unsubscribe();
          currentSubscription = null;
        }
        isMounted = false;
      };
    }
  }, [loggedInUser_phone, recipientId, activeConversationKey, ActiveAdId]);

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
          }
        }
      };

      if (activeConversation.ad_type === "careneeders") {
        fetchData(
          `${BASE_URL}/api/all_careneeders/${activeConversation.ad_id}`,
          handleData
        );
      } else if (activeConversation.ad_type === "caregivers") {
        fetchData(
          `${BASE_URL}/api/all_caregivers/${activeConversation.ad_id}`,
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
      : null;

  console.log("activeConversation?.ad_type:", activeConversation?.ad_type);

  console.log("Current data:", currentData);

  const sendMessage = () => {
    const timestamp = new Date().toISOString();

    const uniqueMessageId = `${new Date().getTime()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    // Implement your sending logic here using fetch and /api/handle_message
    const payload = {
      sender_id: loggedInUser_phone,
      recipient_id: recipientId,
      content: newMessage,
      createtime: timestamp,
      id: uniqueMessageId,
    };
    channelRef
      .current!.publish("send_message", payload)
      .then(() => {
        // Now send the message data to your backend
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
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Message stored in backend:", data);
          })
          .catch((error) => {
            console.error("There was an error sending the message", error);
          });
      })
      .catch((err) => {
        console.error("Error sending message:", err);
      });
    setNewMessage("");
  };

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
