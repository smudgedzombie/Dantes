import { useEffect, useRef } from "react";
  import { ClerkProvider, SignIn, SignUp, Show, useClerk } from '@clerk/react';
  import { publishableKeyFromHost } from '@clerk/react/internal';
  import { shadcn } from '@clerk/themes';
  import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from 'wouter';
  import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
  import { Toaster } from "@/components/ui/toaster";
  import { TooltipProvider } from "@/components/ui/tooltip";

  import LandingPage from "./pages/landing";
  import DashboardPage from "./pages/dashboard";
  import AccountsPage from "./pages/accounts";
  import TransactionsPage from "./pages/transactions";
  import BudgetsPage from "./pages/budgets";
  import CategoriesPage from "./pages/categories";
  import CommandPage from "./pages/command";
  import ClientsPage from "./pages/clients";
  import GrahamsPage from "./pages/grahams";
  import GrahamDetailPage from "./pages/graham-detail";
  import JoinPage from "./pages/join";
  import AdminPage from "./pages/admin";
  import AccessPendingPage from "./pages/access-pending";
  import PortalPage from "./pages/portal";
  import PortalTasksPage from "./pages/portal-tasks";
  import PortalDocumentsPage from "./pages/portal-documents";
  import PortalBillingPage from "./pages/portal-billing";
