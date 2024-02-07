"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";
import { logout } from "@/actions/logout";

export const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setOpen] = useState<boolean>(false);

  const onClick = () => {
    logout();
  };

  const toggleOpen = () => setOpen((prev) => !prev);

  useEffect(() => {
    if (isOpen) toggleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen();
    }
  };

  return (
    <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl shadow-sm w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto relative">
      <div className="flex items-center justify-between w-full z-20">
        {/* Navigation Buttons visible on large screens, wrapped in their container */}
        <div className="hidden md:flex gap-x-2 flex-grow">
          <Button
            asChild
            variant={pathname === "/server" ? "default" : "outline"}
          >
            <Link href="/server">Server</Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/client" ? "default" : "outline"}
          >
            <Link href="/client">Client</Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/admin" ? "default" : "outline"}
          >
            <Link href="/admin">Admin</Link>
          </Button>
          {/* <Button
            asChild
            variant={pathname === "/settings" ? "default" : "outline"}
          >
            <Link href="/settings">Settings</Link>
          </Button> */}
        </div>

        <div className="hidden md:block">
          <UserButton />
        </div>

        <Menu onClick={toggleOpen} className="h-6 w-6 md:hidden ml-auto" />
      </div>

      {/* Dropdown menu for smaller screens with increased spacing */}
      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } flex-col md:hidden absolute top-full right-0 mt-2 p-6 bg-secondary rounded-lg shadow-md z-10`}
      >
        <ul className="space-y-4">
          <li onClick={() => closeOnCurrent("/server")}>
            <Link href="/server">Server</Link>
          </li>
          <li onClick={() => closeOnCurrent("/client")}>
            <Link href="/client">Client</Link>
          </li>
          <li onClick={() => closeOnCurrent("/admin")}>
            <Link href="/admin">Admin</Link>
          </li>
          <li onClick={() => closeOnCurrent("/settings")}>
            <Link href="/settings">Settings</Link>
          </li>
          <li className="cursor-pointer" onClick={onClick}>
            Logout
          </li>
        </ul>
      </div>
    </nav>
  );
};
