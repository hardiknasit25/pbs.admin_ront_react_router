import * as React from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { FieldError } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  label?: string;
  description?: string;
  placeholder?: string;
  type?: React.ComponentProps<typeof Input>["type"];
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  required?: boolean;
  orientation?: "vertical" | "horizontal" | "responsive";
  icon?: React.ComponentType<{ className?: string }>;
}

export function InputController<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  label,
  description,
  placeholder,
  type = "text",
  className,
  inputClassName,
  labelClassName,
  disabled,
  required,
  orientation = "vertical",
  icon: Icon,
}: InputControllerProps<TFieldValues, TName>) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState }) => {
        const { error } = fieldState;
        const hasError = !!error;

        return (
          <div
            className={cn(className)}
            data-invalid={hasError}
            data-disabled={disabled}
          >
            {label && (
              <label htmlFor={name} className={labelClassName}>
                {label}
                {required && <span className="text-destructive ml-0.5">*</span>}
              </label>
            )}

            <div className="flex flex-col gap-1.5 w-full">
              <div className="relative">
                {Icon && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                    <Icon className="w-4 h-4" />
                  </div>
                )}
                <Input
                  {...field}
                  id={name}
                  type={inputType}
                  placeholder={placeholder}
                  disabled={disabled}
                  aria-invalid={hasError}
                  aria-describedby={
                    description || error
                      ? `${name}-description ${name}-error`
                      : undefined
                  }
                  className={cn(
                    Icon && "pl-10",
                    isPasswordField && "pr-10",
                    inputClassName
                  )}
                  value={field.value ?? ""}
                />
                {isPasswordField && (
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>

              {description && !hasError && (
                <p id={`${name}-description`}>{description}</p>
              )}

              {hasError && <FieldError id={`${name}-error`} errors={[error]} />}
            </div>
          </div>
        );
      }}
    />
  );
}
