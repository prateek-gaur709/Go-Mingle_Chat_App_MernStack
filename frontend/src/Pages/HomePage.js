import { useEffect } from 'react';
import {
  Container,
  Box,
  Text,
  Tabs,
  TabPanel,
  TabPanels,
  TabList,
  Tab,
} from '@chakra-ui/react';

import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
import { useNavigate } from 'react-router';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (userInfo) navigate('/chats');
  }, [navigate]);

  return (
    <Container maxW='xl' bg='rgba(47,167,202,255)' centerContent>
      <Box
        display='flex'
        justifyContent='center'
        p={3}
        bg='white'
        w='100% '
        m='40px 0 15px 0'
        borderRadius='lg'
        borderWidth='1px'
      >
        <Text
          fontSize='4xl'
          fontFamily='Labrada'
          color='black'
          fontWeight='bold'
        >
          🪶🪶 Go-Mingle 🪶🪶
        </Text>
      </Box>

      <Box bg='white' w='100% ' p={4} borderRadius='lg' borderWidth='1px'>
        <Tabs variant='soft-rounded' colorScheme='green' isFitted>
          <TabList mb='1em'>
            <Tab>Log In</Tab>
            <Tab>SignUp</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
