import React from 'react';
import {
  VStack,
  HStack,
  Radio,
  RadioGroup,
  Button,
  InputRightElement,
} from '@chakra-ui/react';
import { FormControl, FormLabel, Input, InputGroup } from '@chakra-ui/react';
import { useState } from 'react';

const Signup = () => {
  //some hooks
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPass, setConfirmPass] = useState();
  const [pic, setPic] = useState();

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const handleClick = () => setShow(!show);
  const handleClick1 = () => setShow1(!show1);

  const postDetails = (pics) => {};

  const submitHandler = () => {};

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

      <Button colorScheme='blue' onClick={submitHandler}>
        SignUp
      </Button>
    </VStack>
  );
};

export default Signup;
