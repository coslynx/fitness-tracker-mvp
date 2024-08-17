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
import { Activity } from "@/types";

interface ActivityFormProps {
  onSubmit: (activityData: Activity) => void;
  isLoading?: boolean;
  initialValues?: Partial<Activity>;
}

export default function ActivityForm({
  onSubmit,
  isLoading = false,
  initialValues,
}: ActivityFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { goals } = useStore();
  const toast = useToast();

  const [type, setType] = useState(initialValues?.type || "");
  const [duration, setDuration] = useState(initialValues?.duration || "");
  const [calories, setCalories] = useState(initialValues?.calories || "");
  const [date, setDate] = useState(
    initialValues?.date ? new Date(initialValues?.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [goalId, setGoalId] = useState(initialValues?.goalId || "");
  const [error, setError] = useState(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!type || !duration || !calories || !date) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      await onSubmit({
        type,
        duration: parseInt(duration),
        calories: parseInt(calories),
        date: new Date(date),
        userId: session?.user.id,
        goalId: goalId ? parseInt(goalId) : null,
      });

      toast({
        title: "Activity Logged",
        description: "Your activity has been successfully logged.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      router.push("/activities");
    } catch (error) {
      console.error("Error creating activity:", error);
      toast({
        title: "Error Logging Activity",
        description: "An error occurred while logging your activity.",
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
          {initialValues ? "Edit Activity" : "Log New Activity"}
        </Heading>
        {error && <Text color="red.500">{error}</Text>}
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel htmlFor="type">Type</FormLabel>
            <Select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select Activity Type</option>
              <option value="Cardio">Cardio</option>
              <option value="Strength">Strength Training</option>
              <option value="Flexibility">Flexibility</option>
              <option value="Other">Other</option>
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="duration">Duration (minutes)</FormLabel>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="calories">Calories Burned</FormLabel>
            <Input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="date">Date</FormLabel>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="goalId">Goal</FormLabel>
            <Select
              id="goalId"
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
            >
              <option value="">Select Goal</option>
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="notes">Notes (optional)</FormLabel>
            <Textarea
              id="notes"
              placeholder="Add notes about your activity"
              value={initialValues?.notes || ""}
              onChange={(e) =>
                onSubmit({ ...initialValues, notes: e.target.value })
              }
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
            loadingText="Logging..."
            size="lg"
            w="full"
          >
            {initialValues ? "Save Changes" : "Log Activity"}
          </Button>
        </form>
      </Box>
    </Flex>
  );
}