import PortalClubPage from "./pages/portal-club";
  import { useAccess } from "./hooks/useAccess";

  const queryClient = new QueryClient();

  // REQUIRED — copy verbatim
  const clerkPubKey = publishableKeyFromHost(
    window.location.hostname,
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  );
  // REQUIRED — copy verbatim (empty in dev, auto-set in prod)
  const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  function stripBase(path: string): string {
    return basePath && path.startsWith(basePath)
      ? path.slice(basePath.length) || "/"
      : path;
  }

  if (!clerkPubKey) {
    throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');
  }

  const clerkAppearance = {
    theme: shadcn,
    cssLayerName: "clerk",
    options: {
      logoPlacement: "inside" as const,
      logoLinkUrl: basePath || "/",
      logoImageUrl: `${window.location.origin}${basePath}/logo.png`,
    },
    variables: {
      colorPrimary: "hsl(46, 65%, 52%)",
      colorForeground: "hsl(210, 40%, 98%)",
      colorMutedForeground: "hsl(215, 20%, 65%)",
      colorDanger: "hsl(0, 84%, 60%)",
      colorBackground: "hsl(226, 55%, 10%)",
      colorInput: "hsl(226, 50%, 15%)",
      colorInputForeground: "hsl(210, 40%, 98%)",
      colorNeutral: "hsl(226, 50%, 15%)",
      fontFamily: "'Inter', sans-serif",
      borderRadius: "0.125rem",
    },
    elements: {
      rootBox: "w-full flex justify-center",
      cardBox: "bg-[#0c142c] rounded-sm w-[440px] max-w-full overflow-hidden border border-[#1a264a] shadow-2xl",
      card: "!shadow-none !border-0 !bg-transparent !rounded-none",
      footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
      headerTitle: "text-2xl font-serif text-white",
      headerSubtitle: "text-slate-400",
      socialButtonsBlockButtonText: "text-white font-medium",
      formFieldLabel: "text-slate-300 font-medium",
      footerActionLink: "text-[#D4AF37] hover:text-[#b8952b]",
      footerActionText: "text-slate-400",
      dividerText: "text-slate-500",
      identityPreviewEditButton: "text-[#D4AF37]",
      formFieldSuccessText: "text-green-400",
      alertText: "text-red-400",
      logoBox: "flex justify-center mb-4",
      logoImage: "h-12 w-auto object-contain",
      socialButtonsBlockButton: "border-[#1a264a] bg-[#121c3a] hover:bg-[#1a264a] text-white",
      formButtonPrimary: "bg-[#D4AF37] hover:bg-[#b8952b] text-[#0A1128] font-bold shadow-md",
      formFieldInput: "bg-[#121c3a] border-[#1a264a] text-white focus:ring-[#D4AF37] focus:border-[#D4AF37]",
      footerAction: "bg-transparent",
      dividerLine: "bg-[#1a264a]",
      alert: "bg-red-950/30 border-red-900/50",
      otpCodeFieldInput: "border-[#1a264a] bg-[#121c3a] text-white",
      formFieldRow: "mb-4",
      main: "gap-6",
    },
  };

  function SignInPage() {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
        <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
      </div>
    );
  }

  function SignUpPage() {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
        <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
      </div>
    );
  }

  function HomeRedirect() {
    return (
      <>
        <Show when="signed-in">
          <Redirect to="/command" />
        </Show>
        <Show when="signed-out">
          <LandingPage />
        </Show>
      </>
    );
  }

  function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
    const { role, loading } = useAccess();
    if (loading) return <LoadingScreen />;
    if (role === "unauthenticated") return <Redirect to="/" />;
    if (role === "super_admin" || role === "staff") return <Component />;
    return <AccessPendingPage status={role} />;
  }

  function AdminRoute() {
    const { isSuperAdmin, loading, role } = useAccess();
    if (loading) return <LoadingScreen />;
    if (role === "unauthenticated") return <Redirect to="/" />;
    if (!isSuperAdmin) return (
      <div className="min-h-screen bg-[#030810] flex items-center justify-center">
        <p className="text-red-400 font-mono text-sm">UNAUTHORIZED — Bloom Society principals only</p>
      </div>
    );
    return <AdminPage />;
  }

  // Portal: accessible to any authenticated user (portal itself validates membership)
  function PortalRoute({ component: Component }: { component: React.ComponentType }) {
    const { role, loading } = useAccess();
    if (loading) return <LoadingScreen />;
    if (role === "unauthenticated") return <Redirect to="/sign-in" />;
    return <Component />;
  }

  function LoadingScreen() {
    return (
      <div className="min-h-screen bg-[#030810] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-sm flex items-center justify-center mx-auto mb-4">
            <span className="text-[#D4AF37] font-mono font-bold text-sm">D</span>
          </div>
          <span className="text-[9px] font-mono text-[#D4AF37] tracking-[0.4em] animate-pulse">AUTHORIZING...</span>
        </div>
      </div>
    );
  }

  function ClerkQueryClientCacheInvalidator() {
    const { addListener } = useClerk();
    const queryClient = useQueryClient();
    const prevUserIdRef = useRef<string | null | undefined>(undefined);

    useEffect(() => {
      const unsubscribe = addListener(({ user }) => {
        const userId = user?.id ?? null;
        if (
          prevUserIdRef.current !== undefined &&
          prevUserIdRef.current !== userId
        ) {
          queryClient.clear();
        }
        prevUserIdRef.current = userId;
      });
      return unsubscribe;
    }, [addListener, queryClient]);

    return null;
  }

  function ClerkProviderWithRoutes() {
    const [, setLocation] = useLocation();

    return (
      <ClerkProvider
        publishableKey={clerkPubKey}
        proxyUrl={clerkProxyUrl}
        appearance={clerkAppearance}
        signInUrl={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        localization={{
          signIn: {
            start: {
              title: "Access Dantès",
              subtitle: "Enter your command center",
            },
          },
          signUp: {
            start: {
              title: "Initialize Dantès",
              subtitle: "Secure your financial future",
            },
          },
        }}
        routerPush={(to) => setLocation(stripBase(to))}
        routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
      >
        <QueryClientProvider client={queryClient}>
          <ClerkQueryClientCacheInvalidator />
          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/join" component={JoinPage} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route path="/admin">{() => <AdminRoute />}</Route>
            <Route path="/portal/tasks">{() => <PortalRoute component={PortalTasksPage} />}</Route>
            <Route path="/portal/documents">{() => <PortalRoute component={PortalDocumentsPage} />}</Route>
            <Route path="/portal/billing">{() => <PortalRoute component={PortalBillingPage} />}</Route>
            <Route path="/portal/club">{() => <PortalRoute component={PortalClubPage} />}</Route>
            <Route path="/portal">{() => <PortalRoute component={PortalPage} />}</Route>
            <Route path="/command">{() => <ProtectedRoute component={CommandPage} />}</Route>
            <Route path="/clients">{() => <ProtectedRoute component={ClientsPage} />}</Route>
            <Route path="/grahams/:id">{() => <ProtectedRoute component={GrahamDetailPage} />}</Route>
            <Route path="/grahams">{() => <ProtectedRoute component={GrahamsPage} />}</Route>
            <Route path="/dashboard">{() => <ProtectedRoute component={DashboardPage} />}</Route>
            <Route path="/accounts">{() => <ProtectedRoute component={AccountsPage} />}</Route>
            <Route path="/transactions">{() => <ProtectedRoute component={TransactionsPage} />}</Route>
            <Route path="/budgets">{() => <ProtectedRoute component={BudgetsPage} />}</Route>
            <Route path="/categories">{() => <ProtectedRoute component={CategoriesPage} />}</Route>
          </Switch>
        </QueryClientProvider>
      </ClerkProvider>
    );
  }

  function App() {
    return (
      <TooltipProvider>
        <WouterRouter base={basePath}>
          <ClerkProviderWithRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    );
  }

  export default App;
  