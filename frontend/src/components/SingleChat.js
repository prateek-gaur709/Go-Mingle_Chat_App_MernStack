import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon, ViewIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import './styles.css';
import ScrollableChat from './ScrollableChat';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  let [messages, setMessages] = useState([]);
  let [loading, setLoading] = useState(false);
  let [newMessage, setNewMessage] = useState();

  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      setMessages([...messages, data]);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Failed to fetch the messages!',
        duration: 5000,
        status: 'error',
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  //if u want to use the updated state
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage(''); //put above , so that input box becomes empty instantly
        const { data } = await axios.post(
          '/api/message',
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        // console.log(data);

        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: 'Failed to send the message!',
          duration: 5000,
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        });
        // window.alert('Failed to send the message!');
        console.log(error.message);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    //typing indicator logic
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            display='flex'
            w='100%'
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            justifyContent={{ base: 'space-between' }}
            alignItems='center'
            fontFamily='Work sans'
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                  <ViewIcon />
                </ProfileModal>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>

          <Box
            display='flex'
            flexDir='column'
            justifyContent='flex-end'
            p={3}
            bg='#E8E8E8'
            w='100%'
            h='100%'
            borderRadius='lg'
            overflowY='hidden'
          >
            {/* message here    */}
            {messages.length === 0 ? (
              <>
                {console.log(`4 : `, messages.length)}
                <Spinner
                  size='lg'
                  color='teal'
                  thickness='4px'
                  speed='0.45s'
                  w={20}
                  h={20}
                  alignSelf='center'
                  margin='auto'
                />
              </>
            ) : (
              <div className='messages'>
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant='filled'
                bg='green.300'
                placeholder='Enter a message...'
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Text justifyContent='center' mt={250} fontSize='2xl'>
          Click on Chat to view the conversation!
        </Text>
      )}
    </>
  );
};

export default SingleChat;
