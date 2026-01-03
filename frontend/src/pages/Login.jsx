import React, { useState } from 'react'
import { loginRequest } from '../api/auth.api';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Heading, FormControl, FormLabel, Input, FormHelperText, Button, Flex, Text } from "@chakra-ui/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    try{
      setLoading(true);
      setMessage("");

      const res = await loginRequest(email,password);

      setMessage(res.data.message);
      navigate('/user/dashboard/chat', { replace: true });
    }catch(error){
      setMessage(
        error.response?.data?.message || "Something went wrong"
      );
    }
    finally{
      setLoading(false);
    }
  }

  return (
    // <div>
    //   <h1>Login page</h1>
    //   <form onSubmit={handleSubmit}>
    //       <input 
    //         type="email"
    //         placeholder='email'
    //         value={email}
    //         onChange={(e)=>{setEmail(e.target.value)}}
    //       />
    //       <input 
    //         type="text"
    //         placeholder='password'
    //         value={password}
    //         onChange={(e)=>{setPassword(e.target.value)}}
    //       />
    //       <button type='submit'>Login</button>
    //   </form>
    //   {message}
    // </div>
    <Box
      maxW="400px"
      mx="auto"
      mt="100px"
      p="6"
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
    >
      <Heading as="h1" size="lg" mb="6" textAlign="center">
        Enter your credentials:
      </Heading>
  
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Email address</FormLabel>
  
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormLabel>Password</FormLabel>
  
          <Input
            type="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
  
          {message && (
            <FormHelperText mt="2">
              {message}
            </FormHelperText>
          )}
        </FormControl>
  
        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          mt="6"
          isLoading={loading}
          loadingText="Login..."
        >
          Login
        </Button>
        <Text textAlign={'center'} my={'10px'}>New user?</Text>
        <Text color={'blue.300'} textAlign={'center'}><Link to="/register/emailInput">Register</Link></Text>
      </form>
    </Box>
  )
}

export default Login
