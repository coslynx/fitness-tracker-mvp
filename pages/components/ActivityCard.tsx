"use client";

import {
  Box,
  Flex,
  Heading,
  Text,
  HStack,
  VStack,
  Spacer,
  Tooltip,
  IconButton,
  useColorModeValue,
  Link,
  Skeleton,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
  ViewIcon,
  CalendarIcon,
  ArrowForwardIcon,
} from "@chakra-ui/icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store";
import { Activity } from "@/types";
import { formatDate } from "@/utils/helpers";

interface ActivityCardProps {
  activity: Activity;
  onDelete?: (activityId: number) => void;
}

export default function ActivityCard({
  activity,
  onDelete,
}: ActivityCardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { updateActivity, deleteActivity } = useStore();

  const bg = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("gray.800", "white");

  const handleEditActivity = () => {
    router.push(`/activities/${activity.id}`);
  };

  const handleDeleteActivity = async () => {
    if (
      confirm(
        "Are you sure you want to delete this activity? This action cannot be undone."
      )
    ) {
      await deleteActivity(activity.id);
      onDelete?.(activity.id);
    }
  };

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bg}
      boxShadow="md"
      cursor="pointer"
      onClick={handleEditActivity}
    >
      <Box p="6">
        <Heading as="h3" size="md" color={color}>
          {activity.type}
        </Heading>
        <HStack spacing="4" mt="2">
          <VStack alignItems="start">
            <Text fontSize="sm" color={color}>
              Duration: {activity.duration} minutes
            </Text>
            <Text fontSize="sm" color={color}>
              Calories Burned: {activity.calories}
            </Text>
          </VStack>
          <Spacer />
          <Tooltip label="View Details">
            <IconButton
              as={Link}
              href={`/activities/${activity.id}`}
              variant="ghost"
              aria-label="View Details"
              icon={<ViewIcon />}
            />
          </Tooltip>
        </HStack>
      </Box>
      <Box p="6" bg={useColorModeValue("gray.100", "gray.700")}>
        <HStack spacing="4">
          <CalendarIcon color={color} />
          <Text fontSize="sm" color={color}>
            {formatDate(activity.date)}
          </Text>
          <Spacer />
          {onDelete && (
            <Tooltip label="Delete Activity">
              <IconButton
                onClick={handleDeleteActivity}
                variant="ghost"
                aria-label="Delete Activity"
                icon={<DeleteIcon />}
              />
            </Tooltip>
          )}
        </HStack>
      </Box>
    </Box>
  );
}