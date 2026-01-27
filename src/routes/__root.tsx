import { createRootRoute, Outlet } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      );

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </div>
  );
}

function NotFound() {
  return (
    <div className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-foreground text-6xl font-bold sm:text-8xl">404</h1>
      <p className="text-muted-foreground mt-4 text-lg sm:text-xl">
        Page not found
      </p>
      <p className="text-muted-foreground mt-2 text-sm">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
    </div>
  );
}
