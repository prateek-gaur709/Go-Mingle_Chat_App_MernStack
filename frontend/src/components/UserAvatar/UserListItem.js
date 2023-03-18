import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react';
import { ChatState } from '../../Context/ChatProvider';

const UserListItem = (props) => {
  return (
    <div>
      <Box
        onClick={props.handleFunction}
        cursor='pointer'
        bg='#E8E8E8'
        _hover={{
          background: '#38B2AC',
          color: 'white',
        }}
        width='100%'
        display='flex'
        alignItems='center'
        color='black'
        px={3}
        py={2}
        mb={2}
        borderRadius='lg'
      >
        <Avatar
          name={props.user.name}
          src={props.user.pic}
          cursor='pointer'
          size='sm'
          mr={2}
        />
        <Box>
          <Text>{props.user.name}</Text>
          <Text fontSize='xs'>
            <b>Email : </b>
            {props.user.email}
          </Text>
        </Box>
      </Box>
    </div>
  );
};

export default UserListItem;
