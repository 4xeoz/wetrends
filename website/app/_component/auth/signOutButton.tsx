"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { logout } from "@/actions/auth";

const SignOutButton = ({ className }: { className?: string }) => {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    localStorage.clear();
    try {
      await logout();
      window.location.href = "/sign-in";
    } catch {
      setIsSigningOut(false);
    }
  };

  return (
    <button type="button" onClick={handleSignOut} disabled={isSigningOut} aria-busy={isSigningOut} className={className}>
      {isSigningOut ? <><Loader2 className="mr-2 inline h-3.5 w-3.5 animate-spin" /> Signing out…</> : 'Sign out'}
    </button>
  );
};

export default SignOutButton;
