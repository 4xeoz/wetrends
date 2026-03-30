"use client";

import { logout } from "@/actions/auth";

const SignOutButton = ({ className }: { className?: string }) => {
  const handleSignOut = async () => {
    localStorage.clear();
    await logout();
    window.location.href = "/sign-in";
  };

  return (
    <button type="button" onClick={handleSignOut} className={className}>
      Sign out
    </button>
  );
};

export default SignOutButton;
