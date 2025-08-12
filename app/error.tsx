"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6">
      <div className="w-full max-w-lg text-center space-y-6">
        <h2 className="text-8xl font-extrabold text-destructive">Error</h2>
        <h3 className="text-3xl font-semibold">An Error Occurred</h3>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Sorry for the inconvenience. You can return to the home page or try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/" passHref className="cursor-pointer">
            <Button variant="default" size="lg" className="font-medium px-8">
              Return to Home Page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
