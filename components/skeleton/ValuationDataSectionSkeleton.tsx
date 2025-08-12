"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ValuationDataSectionSkeleton() {
  return (
    <Card className="border-2 border-slate-200 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-4 w-72" />
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Add Data Button */}
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Data Items */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 ml-4" />
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        <div className="text-center py-8">
          <Skeleton className="h-8 w-8 mx-auto mb-4" />
          <Skeleton className="h-5 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-72 mx-auto" />
        </div>
      </CardContent>
    </Card>
  );
}
