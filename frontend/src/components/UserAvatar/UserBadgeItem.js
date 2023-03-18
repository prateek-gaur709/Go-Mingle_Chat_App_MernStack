import { CloseIcon } from '@chakra-ui/icons';
import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react';

const UserBadgeItem = (props) => {
  return (
    <Box
      display='flex'
      borderRadius='lg'
      px={2}
      py={1}
      m={1}
      mb={2}
      variant='solid'
      fontSize={12}
      backgroundColor='purple'
      color='white'
    >
      <Avatar
        src={props.user.pic}
        size='xs'
        mr={2}
        name={props.user.name}
        cursor='pointer'
      />
      <Text mr={2}>{props.user.name}</Text>
      <CloseIcon
        pl={1}
        pt={1}
        cursor='pointer'
        onClick={props.handleFunction}
      />
    </Box>
  );
};

export default UserBadgeItem;
