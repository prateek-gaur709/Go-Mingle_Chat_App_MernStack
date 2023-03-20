import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const handleSearch = async (value) => {
    setSearch(value);
    console.log(value);

    if (!value) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Search Error Occurred!!',
        status: 'error',
        description: 'Failed to load search results!! ',
        duration: 5000,
        position: 'bottom-left',
        isClosable: true,
      });
      return;
    }
  };

  const addToSelectedUsers = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: 'User Already Present!!',
        status: 'error',
        duration: 5000,
        position: 'bottom-left',
        isClosable: true,
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (user) => {
    setSelectedUsers(selectedUsers.filter((e) => e._id !== user._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: 'Pls enter all the fields !',
        status: 'error',
        duration: 5000,
        position: 'bottom-left',
        isClosable: true,
      });
      return;
    }
    //post request so json format me bhejna pdega
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        '/api/chat/group',
        {
          chatName: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]); // data pehle islie ki vo top pr aaye chats me..
      onClose(); //close the modal
      toast({
        title: 'New Group Chat Created!!',
        status: 'success',
        duration: 5000,
        position: 'bottom-center',
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to create Group Chat!',
        status: 'error',
        description: 'Failed to create Group Chat !! ',
        duration: 5000,
        position: 'bottom-center',
        isClosable: true,
      });
      return;
    }
  };

  return (
    <>
      <Button
        display='flex'
        fontSize={{ base: '17px', md: '10px', lg: '17px' }}
        rightIcon={<AddIcon />}
        onClick={onOpen}
      >
        New Group Chat
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='35px'
            fontFamily='Work sans'
            display='flex'
            justifyContent='center'
          >
            Create Group Chat{' '}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Input
                placeholder='Chat Name'
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <Input
                placeholder='Users eg. John, Prateek, Harry'
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {/* render selected users -- e=user */}

            <Box display='flex' w='100%' flexWrap='wrap'>
              {selectedUsers?.map((e) => (
                <UserBadgeItem
                  key={e._id}
                  user={e}
                  handleFunction={() => handleDelete(e)}
                />
              ))}
            </Box>

            {/* render searched users  */}
            {loading ? (
              <Spinner mt={2} />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((e, i) => (
                  <UserListItem
                    key={i}
                    user={e}
                    handleFunction={() => addToSelectedUsers(e)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Group Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
