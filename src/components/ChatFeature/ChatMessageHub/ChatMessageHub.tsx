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
      <Link
        to="/"
        className="flex items-center text-black no-underline mb-8 mt-3"
      >
        <BiHeart
          size={24} // Slightly smaller for mobile
          className="text-red-500 heart-icon my-auto ml-4 sm:size-30 md:block"
        />
        <h1 className="font-bold text-2xl ml-2 my-auto align-middle text-red-500 sm:text-3xl">
          关爱网
        </h1>
      </Link>
      <div className="ml-2 sm:ml-4 md:ml-5 mr-2 sm:mr-4 md:mr-5">
        {/* Adjusted margins for mobile */}
        {conversations.map((conversation) => (
          <div
            key={conversation.conversation_id}
            className={`flex flex-col mb-4 p-3 shadow-md rounded-lg h-auto ${
              activeConversationId === conversation.conversation_id
                ? "bg-blue-200"
                : "bg-white"
            } cursor-pointer`}
            onClick={() =>
              setActiveConversationId(conversation.conversation_id)
            }
          >
            <div className="flex items-center w-full mb-2">
              {/* First section for image */}
              <div className="flex-none">
                <img
                  className="w-10 h-10 rounded-full mr-3 sm:w-12 sm:h-12 md:mr-4"
                  src={conversation.profileImage}
                  alt={conversation.name}
                />
              </div>

              {/* Second section for name and timestamp */}
              <div className="flex-grow flex flex-col md:flex-row">
                <span className="font-medium text-base mb-2 md:mb-0 md:mr-3 sm:text-lg">
                  {conversation.name}
                </span>
                <span className="text-xs text-gray-500 text-right flex-none md:ml-auto">
                  {conversation.timestamp}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-600 ellipsis sm:text-sm">
              {conversation.lastMessage}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatMessageHub;
