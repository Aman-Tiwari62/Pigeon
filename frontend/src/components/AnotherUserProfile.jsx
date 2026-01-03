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
import React from 'react'
import { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import { fetchUser } from "../api/protected.api";
import { checkFollowing, followUser, unfollowUser } from "../api/protected.api";

const AnotherUserProfile = () => {
    const anotherUsername = useParams().username;
    const [anotherUser, setAnotherUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);


    useEffect(() => {
      async function fetchProfile() {
        try {
          setLoading(true);
    
          const res = await fetchUser(anotherUsername);
          setAnotherUser(res.data.user);
    
          const followRes = await checkFollowing(res.data.user._id);
          setIsFollowing(followRes.data.isFollowing);
    
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    
      fetchProfile();
    }, [anotherUsername]);
    

    async function handleFollowToggle() {
      try {
        setFollowLoading(true);
    
        if (isFollowing) {
          await unfollowUser(anotherUser._id);
          setIsFollowing(false);
    
          setAnotherUser(prev => ({
            ...prev,
            followersCount: prev.followersCount - 1,
          }));
        } else {
          await followUser(anotherUser._id);
          setIsFollowing(true);
    
          setAnotherUser(prev => ({
            ...prev,
            followersCount: prev.followersCount + 1,
          }));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setFollowLoading(false);
      }
    }
    

  return (
    <Flex minH="100%"   >
        {anotherUser && (
          <VStack spacing={6} py={'10px'} w="100%" maxW="800px" mx="auto" >
  
          <HStack w={'100%'} p={6} gap={'50px'} justifyContent={'center'} shadow={'0px 0px 2px'}>
              <Avatar alignItems={'center'}
                size="2xl"
                name={anotherUsername}
                src={anotherUser.profilePhoto}
              />
      
              {/* Change Photo */}
              <VStack>
                <Heading as={'h1'}>{anotherUsername}</Heading>
                <HStack spacing={10}  w={'100%'} justifyContent={'center'} gap={'50px'}>
                  <VStack cursor={'pointer'}>
                    <Text fontWeight="bold">{anotherUser.followersCount}</Text>
                    <Text fontSize="sm">Followers</Text>
                  </VStack>
        
                  <VStack cursor={'pointer'}>
                    <Text fontWeight="bold">{anotherUser.followingCount}</Text>
                    <Text fontSize="sm">Following</Text>
                  </VStack>
                </HStack>
              </VStack>
          </HStack>
          
          <HStack>
          <Button
            colorScheme={isFollowing ? "gray" : "blue"}
            onClick={handleFollowToggle}
            isLoading={followLoading}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>

            <Button colorScheme="blue">Message</Button>
          </HStack>
        
  
  
        </VStack>
        )}
    </Flex>
  )
}

export default AnotherUserProfile

  