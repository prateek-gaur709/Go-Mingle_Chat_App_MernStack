import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';

const ChatPage = () => {
  const [chats, setChat] = useState([]);

  const fetchChats = async () => {
    // const { data } = await axios.get('http://localhost:5000/api/chat');
    // setChat(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div>
      {chats.map((chat) => {
        return <div key={chat._id}> {chat.chatName}</div>;
      })}
      Hello
    </div>
  );
};

export default ChatPage;
