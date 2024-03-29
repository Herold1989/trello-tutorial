"use client";

import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

const OrganizationIdPage = () => {
  const user = useCurrentUser();
  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-400 to-slate-800">
      <UserInfo label="📱 Client component" user={user} />
    </div>
  );
};

export default OrganizationIdPage;
