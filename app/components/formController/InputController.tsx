import * as React from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Input } from "~/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "~/components/ui/field";
import { cn } from "~/lib/utils";

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
}: InputControllerProps<TFieldValues, TName>) {
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
          <Field
            className={cn(className)}
            orientation={orientation}
            data-invalid={hasError}
            data-disabled={disabled}
          >
            {label && (
              <FieldLabel htmlFor={name} className={labelClassName}>
                {label}
                {required && <span className="text-destructive ml-0.5">*</span>}
              </FieldLabel>
            )}

            <div className="flex flex-col gap-1.5 w-full">
              <Input
                {...field}
                id={name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={hasError}
                aria-describedby={
                  description || error
                    ? `${name}-description ${name}-error`
                    : undefined
                }
                className={cn(inputClassName)}
                value={field.value ?? ""}
              />

              {description && !hasError && (
                <FieldDescription id={`${name}-description`}>
                  {description}
                </FieldDescription>
              )}

              {hasError && <FieldError id={`${name}-error`} errors={[error]} />}
            </div>
          </Field>
        );
      }}
    />
  );
}
