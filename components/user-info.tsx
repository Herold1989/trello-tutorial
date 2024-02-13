import { ExtendedUser } from "@/next-auth";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
}

export const UserInfo = ({ user, label }: UserInfoProps) => {
  const [organizationName, setOrganizationName] = useState<string>("");

  useEffect(() => {
    const fetchOrganizationName = async () => {
      if (user?.organizationId) {
        try {
          const response = await fetch(
            "/api/organization"
          );
          if (!response.ok) {
            throw new Error("Failed to fetch organization");
          }
          const data = await response.json();
          // Assuming the response contains an organization object with an organizationName property
          setOrganizationName(data|| "-");
        } catch (error) {
        }
      }
    };

    fetchOrganizationName();
  }, [user?.organizationId]); // Dependency array to re-run effect if user.organizationId changes

  return (
    <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl shadow-md">
      <CardHeader>
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-center">
          {label}
        </p>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4">
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">User ID</p>
          <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
            {user?.id}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Name</p>
          <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
            {user?.name}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Email</p>
          <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
            {user?.email}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Organization</p>
          <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
            {/* {user?.organizationId ? user?.organizationId : "-"} */}
            {organizationName}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Role</p>
          <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
            {user?.role}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Two Factor Authentification</p>
          <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>
            {user?.isTwoFactorEnabled ? "ON" : "OFF"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
