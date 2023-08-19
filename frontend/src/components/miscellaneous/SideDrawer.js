import {
  Avatar,
  Box,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import { ChatState } from '../../Context/ChatProvider';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';
import { getSender } from '../../config/ChatLogics';

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';

import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleSearch = async () => {
    // console.log(search);
    if (!search) {
      toast({
        title: 'Pls enter something to search..',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

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

  const accessChat = async (userId) => {
    //chat accessing
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      //since it is apost request.So, 'Content-type': 'application/json',
      //now making an api request- creating a new chat
      const { data } = await axios.post('/api/chat', { userId }, config);

      //if chat already exist, append data to it.
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: 'Error Occurred in creating the chats!!',
        description: error.message,
        status: 'Error',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }
  };
  return (
    <Box
      display='flex'
      w='100%'
      justifyContent='space-between'
      alignItems='center'
      bg='white'
      borderWidth='5px'
      p='5px 10px 5px 10px'
    >
      <Tooltip label='Search Users to Chat ' hasArrow placement='bottom-end'>
        <Button variant='ghostcd ' onClick={onOpen}>
          <i className='fa-solid fa-magnifying-glass'></i>
          {/* <Search2Icon /> */}
          <Text display={{ base: 'none', md: 'flex' }} px={4}>
            Search User
          </Text>
        </Button>
      </Tooltip>

      <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'> Search Users </DrawerHeader>

          <DrawerBody>
            <Box display='flex' pb={2}>
              <Input
                placeholder='Search by name or email...'
                mr={2}
                defaultValue={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant='outline' mr={3} onClick={handleSearch}>
                Go
              </Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user, idx) => (
                <UserListItem
                  key={idx}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}

            {loadingChat && (
              <Spinner
                thickness='20px'
                speed='0.25s'
                color='teal.500'
                size='xl'
              />
            )}
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Text fontSize='2xl' fontFamily='Work sans'>
        Talk-A-Little
      </Text>

      <div>
        <Menu>
          <MenuButton p={1}>
            <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
            />
            <BellIcon fontSize='2xl' m={1} />
          </MenuButton>
          <MenuList pl={2}>
            {!notification.length && 'No New Messages'}
            {notification.map((notif) => (
              <MenuItem
                key={notif._id}
                onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n) => n !== notif));
                }}
              >
                {notif.chat.isGroupChat
                  ? `New Message in ${notif.chat.chatName}`
                  : `New Message from ${getSender(user, notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar
              name={user.name}
              src={user.pic}
              cursor='pointer'
              size='sm'
            />
          </MenuButton>

          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>

            <MenuDivider />

            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Box>
  );
};

export default SideDrawer;
