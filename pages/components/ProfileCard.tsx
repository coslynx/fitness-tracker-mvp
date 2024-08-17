"use client";

import {
  Box,
  Text,
  Flex,
  Avatar,
  useColorModeValue,
  Link,
  HStack,
  Spacer,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store";
import { User } from "@/types";

interface ProfileCardProps {
  user: User;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { updateGoal, deleteGoal } = useStore();

  const bg = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("gray.800", "white");

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      // Implement delete account logic here
      // ...
    }
  };

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bg}
    >
      <Box p="6">
        <Flex align="baseline">
          <Avatar
            src={user.imageUrl || "/profile-placeholder.png"}
            alt={user.name || "User"}
            mr={2}
            size="lg"
          />
          <Box>
            <Text
              fontWeight="semibold"
              as="h2"
              fontSize="lg"
              color={color}
            >
              {user.name || "User"}
            </Text>
            <Text fontSize="sm" color={color}>
              {user.email}
            </Text>
          </Box>
        </Flex>
      </Box>
      <Box p="6">
        <HStack spacing="4">
          <Tooltip label="Edit Profile">
            <IconButton
              onClick={handleEditProfile}
              as={Link}
              href="#"
              variant="ghost"
              aria-label="Edit Profile"
              icon={<EditIcon />}
            />
          </Tooltip>
          <Spacer />
          <Tooltip label="Delete Account">
            <IconButton
              onClick={handleDeleteAccount}
              as={Link}
              href="#"
              variant="ghost"
              aria-label="Delete Account"
              icon={<DeleteIcon />}
            />
          </Tooltip>
        </HStack>
      </Box>
    </Box>
  );
}