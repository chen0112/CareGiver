import React, { useEffect, useState } from "react";
import ChatMessageHub from "../ChatMessageHub/ChatMessageHub";
import ChatConversation from "../ChatConversation/ChatConversation";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../../../types/Constant";

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

const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const user_phone = queryParams.get("loggedInUser");
  const user_type = queryParams.get("userType");

  const [activeConversationKey, setActiveConversationKey] = useState<
    string | null
  >(null);

  const splitConversationKey = (key: string): [ConversationId, AdId] => {
    const parts = key.split("-");
    return [Number(parts[0]), Number(parts[1])];
  };

  useEffect(() => {
    fetch(
      `${BASE_URL}/api/list_conversations?user_phone=${user_phone}&user_type=${user_type}`
    )
      .then((response) => {
        console.log("Raw API Response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("Parsed Conversations Data: ", data);
        setConversations(data.conversations);
      })
      .catch((error) => {
        console.error("There was an error fetching the conversations", error);
      });
  }, []);

  useEffect(() => {
    if (activeConversationKey) {
      const [activeId, activeAdId] = splitConversationKey(
        activeConversationKey
      );
      const activeConversation = conversations.find(
        (conv) => conv.conversation_id === activeId && conv.ad_id === activeAdId
      );
      if (activeConversation) {
        console.log("Active Conversation: ", activeConversation);
        setRecipientId(activeConversation.other_user_phone);
        console.log("Set Recipient ID: ", activeConversation.other_user_phone);
      }
    }
  }, [activeConversationKey, conversations]);

  return (
    <div className="flex h-screen">
      <div style={{ flex: 1 }}>
        <ChatMessageHub
          conversations={conversations}
          setActiveConversationKey={setActiveConversationKey}
          activeConversationKey={activeConversationKey}
        />
      </div>
      <div style={{ flex: 2 }}>
        <ChatConversation
          activeConversationKey={activeConversationKey}
          loggedInUser_phone={user_phone}
          recipientId={recipientId}
          conversations={conversations}
        />
      </div>
    </div>
  );
};

export default ChatPage;
