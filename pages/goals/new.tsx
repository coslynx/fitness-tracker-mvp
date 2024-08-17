"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store";
import { GoalForm } from "@/components/GoalForm";

export default function NewGoalPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { addGoal } = useStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (goalData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      await addGoal(goalData);
      router.push("/goals");
    } catch (error) {
      console.error("Error creating goal:", error);
      setError("Failed to create goal. Please try again later.");
    } finally {
      setIsLoading(false);
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center gap-10">
        <h1 className="text-4xl font-bold">Create New Goal</h1>
        {error && <p className="text-red-500">{error}</p>}
        <GoalForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </main>
  );
}