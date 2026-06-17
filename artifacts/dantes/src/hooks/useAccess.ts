import { useAuth, useUser } from "@clerk/react";
  import { useState, useEffect } from "react";

  export type AccessRole = "super_admin" | "staff" | "pending" | "denied" | "unknown" | "unauthenticated";

  export type AccessInfo = {
    role: AccessRole;
    allowedTabs: string[];
    email: string;
    loading: boolean;
    isSuperAdmin: boolean;
    canAccess: (tab: string) => boolean;
  };

  export function useAccess(): AccessInfo {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const [role, setRole] = useState<AccessRole>("unauthenticated");
    const [allowedTabs, setAllowedTabs] = useState<string[]>([]);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!isLoaded) return;
      if (!isSignedIn) { setRole("unauthenticated"); setLoading(false); return; }
      (async () => {
        try {
          const token = await getToken();
          const res = await fetch("/api/my-access", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setRole(data.role ?? "unknown");
          setAllowedTabs(data.allowedTabs ?? []);
          setEmail(data.email ?? user?.primaryEmailAddress?.emailAddress ?? "");
        } catch {
          setRole("unknown");
        } finally {
          setLoading(false);
        }
      })();
    }, [isLoaded, isSignedIn]);

    const isSuperAdmin = role === "super_admin";
    const canAccess = (tab: string) => isSuperAdmin || (role === "staff" && allowedTabs.includes(tab));

    return { role, allowedTabs, email, loading, isSuperAdmin, canAccess };
  }
  