import { AddIcon } from '@chakra-ui/icons';
import { Box, Stack, Text } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getSender } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';
import ChatLoading from './ChatLoading';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  //when we come to this page, we are supposed to fetch all of the chats
  //of the user.(/api/chat) - get req in backend
  //lets make an api call to fetch all the chats

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get('/api/chat', config);
      setChats(data);
      // console.log(data);
    } catch (error) {
      toast({
        title: 'Error Occurred!!',
        description: 'Failed to Load the chats',
        status: 'Error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir='column'
      alignItems='center'
      p={3}
      bg='white'
      w={{ base: '100%', md: '31%' }}
      borderRadius='lg'
      borderWidth='1px'
    >
      <Box
        display='flex'
        pb={3}
        px={3}
        // bg='blue'
        borderRadius='lg'
        fontFamily='Work sans'
        fontSize={{ base: '28px', md: '30px' }}
        w='100%'
        justifyContent='space-between'
        alignItems='center'
      >
        <Text>My Chats </Text>
        <GroupChatModal>
          <Button
            display='flex'
            fontSize={{ base: '17px', md: '10px', lg: '17px' }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display='flex'
        flexDir='column'
        p={3}
        bg='#F8F8F8'
        w='100%'
        h='100%'
        borderRadius='lg'
        overflowY='hidden'
      >
        {/* //chats array se individual chat map krna h box me */}
        {chats ? (
          <Stack overflowY='scroll'>
            {chats.map((chat, idx) => (
              <Box
                key={idx}
                onClick={() => setSelectedChat(chat)}
                bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                cursor='pointer'
                px={3}
                py={2}
                borderRadius='lg'
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize='xs'>
                    <b>
                      {chat.latestMessage.sender.name === user.name
                        ? 'You : '
                        : `${chat.latestMessage.sender.name} : `}
                    </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + '...'
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
