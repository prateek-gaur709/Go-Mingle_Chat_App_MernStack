import { Stack } from '@chakra-ui/layout';
import { Skeleton } from '@chakra-ui/skeleton';

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton startColor='blue.500' endColor='red.500' height='45px' />
      <Skeleton startColor='blue.500' endColor='red.500' height='45px' />
      <Skeleton startColor='blue.500' endColor='red.500' height='45px' />
      <Skeleton startColor='blue.500' endColor='red.500' height='45px' />
      <Skeleton startColor='blue.500' endColor='red.500' height='45px' />
      <Skeleton startColor='blue.500' endColor='red.500' height='45px' />
      <Skeleton startColor='blue.500' endColor='red.500' height='45px' />
      <Skeleton startColor='blue.500' endColor='red.500' height='45px' />
      <Skeleton startColor='blue.500' endColor='red.500' height='45px' />
    </Stack>
  );
};

export default ChatLoading;
