"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Home } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface PropertySectionProps {
  form: UseFormReturn<any>;
}

export function PropertySection({ form }: PropertySectionProps) {
  return (
    <Card className="border-2 border-slate-200 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-slate-200">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Home className="w-5 h-5 text-violet-600" />
          Property Information
        </CardTitle>
        <CardDescription className="text-slate-600">
          Enter property details from properties table
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="address"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700">
                  Property Address
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter property address"
                    className="border-2 border-slate-200 focus:border-violet-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="upi"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700">
                  UPI
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter UPI"
                    className="border-2 border-slate-200 focus:border-violet-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="owner"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-slate-700">
                Property Owner
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter property owner name"
                  className="border-2 border-slate-200 focus:border-violet-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            name="country"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700">
                  Country
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Rwanda"
                    className="border-2 border-slate-200 focus:border-violet-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="province"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700">
                  Province
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Kigali"
                    className="border-2 border-slate-200 focus:border-violet-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="district"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700">
                  District
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Gasabo"
                    className="border-2 border-slate-200 focus:border-violet-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            name="sector"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700">
                  Sector
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Kimisagara"
                    className="border-2 border-slate-200 focus:border-violet-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="cell"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700">
                  Cell
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter cell"
                    className="border-2 border-slate-200 focus:border-violet-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="village"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700">
                  Village
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter village"
                    className="border-2 border-slate-200 focus:border-violet-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
