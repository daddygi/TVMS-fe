import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <section className="flex flex-col items-center text-center">
        <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Welcome to TVMS
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl text-base sm:text-lg md:text-xl">
          A modern, scalable frontend application built with React, TypeScript,
          and Tailwind CSS.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button size="lg">Get Started</Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </section>

      <section className="mt-16 grid gap-6 sm:mt-20 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3 lg:gap-8">
        <FeatureCard
          title="Type-Safe Routing"
          description="TanStack Router provides fully type-safe navigation with automatic route generation."
        />
        <FeatureCard
          title="Modern Styling"
          description="Tailwind CSS v4 with shadcn/ui components for beautiful, responsive interfaces."
        />
        <FeatureCard
          title="Dark Mode"
          description="Built-in dark mode support with system preference detection."
        />
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-border bg-card rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md">
      <h3 className="text-card-foreground text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>
    </div>
  );
}
