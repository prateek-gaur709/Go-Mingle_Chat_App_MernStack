import { Box, IconButton } from '@chakra-ui/react';
import React from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { ViewIcon } from '@chakra-ui/icons';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      w={{ base: '100%', md: '68%' }}
      bg='white'
      p={3}
      borderRadius='lg'
      borderWidth='1px'
      flexDir='column'
      alignItems='center'
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
