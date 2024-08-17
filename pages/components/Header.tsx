"use client";

import {
  Flex,
  Box,
  Text,
  Link,
  HStack,
  Button,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorMode,
  Spacer,
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useToast,
} from "@chakra-ui/react";
import {
  SunIcon,
  MoonIcon,
  HamburgerIcon,
  AddIcon,
  LogoutIcon,
  UserIcon,
} from "@chakra-ui/icons";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useStore } from "@/store";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const { goals, activities } = useStore();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout Successful",
        description: "You have been successfully logged out.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/login");
    } catch (error) {
      console.error("Error logging out user:", error);
      toast({
        title: "Logout Error",
        description: "An error occurred during logout. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      as="header"
      bg={useColorModeValue("white", "gray.800")}
      py={4}
      px={8}
      alignItems="center"
      justifyContent="space-between"
      boxShadow="md"
    >
      <Flex alignItems="center">
        <Link href="/" className="text-xl font-bold">
          Fitness Goal Tracker
        </Link>
      </Flex>

      <Flex alignItems="center">
        {status === "loading" && <Text>Loading...</Text>}

        {status === "authenticated" && (
          <Flex alignItems="center" gap={4}>
            <Button
              onClick={onOpen}
              variant="ghost"
              aria-label="Open Menu"
              icon={<HamburgerIcon />}
            />
            <Drawer
              isOpen={isOpen}
              placement="right"
              onClose={onClose}
              size="sm"
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerHeader
                  bg={useColorModeValue("gray.100", "gray.800")}
                  borderColor="gray.200"
                >
                  <HStack spacing="2">
                    <Text
                      fontWeight="bold"
                      fontSize="lg"
                      color={useColorModeValue("gray.800", "white")}
                    >
                      Menu
                    </Text>
                  </HStack>
                </DrawerHeader>
                <DrawerBody>
                  <HStack spacing={4} alignItems="center">
                    <UserIcon />
                    <Text>
                      {session.user.email || "Logged In"}
                    </Text>
                  </HStack>
                  <Link href="/">Home</Link>
                  <Link href="/goals">Goals</Link>
                  <Link href="/activities">Activities</Link>
                  <Link href="/profile">Profile</Link>
                  <HStack
                    spacing={4}
                    alignItems="center"
                    onClick={handleLogout}
                  >
                    <LogoutIcon />
                    <Text>Logout</Text>
                  </HStack>
                </DrawerBody>

                <DrawerFooter
                  bg={useColorModeValue("gray.100", "gray.800")}
                  borderColor="gray.200"
                >
                  <Button
                    variant="outline"
                    onClick={onClose}
                    ml={3}
                    color={useColorModeValue("gray.800", "white")}
                  >
                    Close
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                aria-label="Open Menu"
                icon={<AddIcon />}
              />
              <MenuList>
                <MenuItem onClick={() => router.push("/goals/new")}>
                  Add New Goal
                </MenuItem>
                <MenuItem onClick={() => router.push("/activities/new")}>
                  Log Activity
                </MenuItem>
              </MenuList>
            </Menu>

            <Tooltip label={colorMode === "light" ? "Dark Mode" : "Light Mode"}>
              <IconButton
                aria-label="Toggle color mode"
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
              />
            </Tooltip>
          </Flex>
        )}

        {status === "unauthenticated" && (
          <Flex alignItems="center" gap={4}>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}