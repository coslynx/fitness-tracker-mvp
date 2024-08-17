"use client";

import { useState } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Text,
  useToast,
  Select,
  Textarea,
  FormHelperText,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store";
import { Goal } from "@/types";

interface GoalFormProps {
  onSubmit: (goalData: Goal) => void;
  isLoading?: boolean;
  goal?: Goal;
  onCancel?: () => void;
}

export default function GoalForm({
  onSubmit,
  isLoading = false,
  goal,
  onCancel,
}: GoalFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();

  const [name, setName] = useState(goal?.name || "");
  const [target, setTarget] = useState(goal?.target || "");
  const [deadline, setDeadline] = useState(
    goal?.deadline
      ? new Date(goal?.deadline).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [error, setError] = useState(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!name || !target || !deadline) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      await onSubmit({
        name,
        target: parseFloat(target),
        deadline: new Date(deadline),
        userId: session?.user.id,
      });

      toast({
        title: "Goal Saved",
        description: "Your goal has been successfully saved.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      router.push("/goals");
    } catch (error) {
      console.error("Error creating goal:", error);
      toast({
        title: "Error Saving Goal",
        description: "An error occurred while saving your goal.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      h="100vh"
      bg="gray.100"
    >
      <Box
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="lg"
        w="full"
        maxW="md"
      >
        <Heading as="h2" size="lg" mb={6}>
          {goal ? "Edit Goal" : "Create New Goal"}
        </Heading>
        {error && <Text color="red.500">{error}</Text>}
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="target">Target</FormLabel>
            <Input
              id="target"
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="deadline">Deadline</FormLabel>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="notes">Notes (optional)</FormLabel>
            <Textarea
              id="notes"
              placeholder="Add notes about your goal"
              value={goal?.notes || ""}
              onChange={(e) =>
                onSubmit({ ...goal, notes: e.target.value })
              }
            />
          </FormControl>
          <Flex justifyContent="space-between" w="full" mb={4}>
            {onCancel && (
              <Button
                onClick={onCancel}
                colorScheme="gray"
                size="lg"
                w="48%"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Saving..."
              size="lg"
              w="48%"
            >
              {goal ? "Save Changes" : "Create Goal"}
            </Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
}