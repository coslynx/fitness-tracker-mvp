"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store";
import { ProfileCard } from "@/components/ProfileCard";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { getUser } = useStore();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/users/${session?.user.id}`);
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
      router.push("/profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchUser();
    }
  }, [status]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (isLoading) {
    return <p>Loading user data...</p>;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center gap-10">
        <h1 className="text-4xl font-bold">Your Profile</h1>
        <ProfileCard user={user} />
      </div>
    </main>
  );
}