import React, { useState } from 'react'
import { completeRegistration } from '../../api/auth.api';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, FormControl, FormLabel, Input, FormHelperText, Button, Flex, Text, VStack } from "@chakra-ui/react";

const CompleteRegistration = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  async function  handleSubmit(e){
    e.preventDefault();
    try{
      setLoading(true);
      setMessage("");

      const res = await completeRegistration(username, password);
      setMessage(res.data.message);
      navigate('/register/profileUpload', { replace: true });
    }catch(error){
      setMessage(
        error.response?.data?.message || "Something went wrong"
      );
    }finally{
      setLoading(false);
    }
  }
  return (
    <Box
      maxW="420px"
      mx="auto"
      mt="100px"
      p="6"
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
    >
      <Heading size="lg" textAlign="center" mb="6">
        Set your username & password
      </Heading>
  
      <form onSubmit={handleSubmit}>
        <VStack spacing="4">
          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Choose a username"
              value={username}
              minLength={2}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
  
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Create a password"
              value={password}
              minLength={3}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
  
          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={loading}
            loadingText="Creating account"
          >
            Submit
          </Button>
        </VStack>
      </form>
  
      {message && (
        <Text
          mt="4"
          textAlign="center"
          color="gray.600"
        >
          {message}
        </Text>
      )}
    </Box>
  );
  
}

export default CompleteRegistration
