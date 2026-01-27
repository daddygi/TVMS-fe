import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
        About
      </h1>
      <div className="text-muted-foreground mt-6 max-w-3xl space-y-4">
        <p>
          TVMS is a modern frontend application scaffold built with best
          practices in mind.
        </p>
        <h2 className="text-foreground pt-4 text-xl font-semibold sm:text-2xl">
          Tech Stack
        </h2>
        <ul className="list-inside list-disc space-y-2">
          <li>React 19 with TypeScript</li>
          <li>Vite for fast development and builds</li>
          <li>TanStack Router for type-safe routing</li>
          <li>Tailwind CSS v4 for styling</li>
          <li>shadcn/ui component patterns</li>
        </ul>
        <h2 className="text-foreground pt-4 text-xl font-semibold sm:text-2xl">
          Features
        </h2>
        <ul className="list-inside list-disc space-y-2">
          <li>Path aliases configured (@/)</li>
          <li>Strict TypeScript enabled</li>
          <li>Dark mode support</li>
          <li>Responsive design</li>
          <li>ESLint and Prettier configured</li>
        </ul>
      </div>
    </div>
  );
}
