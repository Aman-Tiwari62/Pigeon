import {
    Box,
    Avatar,
    Button,
    Text,
    VStack,
    HStack,
    Heading,
    Flex,
  } from "@chakra-ui/react";
  import { useOutletContext } from "react-router-dom";
  import { useNavigate } from "react-router-dom";
  
  const Profile = () => {
    const { user , setUser} = useOutletContext();
    const navigate = useNavigate();
    function handleClick(){
        navigate('/user/dashboard/editProfile');
    }
  
    return (
      <Flex minH="100%"   >
        <VStack spacing={6} py={'10px'} w="100%" maxW="800px" mx="auto" >
  
          {/* Profile Photo */}
          <HStack w={'100%'} p={6} gap={'50px'} justifyContent={'center'} shadow={'0px 0px 2px'}>
          <Avatar alignItems={'center'}
            size="2xl"
            name={user.username}
            src={user.profilePhoto}
          />
  
          {/* Change Photo */}
          <VStack>
            <Heading as={'h1'}>{user.username}</Heading>
          <Button size="sm" colorScheme="blue" onClick={handleClick}>
            Change Profile Photo
          </Button>
          </VStack>
          </HStack>

  
          {/* Followers / Following */}
          <HStack spacing={10}  w={'100%'} justifyContent={'center'} gap={'100px'}>
            <VStack cursor={'pointer'}>
              <Text fontWeight="bold">{user.followersCount }</Text>
              <Text fontSize="sm">Followers</Text>
            </VStack>
  
            <VStack cursor={'pointer'}>
              <Text fontWeight="bold">{user.followingCount}</Text>
              <Text fontSize="sm">Following</Text>
            </VStack>
          </HStack>
  
        </VStack>
      </Flex>
    );
  };
  
  export default Profile;
  
