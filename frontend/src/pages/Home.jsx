import { Link } from "react-router-dom";
import { Box, Button, Heading, Flex, Text } from "@chakra-ui/react";
import ThemeToggle from "../components/ThemeToggle";

const Home = () => { 
  return (
        <Flex h={"100vh"} direction={'column'} justifyContent={'center'} alignItems={'center'} gap={'20px'}>
          {/* <Flex justifyContent={'flex-end'}><ThemeToggle/></Flex> */}
          <Heading as={'h1'}>Pigeon Chat App</Heading>
          <Flex w={'50%'} gap={'10px'} justifyContent={'center'}>
            <Link to="/login"> <Button colorScheme="blue">Login</Button> </Link> <br />
            <Link to="/register/emailInput"><Button colorScheme="blue">Register</Button> </Link> 
          </Flex>
        
        </Flex>
  ); 
};
export default Home;



