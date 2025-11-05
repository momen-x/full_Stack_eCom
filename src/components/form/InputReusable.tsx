import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

type TInputs<TFieldValues extends FieldValues> = {
  label: string;
  name: Path<TFieldValues>;
  type?:
    | "text"
    | "number"
    | "email"
    | "password"
    | "tel"
    | "url"
    | "date"
    | "time"
    | "file";
  register: UseFormRegister<TFieldValues>;
  error?: string;
  placeholder: string; // ✅ Fixed typo: "placehilder" -> "placeholder"
  required?: boolean;
  disabled?: boolean; // ✅ Added disabled prop
  className?: string; // ✅ Added className for flexibility
  min?: number; // ✅ For number/date inputs
  max?: number; // ✅ For number/date inputs
  step?: number; // ✅ For number inputs
  accept?: string; // ✅ For file inputs
};

const InputReusable = <TFieldValues extends FieldValues>({
  label,
  name,
  register,
  error,
  placeholder,
  required = false,
  disabled = false,
  type = "text",
  className = "",
  min,
  max,
  step,
  accept,
}: TInputs<TFieldValues>) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium leading-none">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        className={`w-full ${className}`}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        accept={accept}
        {...register(name, {
          required: required ? `${label} is required` : false,
          ...(type === "number" &&
            min !== undefined && {
              min: { value: min, message: `Minimum value is ${min}` },
            }),
          ...(type === "number" &&
            max !== undefined && {
              max: { value: max, message: `Maximum value is ${max}` },
            }),
        })}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {/* ✅ Show error message */}
      {error && (
        <p id={`${name}-error`} className="text-sm text-destructive mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputReusable;
