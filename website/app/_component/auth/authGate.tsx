import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

interface AuthGateProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthGate = async ({
  children,
  requireAuth = false,
  redirectTo = "/sign-in",
}: AuthGateProps) => {
  const session = await auth();

  if (requireAuth && !session) {
    redirect(redirectTo);
  }

  return <>{children}</>;
};

export default AuthGate;

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <AuthGate requireAuth={true}>{children}</AuthGate>;
