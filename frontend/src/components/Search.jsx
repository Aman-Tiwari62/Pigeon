

import {
  Box,
  Flex,
  Input,
  Avatar,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import React, { useState, useEffect } from "react";
import { searchUsers } from "../api/protected.api";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);


  const cardBg = useColorModeValue("gray.100", "gray.700");
  const hoverBg = useColorModeValue("gray.200", "gray.600");

  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await searchUsers(query);
        setUsers(res.data.users);
      } catch (err) {
        console.error(err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);



  return (
    <Flex
      direction="column"
      align="center"
      minH="100vh"
      pt="80px"
    >
      {/* Search Input */}
      <Input
        placeholder="Search users by username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        maxW="500px"
        size="lg"
        borderRadius="full"
        bg={useColorModeValue("white", "gray.800")}
        boxShadow="md"
      />

      {/* Search Results */}
      <Box
        w="100%"
        maxW="500px"
        mt={4}
        maxH="300px"
        overflowY="auto"
      >
        <VStack spacing={2} align="stretch">
          {users.map((user) => (
            <Flex
              key={user._id}
              align="center"
              p={3}
              bg={cardBg}
              borderRadius="lg"
              cursor="pointer"
              _hover={{ bg: hoverBg }}
              transition="background 0.2s"
              onClick={() => navigate(`profile/${user.username}`)}
            >
              <Avatar
                size="sm"
                src={user.profilePhoto}
                name={user.username}
                mr={3}
              />
              <Text fontWeight="medium">
                {user.username}
              </Text>
            </Flex>
          ))}

          {/* No results */}
          {query && users.length === 0 && (
            <Text
              textAlign="center"
              fontSize="sm"
              color="gray.500"
            >
              No users found
            </Text>
          )}
        </VStack>
      </Box>
    </Flex>
  );
};

export default Search;

