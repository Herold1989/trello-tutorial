"use client";
import * as z from "zod";
import { useState } from "react";
import { DataTable } from "@/components/user-table"; // Import DataTable component
import { columns } from "@/data/user-columns"; // Import columns definition
import { ColumnDef } from "@tanstack/react-table";
import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";
import { convertToCSV } from "@/lib/csv-export";
import { UserListSchema } from "@/schemas";

type User = z.infer<typeof UserListSchema>;


const AdminPage = () => {
  const [userData, setUserData] = useState(null); // State to hold user data

  // const onServerActionClick = () => {
  //   admin().then((data) => {
  //     if (data.error) {
  //       toast.error(data.error);
  //     } else {
  //       toast.success(data.success);
  //     }
  //   });
  // };

  const onApiRouteClick = () => {
    fetch("/api/admin")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          setUserData(data); // Store user data in state
          toast.success("User data fetched successfully");
        }
      })
      .catch((error) => {
        toast.error("Failed to fetch user data");
      });
  };

  const handleExportClick = () => {
    if (userData) {
      exportToCSV(userData, columns);
    }
  };

  function exportToCSV(data: User[], columns: ColumnDef<User>[]) {
    const csvString = convertToCSV(data, columns);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    // Create a link and trigger the download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'UserData.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
      <CardHeader>
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-center">🔑 Admin</p>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are allowed to see this content" />
          <div className="flex flex-row items-center justify-between rounded-lg border-2 p-3 shadow-md">
            <p>Admin-only API Route</p>
            <Button onClick={onApiRouteClick}>Display User Data</Button>
          </div>
          {/* <div className="flex flex-row items-center justify-between rounded-lg border-2 p-3 shadow-md">
            <p>Admin-only Server Action</p>
            <Button onClick={onServerActionClick}>Click to test</Button>
          </div> */}
          {userData && (
            <>
              <DataTable columns={columns} data={userData} />
              <Button onClick={handleExportClick}>Export to CSV</Button>
            </>
          )}
        </RoleGate>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
