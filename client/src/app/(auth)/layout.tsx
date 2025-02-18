"use client";
import Brand from "@/components/brand";
import FullScreenLoading from "@/components/full-screen-loading";
import { assertAuthenticated } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticated = await assertAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
      if (authenticated) {
        router.push("/chat");
      }
    };

    checkAuthentication();
  }, [router]);

  if (isLoading) {
    return <FullScreenLoading />;
  } else if (!isAuthenticated) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Brand />
          {children}
        </div>
      </div>
    );
  }

  return null;
}
