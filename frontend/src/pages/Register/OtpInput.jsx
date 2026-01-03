import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "../../api/auth.api";
import { Box, Heading, FormControl, FormLabel, Input, FormHelperText, Button, Flex, Text, VStack } from "@chakra-ui/react";

const OtpInput = () => {

  const email = localStorage.getItem("registerEmail");
  const resendAt = localStorage.getItem("resendAvailableAt");
  const remaining = Math.max(
    Math.ceil((resendAt - Date.now()) / 1000),
    0
  );
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(remaining);
  const [canResend, setCanResend] = useState(false);
  
  // countdown timer:
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(()=>{
    if (!email) {
      navigate("/register/emailInput");
    };
  }, [email, navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const res = await verifyOtp(email, otp);

      setMessage(res.data.message);

      // Next step: username + password page
      navigate("/register/complete");
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setMessage("");
      setOtp("");

      const res = await resendOtp(email);
      const newResendAt = res.data.resendAvailableAt;
      localStorage.setItem("resendAvailableAt", newResendAt);
      const newRemaining = Math.max(
        Math.ceil((newResendAt - Date.now()) / 1000),0
      );
      setTimer(newRemaining);
      setMessage(res.data.message);
      setCanResend(false);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditEmail = () => {
    localStorage.removeItem("registerEmail");
    navigate("/register");
  };


  // return (
  //   <div>
  //     <h2>Enter OTP:</h2>
  //     <p>An email has been sent to your email: {email}</p>

  //     <form onSubmit={handleVerifyOtp}>
  //       <input
  //         type="text"
  //         placeholder="OTP"
  //         value={otp}
  //         onChange={(e) => setOtp(e.target.value)}
  //         maxLength={6}
  //       />

  //       <button type="submit" disabled={loading}>
  //         {loading ? "verifying..." : "verify"}
  //       </button>
  //     </form>

  //     <Link to="/register/emailInput">
  //       <button>edit email</button>
  //     </Link>
  //       <button onClick={handleResendOtp} disabled={!canResend || loading}>resend otp</button>
  //       <p>resend activates in : {timer}</p>
  //     {message && <p>{message}</p>}
  //   </div>
  // )
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
      <Heading size="lg" textAlign="center" mb="2">
        Enter OTP
      </Heading>
  
      <Text textAlign="center" color="gray.600" mb="6">
        An email has been sent to <strong>{email}</strong>
      </Text>
  
      <form onSubmit={handleVerifyOtp}>
        <FormControl isRequired>
          <FormLabel>OTP</FormLabel>
  
          <Input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            textAlign="center"
            letterSpacing="0.4em"
            fontSize="xl"
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
          loadingText="Verifying"
        >
          Verify OTP
        </Button>
      </form>
  
      <VStack spacing="3" mt="6">
        <Link to="/register/emailInput">
          <Button variant="link" colorScheme="blue">
            Edit email
          </Button>
        </Link>
  
        <Button
          size="sm"
          variant="outline"
          colorScheme="blue"
          onClick={handleResendOtp}
          isDisabled={!canResend || loading}
        >
          Resend OTP
        </Button>
  
        <Text fontSize="sm" color="gray.500">
          Resend activates in: {timer}s
        </Text>
      </VStack>
    </Box>
  );
  

}

export default OtpInput
