"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth/react/types";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { createStandaloneToast } from "@chakra-ui/react";
import { useState } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { theme } from "@/styles/globals.css";

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const [toast, { isOpen, onOpen, onClose }] = createStandaloneToast();

  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={extendTheme(theme)}>
          <SessionProvider session={session}>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </SessionProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}