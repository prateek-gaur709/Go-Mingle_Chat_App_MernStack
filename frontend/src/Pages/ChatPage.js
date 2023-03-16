import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import MyChats from '../components/miscellaneous/MyChats';
import ChatBox from '../components/miscellaneous/ChatBox';
import SideDrawer from '../components/miscellaneous/SideDrawer';

const ChatPage = () => {
  const { user } = ChatState();

  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}
      <Box
        display='flex'
        justifyContent='space-between'
        w='100%'
        h='91.5vh'
        p='10px'
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatPage;
