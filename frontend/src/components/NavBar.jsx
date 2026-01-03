import { Box, Flex, Text, HStack, Avatar } from '@chakra-ui/react'
import React from 'react'
import { BsChatLeftTextFill } from "react-icons/bs";
import { IoMdSearch } from "react-icons/io";
import { useColorModeValue } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

const NavBar = ({user}) => {
  console.log(user.profilePhoto)
  console.log(user.username)
  return (
    <Flex h={'100%'} w={'100px'}  direction={'column'} alignItems={'center'} gap={'35px'} py={'30px'} bg={useColorModeValue('gray.200', 'gray.900')}>
        <NavLink to={'/user/dashboard/profile'}>
          <Avatar
            size="lg"
            src={user.profilePhoto}
            name={user.username}
            mr={3}
          />
        </NavLink>

        <NavLink to={'/user/dashboard/chat'}>
        <BsChatLeftTextFill size={'30px'}/>
        </NavLink>

        <NavLink to={'/user/dashboard/search'}>
        <IoMdSearch size={'30px'}/>
        </NavLink>
        
    </Flex>
  )
}

export default NavBar
