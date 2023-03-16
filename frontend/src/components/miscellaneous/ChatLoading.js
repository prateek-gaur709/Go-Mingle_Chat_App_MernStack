import React from 'react';
import { Skeleton, Stack } from '@chakra-ui/react';

const ChatLoading = () => {
  return (
    <div>
      <Stack>
        <Skeleton startColor='blue.500' endColor='red.500' height='45px' />
        <Skeleton startColor='blue.500' endColor='red.500' height='45px' />
        <Skeleton startColor='blue.500' endColor='red.500' height='45px' />
        <Skeleton startColor='blue.500' endColor='red.500' height='45px' />
        <Skeleton startColor='blue.500' endColor='red.500' height='45px' />
        <Skeleton startColor='blue.500' endColor='red.500' height='45px' />
        <Skeleton startColor='blue.500' endColor='red.500' height='45px' />
      </Stack>
    </div>
  );
};

export default ChatLoading;
