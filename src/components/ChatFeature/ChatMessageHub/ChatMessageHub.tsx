import React, { useState } from "react";
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
  ad_id: number;
  ad_type: string;
};

type ConversationId = number;
type AdId = number;
type OnlineStatus = {
  [phone: string]: boolean;
};

type ChatMessageHubProps = {
  conversations: Conversation[];
  setActiveConversationKey: React.Dispatch<React.SetStateAction<string | null>>;
  activeConversationKey: string | null;
  isUserOnline: OnlineStatus | null;
};

const ChatMessageHub: React.FC<ChatMessageHubProps> = ({
  conversations,
  setActiveConversationKey,
  activeConversationKey,
  isUserOnline,
}) => {
  const createConversationKey = (
    conversation_id: ConversationId,
    ad_id: AdId
  ): string => {
    return `${conversation_id}-${ad_id}`;
  };

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
      <div className="ml-2 sm:ml-4 md:ml-5 mr-2 sm:mr-4 md:mr-5 overflow-y-auto max-h-[calc(100vh-100px)]">
        {/* Adjusted margins for mobile */}
        {conversations.map((conversation) => (
          <div
            key={createConversationKey(
              conversation.conversation_id,
              conversation.ad_id
            )}
            className={`flex flex-col mb-4 p-3 shadow-md rounded-lg h-auto ${
              activeConversationKey ===
              createConversationKey(
                conversation.conversation_id,
                conversation.ad_id
              )
                ? "bg-blue-200"
                : "bg-white"
            } cursor-pointer`}
            onClick={() =>
              setActiveConversationKey(
                createConversationKey(
                  conversation.conversation_id,
                  conversation.ad_id
                )
              )
            }
          >
            <div className="flex flex-col md:flex-row items-center justify-center w-full mb-2">
              {/* First section for image */}
              <div className="flex-none mb-2 md:mb-0">
                <img
                  className="w-10 h-10 rounded-full mr-3 sm:w-12 sm:h-12 md:mr-4"
                  src={conversation.profileImage}
                  alt={conversation.name}
                />
              </div>
              {/* Second section for name and timestamp */}
              <div className="flex-grow flex flex-col md:flex-row items-center justify-center md:justify-start">
                <span className="font-medium text-base mb-1 md:mb-0 md:mr-3 sm:text-lg">
                  {conversation.name}
                </span>
                <span
                  className={`text-center text-customFontSize sm:text-sm sm:mb-1 ${
                    isUserOnline && isUserOnline[conversation.other_user_phone] ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  {isUserOnline && isUserOnline[conversation.other_user_phone]
                    ? "在线中"
                    : "下线中，请留言"}
                </span>
                <span className="text-customFontSize text-gray-500 text-right flex-none md:ml-auto">
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
