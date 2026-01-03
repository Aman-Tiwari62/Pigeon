import { useState } from "react";
import { requestOtp } from "../../api/auth.api";
import { useNavigate, Link } from "react-router-dom";

import { Box, Heading, FormControl, FormLabel, Input, FormHelperText, Button, Flex, Text } from "@chakra-ui/react";

const EmailInput = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate =useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const res = await requestOtp(email);
      localStorage.setItem("registerEmail", email);
      localStorage.setItem("resendAvailableAt", res.data.resendAvailableAt);
      setMessage(res.data.message);

      navigate("/register/verifyOtp");
      
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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
        Enter your email
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
          loadingText="Sending OTP"
        >
          Send OTP
        </Button>
        <Text textAlign={'center'} my={'10px'}>Already have an account?</Text>
        <Text color={'blue.300'} textAlign={'center'}><Link to="/login">Login</Link></Text>
      </form>
    </Box>
    
  );
  
};

export default EmailInput;

