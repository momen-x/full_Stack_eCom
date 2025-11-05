"use client";
// this amizing code but i don't understood 😅
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

type Props<T> = {
  fieldTitle: string;
  nameInSchema: keyof T & string;
  message: string;
  disabled?: boolean;
};

export default function CheckboxWithLabel<T>({
  fieldTitle,
  nameInSchema,
  message,
  disabled = false,
}: Props<T>) {
  const form = useFormContext();

  return (
    <FormField
      name={nameInSchema}
      control={form.control}
      render={({ field }) => (
        <FormItem className="w-full flex items-center gap-2">
          <FormLabel className="text-base" htmlFor={nameInSchema}>
            {fieldTitle}
          </FormLabel>
          <div className="flex items-center gap-3">
            <FormControl>
              <Checkbox
                disabled={disabled}
                id={nameInSchema}
                className={`w-full max-w-xs disabled:text-blue-500 dark:disabled:text-green-300 disabled:opacity-75
                
                    `}
                {...field}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            {message}
          </div>

          <FormMessage />
        </FormItem>
      )}
    ></FormField>
  );
}
