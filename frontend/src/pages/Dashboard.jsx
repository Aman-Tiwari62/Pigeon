import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Avatar } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import Search from "../components/Search";
import { useColorModeValue } from "@chakra-ui/react";
import { Outlet, Link } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/user",
          { withCredentials: true }
        );
        setUser(res.data.user);
      } catch (error) {
        console.log("Not authenticated");
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Flex h={'100vh'} justifyContent={'space-between'}>
      {/* <h1>Dashboard</h1> */}

      {user ? (
        <>
          <NavBar user={user}/>
          <Box flexGrow={'1'}>
              <Outlet context={{ user, setUser }} />
          </Box>
        </>
      ) : (
        <p>User not logged in</p>
      )}
    </Flex>
  );
};

export default Dashboard;

