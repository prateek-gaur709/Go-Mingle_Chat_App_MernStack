import { Box } from '@chakra-ui/layout';
import { ChatState } from '../Context/ChatProvider';
import SingleChat from './SingleChat';
import './styles.css';

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
      flexDirection='column'
      alignItems='center'
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
