import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Ably from "ably";
import { BASE_URL } from "../../../types/Constant";
import { BiSend } from "react-icons/bi";

type Message = {
  id?: string; // Add this line
  sender_id: string;
  content: string;
  recipient_id: string | null;
  createtime?: string | null;
};

type ChatConversationProps = {
  activeConversationId: number | null;
  loggedInUser_phone: string | null;
  recipientId: string | null;
  conversations: Conversation[];
};

type Conversation = {
  conversation_id: number;
  other_user_phone: string;
  name: string;
  profileImage: string;
  lastMessage: string;
  timestamp: string;
};

const realtime = new Ably.Realtime.Promise(
  "iP9ymA.8JTs-Q:XJkf6tU_20Q-62UkTi1gbXXD21SHtpygPTPnA7GX0aY"
);

realtime.connection.on("failed", (stateChange) => {
  console.error("Ably realtime connection error:", stateChange.reason);
});

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
  activeConversationId,
  loggedInUser_phone,
  recipientId,
  conversations
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState(false); // Added loading state
  const lastFetchedConversationId = useRef<number | null>(null);

  const conversation_id = activeConversationId;

  const sortedIds = [
    Number(loggedInUser_phone || 0),
    Number(recipientId || 0),
  ].sort((a, b) => a - b);

  const channelName = `chat_${sortedIds[0]}_${sortedIds[1]}`;

  const channel = realtime.channels.get(`[?rewind=10]${channelName}`);

  console.log("this is channel:", channel);

  const fetchChatHistory = async () => {
    if (
      lastFetchedConversationId.current === null ||
      lastFetchedConversationId.current === conversation_id
    ) {
      setLoading(true); // Start loading
      fetch(
        `${BASE_URL}/api/fetch_messages_chat_conversation?conversation_id=${conversation_id}`
      )
        .then((response) => response.json())
        .then((data: Message[]) => {
          // Create a Set from existing message ids
          const existingMessageIds = new Set(
            messages.map((message) => message.id)
          );

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
    channel
      .publish("send_message", payload)
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

    if (conversation_id) {
      setMessages([]);
      setLoading(true);

      fetchChatHistory()
        .then(() => {
          // After successfully fetching the chat history,
          // update the last fetched conversation ID to the current active one.
          if (isMounted) {
            lastFetchedConversationId.current = conversation_id;
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
        channel.unsubscribe(currentSubscription);
      }

      // Subscribe to new messages on the channel
      channel.subscribe("send_message", handleNewMessage);

      return () => {
        if (currentSubscription) {
          currentSubscription.unsubscribe();
        }
        isMounted = false;
      };
    }
  }, [loggedInUser_phone, recipientId, conversation_id]);

  return (
    <div className="flex flex-col h-full bg-white p-4 overflow-x-hidden mx-auto border-l">
      
      <h1 className="text-lg font-bold mb-4">{conversation_id}</h1>

      <div className="flex-grow overflow-y-auto  border-gray-300 p-4">
        {loading ? (
          <p>加载中...</p>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.sender_id === (loggedInUser_phone || "")
                  ? "text-right"
                  : "text-left"
              } my-2 mx-4`}
            >
              <div
                className={`inline-block p-3 rounded-3xl ${
                  message.sender_id === (loggedInUser_phone || "")
                    ? "bg-teal-400 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {message.content}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {formatTimestamp(message.createtime || "")}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input - Fixed at the bottom */}
      <div className="flex items-center mt-4 border-t pt-4 w-full bottom-5">
        <input
          className="flex-grow rounded p-2 border border-gray-300 mr-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="请在这里输入..."
        />
        <button
          className="p-2 rounded bg-teal-400 text-white"
          onClick={sendMessage}
        >
          <BiSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatConversation;
