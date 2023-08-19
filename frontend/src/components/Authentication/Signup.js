import axios from 'axios';

import { VStack, Button, InputRightElement, useToast } from '@chakra-ui/react';

import { FormControl, FormLabel, Input, InputGroup } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const Signup = () => {
  //some hooks or states
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPass, setConfirmPass] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const handleClick = () => setShow(!show);
  const handleClick1 = () => setShow1(!show1);

  const postDetails = (pics) => {
    setLoading(true);

    if (pics === undefined) {
      toast({
        title: 'Pls select an image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }

    if (
      pics.type === 'image/jpeg' ||
      pics.type === 'image/png' ||
      pics.type === 'image/jpg' ||
      pics.type === 'image/webp'
    ) {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'chat-app');
      data.append('cloud_name', 'prateekgaur');

      fetch('https://api.cloudinary.com/v1_1/prateekgaur/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: 'Only jpg/jpeg/webp/png files supported!! ',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPass) {
      setLoading(false);
      toast({
        title: 'Pls enter all the * marked fields!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });

      return;
    }

    if (password !== confirmPass) {
      setLoading(false);
      toast({
        title: 'Passwords don not match!!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }

    //else store the data in mongodb database
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/user',
        { name, email, password, pic },
        config
      );

      toast({
        title: 'Registration Successful !!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });

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
    <VStack spacing={4} align='stretch'>
      <FormControl id='name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type='string'
          placeholder='Enter your name'
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type='email'
          placeholder='abc@xyz.com'
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder='Enter password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement>
            <Button onClick={handleClick}>{show ? 'Hide' : 'Show'}</Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='cnf_password' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show1 ? 'text' : 'password'}
            placeholder='Enter password'
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <InputRightElement>
            <Button onClick={handleClick1}>{show1 ? 'Hide' : 'Show'}</Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='pic'>
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type='file'
          p={1.5}
          accept='image/*'
          onChange={(e) => {
            postDetails(e.target.files[0]);
          }}
        />
      </FormControl>

      <Button colorScheme='blue' onClick={submitHandler} isLoading={loading}>
        SignUp
      </Button>
    </VStack>
  );
};

export default Signup;
