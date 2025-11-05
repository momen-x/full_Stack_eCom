"use client";
// this amizing code but i don't understood 😅
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";

type DataObj = {
  id: string;
  description: string;
};

type Props<T> = {
  fieldTitle: string;
  nameInSchema: keyof T & string;
  data: DataObj[];
  className?: string;
};

export default function SelectWithLabel<T>({
  fieldTitle,
  nameInSchema,
  data,
  className,
}: Props<T>) {
  const form = useFormContext();

  return (
    <FormField
      name={nameInSchema}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base" htmlFor={nameInSchema}>
            {fieldTitle}
          </FormLabel>
          <Select {...field} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger
                id={nameInSchema}
                className={`w-full max-w-xs  ${className}`}
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data.map((item) => (
                <SelectItem key={`${nameInSchema}_${item.id}`} value={item.id}>
                  {item.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    ></FormField>
  );
}
