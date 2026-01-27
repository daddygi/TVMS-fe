import { createRootRoute, Outlet } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

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
    <>
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">Page not found</p>
      </div>
    </div>
  );
}
