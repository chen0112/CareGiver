import React, { useEffect, useRef, useState } from "react";
import ChatMessageHub from "../ChatMessageHub/ChatMessageHub";
import ChatConversation from "../ChatConversation/ChatConversation";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../../../types/Constant";
import useUserOnlineStore from "../../StateOnlineStore/StateOnlineStore";

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

        // Call the checkUserStatuses function right after setting conversations
        checkUserStatuses(data.conversations);
      })
      .catch((error) => {
        console.error("There was an error fetching the conversations", error);
      });

    const checkUserStatuses = (updatedConversations: Conversation[]) => {
      const otherUsersData = {
        phone_numbers: updatedConversations.map(
          (conv) => conv.other_user_phone
        ),
      };

      console.log("phone_numbers list:", otherUsersData);

      fetch(`${BASE_URL}/api/usersstatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(otherUsersData),
      })
        .then((response) => response.json())
        .then((data) => {
          setIsUserOnline2(data);
          console.log("user status data:", data);
        })
        .catch((error) => {
          console.error("Error fetching user statuses", error);
        });
    };
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

  const startTime = useRef(Date.now());

  useEffect(() => {
    const checkUserStatusesInterval = () => {
      const otherUsersData = {
        phone_numbers: conversations.map((conv) => conv.other_user_phone),
      };

      console.log("phone_numbers list:", otherUsersData);

      fetch(`${BASE_URL}/api/usersstatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(otherUsersData),
      })
        .then((response) => response.json())
        .then((data) => {
          setIsUserOnline2(data);
          console.log("user status data:", data);
        })
        .catch((error) => {
          console.error("Error fetching user statuses", error);
        });
    };

    const intervalId = setInterval(() => {
      if (Date.now() - startTime.current < 30 * 60 * 1000) {
        // 30 minutes
        checkUserStatusesInterval();
      } else {
        clearInterval(intervalId);
      }
    }, 60000); // every 1 minute

    return () => {
      clearInterval(intervalId); // Clear the interval when the component is unmounted
    };
  }, [conversations]);

  const { isUserOnline, setIsUserOnline } = useUserOnlineStore();

  const [isUserOnline2, setIsUserOnline2] = useState({});

  return (
    <div className="flex h-screen">
      <div style={{ flex: 1 }}>
        <ChatMessageHub
          conversations={conversations}
          setActiveConversationKey={setActiveConversationKey}
          activeConversationKey={activeConversationKey}
          isUserOnline={isUserOnline2}
        />
      </div>
      <div style={{ flex: 2 }}>
        <ChatConversation
          activeConversationKey={activeConversationKey}
          loggedInUser_phone={user_phone}
          recipientId={recipientId}
          conversations={conversations}
          isUserOnline={isUserOnline}
          setIsUserOnline={setIsUserOnline}
        />
      </div>
    </div>
  );
};

export default ChatPage;
