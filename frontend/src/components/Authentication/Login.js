import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChatState } from '../../Context/ChatProvider';

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const navigate = useNavigate();
  const { setUser } = ChatState();
  const toast = useToast();

  const handleClick = () => setShow(!show);

  const handleLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      setLoading(false);
      toast({
        title: 'Pls enter all the * marked fields!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    //else match the data from mongodb database and auth login
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/user/login',
        { email, password },
        config
      );

      toast({
        title: 'Login Successful !!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/chats');
    } catch (error) {
      toast({
        title: 'Error Occurred!!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };

  return (
    <VStack>
      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type='email'
          value={email}
          placeholder='abc@xyz.com'
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id='password' style={{ marginBottom: '10px' }} isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            value={password}
            placeholder='Enter password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement>
            <Button onClick={handleClick}>{show ? 'Hide' : 'Show'}</Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        width='100%'
        color='white'
        colorScheme='blue'
        isLoading={loading}
        onClick={handleLogin}
      >
        Login
      </Button>

      <Button
        width='100%'
        color='white'
        colorScheme='red'
        isLoading={loading1}
        onClick={() => {
          setLoading1(true);
          setEmail('guest@example.com');
          setPassword('123456');
          setLoading1(false);
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
