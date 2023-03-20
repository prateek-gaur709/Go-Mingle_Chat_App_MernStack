import React, { useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user } = ChatState();

  const [groupChatName, setGroupChatName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();

  const handleRemove = async (user1) => {
    //only admin can remove users
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      //if logged in user is not group admin
      //2nd-cond for logged in user can remove himself by leaving gp btn
      toast({
        title: 'Only Admin can remove users !!',
        status: 'Error',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      setRenameLoading(false);
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        '/api/chat/removeFromGroup',
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      //if looged in user has removed himself , he should not see be able to see the chat
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);

      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Couldn't update ChatName!!",
        status: 'Error',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      setLoading(false);
      return;
    }
  };

  const handleRename = async () => {
    //corner case- no update required if there is no new groupChatName provided
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        '/api/chat/rename',
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      console.log(data);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Couldn't rename GroupChat!!",
        status: 'Error',
        description: error.response.data.message,
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      setRenameLoading(false);
      setGroupChatName('');
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      // toast({
      //   title: 'User Already present!!',
      //   status: 'Error',
      //   duration: 5000,
      //   isClosable: true,
      //   position: 'top-left',
      // });

      window.alert('User Already present!!');
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      // toast({
      //   title: 'Only Admin can add Users!!',
      //   status: 'Error',
      //   duration: 5000,
      //   isClosable: true,
      //   position: 'top-left',
      // });

      window.alert('Only Admin can add Users!!');
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        '/api/chat/addToGroup',
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Couldn't add User !!",
        status: 'Error',
        description: error.response.data.message,
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    // console.log(search);
    if (!query) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);

      // console.log(searchResult);
    } catch (error) {
      toast({
        title: 'Some Error Occurred!!',
        status: 'Error',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }
  };

  return (
    <>
      <IconButton
        icon={<ViewIcon />}
        display={{ base: 'flex' }}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='3xl'
            justifyContent='center'
            color='teal'
            fontFamily='Work Sans'
          >
            {selectedChat.chatName}
            <Text mt={2} justifyContent='space-between'>
              Admin : {selectedChat.groupAdmin.name}
            </Text>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Box w='100%' display='flex' flexWrap='wrap' pb={3}>
              {selectedChat.users.map((u, idx) => (
                <UserBadgeItem
                  key={idx}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>

            <FormControl display='flex'>
              <Input
                placeholder='Chat Name'
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                ml={2}
                variant='solid'
                background='teal'
                color='white'
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            <FormControl mt={2} pb={2}>
              <Input
                placeholder='Add User to Group'
                mr={2}
                mb={2}
                defaultValue={search}
                onChange={(e) => handleSearch(e.target.value)}
              />

              {loading ? (
                <Spinner size='lg' />
              ) : (
                searchResult?.map((user, idx) => (
                  <UserListItem
                    key={idx}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              background='red'
              color='white'
              mr={1}
              onClick={() => handleRemove(user)}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
