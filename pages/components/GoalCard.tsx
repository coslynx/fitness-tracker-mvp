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
  Progress,
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
import { Goal } from "@/types";
import { formatDate } from "@/utils/helpers";

interface GoalCardProps {
  goal: Goal;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function GoalCard({
  goal,
  onEdit,
  onDelete,
}: GoalCardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { updateGoal, deleteGoal } = useStore();

  const bg = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("gray.800", "white");

  const handleEditGoal = () => {
    router.push(`/goals/${goal.id}`);
  };

  const handleDeleteGoal = async () => {
    if (
      confirm(
        "Are you sure you want to delete this goal? This action cannot be undone."
      )
    ) {
      await deleteGoal(goal.id);
      onDelete?.();
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
      onClick={handleEditGoal}
    >
      <Box p="6">
        <Heading as="h3" size="md" color={color}>
          {goal.name}
        </Heading>
        <HStack spacing="4" mt="2">
          <VStack alignItems="start">
            <Text fontSize="sm" color={color}>
              Target: {goal.target}
            </Text>
            <Text fontSize="sm" color={color}>
              Deadline: {formatDate(goal.deadline)}
            </Text>
          </VStack>
          <Spacer />
          <Tooltip label="View Details">
            <IconButton
              as={Link}
              href={`/goals/${goal.id}`}
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
            Progress: {goal.progress}%
          </Text>
          <Spacer />
          {onDelete && (
            <Tooltip label="Delete Goal">
              <IconButton
                onClick={handleDeleteGoal}
                variant="ghost"
                aria-label="Delete Goal"
                icon={<DeleteIcon />}
              />
            </Tooltip>
          )}
        </HStack>
        <Progress
          size="sm"
          colorScheme="green"
          value={goal.progress}
          mt="2"
        />
      </Box>
    </Box>
  );
}