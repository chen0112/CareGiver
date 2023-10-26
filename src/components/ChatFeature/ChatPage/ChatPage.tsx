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

const ChatPage: React.FC = () => {
  const [activeConversationId, setActiveConversationId] = useState<
    number | null
  >(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const user_phone = queryParams.get("loggedInUser");
  const user_type = queryParams.get("userType");

  useEffect(() => {
    fetch(`${BASE_URL}/api/list_conversations?user_phone=${user_phone}&user_type=${user_type}`)
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
    const activeConversation = conversations.find(
      (conv) => conv.conversation_id === activeConversationId
    );
    if (activeConversation) {
      console.log("Active Conversation: ", activeConversation);
      setRecipientId(activeConversation.other_user_phone);
      console.log("Set Recipient ID: ", activeConversation.other_user_phone);
    }
  }, [activeConversationId, conversations, user_phone]);

  return (
    <div className="flex h-screen">
      <div style={{ flex: 1 }}>
        <ChatMessageHub
          conversations={conversations}
          setActiveConversationId={setActiveConversationId}
          activeConversationId={activeConversationId}
        />
      </div>
      <div style={{ flex: 2 }}>
        <ChatConversation
          activeConversationId={activeConversationId}
          loggedInUser_phone={user_phone}
          recipientId={recipientId}
          conversations={conversations}
        />
      </div>
    </div>
  );
};

export default ChatPage;
