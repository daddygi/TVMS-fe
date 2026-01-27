export function Footer() {
  return (
    <footer className="border-border bg-background border-t">
      <div className="container mx-auto flex h-14 items-center justify-center px-4 sm:px-6 lg:px-8">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} TVMS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
