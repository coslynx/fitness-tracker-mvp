"use client";

import { Box, Flex, Text, Link, useColorModeValue } from "@chakra-ui/react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaCopyright,
} from "react-icons/fa";

export default function Footer() {
  const bg = useColorModeValue("gray.100", "gray.700");
  const color = useColorModeValue("gray.700", "gray.200");

  return (
    <Box bg={bg} color={color} py={6}>
      <Flex
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={6}
      >
        <Text fontSize="sm">
          &copy; {new Date().getFullYear()} Fitness Goal Tracker. All Rights
          Reserved.
        </Text>
        <Flex gap={4}>
          <Link href="#" aria-label="Facebook">
            <FaFacebook />
          </Link>
          <Link href="#" aria-label="Twitter">
            <FaTwitter />
          </Link>
          <Link href="#" aria-label="Instagram">
            <FaInstagram />
          </Link>
          <Link href="#" aria-label="Github">
            <FaGithub />
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
}