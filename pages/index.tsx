"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { GoalCard } from "@/components/GoalCard";
import { GoalForm } from "@/components/GoalForm";

export default function Home() {
  const [goals, setGoals] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/goals")
        .then((res) => res.json())
        .then((data) => setGoals(data));
    }
  }, [status]);

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
        <h1 className="text-4xl font-bold">Fitness Goal Tracker</h1>
        <p className="text-xl text-gray-500">
          Set, track, and achieve your fitness goals with ease.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
        <GoalForm />
      </div>
    </main>
  );
}