//Context APi helps to manage the state of our app.
//It helps to put the state at the top, so that we can fetch the
// state directly from one single place.
// It createsone single source of truth for our state.

import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

//ChatProvider will wrap whole of our app,we create its children==app

const ChatProvider = ({ children }) => {
  //accessible to whole app anywheere, these states
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);

  const navigate = useNavigate();

  // By using useEffect() Hook, you tell React that your component needs to do something after render.
  // React will remember the function you passed(we'll refer to it as our “effect”),
  //  and call it later after performing the DOM updates.

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setUser(userInfo);

    //if user is not logged in ,push him to homepage
    if (!userInfo) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
