"use client"
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setOpen] = useState<boolean>(false);
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
    <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-sm hidden md:block h-auto py-1.5 px-2"
        >
          Create
        </Button>
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        {/* <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:id"
          afterLeaveOrganizationUrl="/select-org"
          afterSelectOrganizationUrl="/organization/:id"
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
            },
          }}
        />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: {
                height: 30,
                width: 30,
              }
            }
          }}
        /> */}
        <div className="hidden md:block">
          <UserButton />
        </div>

        <Menu onClick={toggleOpen} className="h-6 w-6 md:hidden ml-auto" />
      </div>
    </nav>
  );
};
