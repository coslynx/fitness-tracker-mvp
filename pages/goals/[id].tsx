"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store";
import { GoalCard } from "@/components/GoalCard";
import { GoalForm } from "@/components/GoalForm";

export default function GoalPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();
  const { goals, addGoal, updateGoal, deleteGoal } = useStore();

  const [goal, setGoal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchGoal = async () => {
    try {
      const res = await fetch(`/api/goals/${id}`);
      const data = await res.json();
      setGoal(data);
    } catch (error) {
      console.error("Error fetching goal:", error);
      router.push("/goals");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchGoal();
    }
  }, [status]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (updatedGoal: any) => {
    try {
      await updateGoal(id, updatedGoal);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGoal(id);
      router.push("/goals");
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (isLoading) {
    return <p>Loading goal...</p>;
  }

  if (!goal) {
    return <p>Goal not found.</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center gap-10">
        {!isEditing && (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        {isEditing && (
          <GoalForm
            goal={goal}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        )}
      </div>
    </main>
  );
}