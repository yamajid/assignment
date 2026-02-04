"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [secretMessage, setSecretMessage] = useState<string | null>(null);
  const [isLoadingSecret, setIsLoadingSecret] = useState(false);
  const [secretError, setSecretError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session) router.push("/login");
  }, [session, isPending, router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  const fetchSecret = async () => {
    setIsLoadingSecret(true);
    setSecretError(null);

    try {
      // fetch secret message from backend
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/secret`, {

        withCredentials: true,
        
      });
      setSecretMessage(response.data.message);
    } catch {
      setSecretError("Could not fetch secret. Make sure the NestJS server is running.");
    } finally {
      setIsLoadingSecret(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {session.user?.name || session.user?.email}!
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="font-medium">Name:</span> {session.user?.name || "Not set"}</p>
            <p><span className="font-medium">Email:</span> {session.user?.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Secret Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={fetchSecret} disabled={isLoadingSecret}>
              {isLoadingSecret ? "Fetching..." : "Get Secret Message"}
            </Button>

            {secretMessage && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-green-50 text-green-800 rounded-lg"
              >
                {secretMessage}
              </motion.p>
            )}

            {secretError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-red-50 text-red-600 rounded-lg"
              >
                {secretError}
              </motion.p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
