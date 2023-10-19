import React from "react";
import "./ChatMessageHub.css";
import { Link } from "react-router-dom";
import { BiHeart } from "react-icons/bi";

type Conversation = {
  conversation_id: number;
  other_user_phone: string;
  name: string;
  profileImage: string;
  lastMessage: string;
  timestamp: string;
};

type ChatMessageHubProps = {
  conversations: Conversation[];
  setActiveConversationId: React.Dispatch<React.SetStateAction<number | null>>;
  activeConversationId: number | null;
};

const ChatMessageHub: React.FC<ChatMessageHubProps> = ({
  conversations,
  setActiveConversationId,
  activeConversationId,
}) => {
  return (
    <div className="relative">
      <Link to="/" className="flex items-center text-black no-underline mb-8 mt-3">
        <BiHeart
          size={30}
          className="text-red-500 heart-icon my-auto ml-4 hidden md:block" // Added ml-4 for more margin to the left
        />
        <h1 className="font-bold text-3xl ml-2 my-auto align-middle text-red-500">
          关爱网
        </h1>
      </Link>
      <div className="ml-5 mr-5">
        {conversations.map((conversation) => (
          <div
            key={conversation.conversation_id}
            className={`flex flex-col mb-4 p-3 shadow-md rounded-lg h-auto ${
              activeConversationId === conversation.conversation_id
                ? "bg-blue-200" // Highlight if active
                : "bg-white" // Normal if not active
            } cursor-pointer`}
            onClick={() =>
              setActiveConversationId(conversation.conversation_id)
            }
          >
            <div className="flex items-center w-full mb-2">
              <img
                className="w-12 h-12 rounded-full mr-4"
                src={conversation.profileImage}
                alt={conversation.name}
              />
              <span className="font-medium flex-grow">{conversation.name}</span>
              <span className="text-xs text-gray-500 text-right flex-none ml-auto">
                {conversation.timestamp}
              </span>
            </div>
            <p className="text-sm text-gray-600 ellipsis ">
              {conversation.lastMessage}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatMessageHub;
