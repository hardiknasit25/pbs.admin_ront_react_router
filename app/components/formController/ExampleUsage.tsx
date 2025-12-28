/**
 * Example usage of InputController and SelectController components
 *
 * This file demonstrates how to use the form controller components
 * with react-hook-form and zod validation.
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputController } from "~/components/formController/InputController";
import { SelectController } from "~/components/formController/SelectController";
import { Button } from "~/components/ui/button";

// Define your form schema with zod
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  country: z.string().min(1, "Please select a country"),
  role: z.string().min(1, "Please select a role"),
});

type FormData = z.infer<typeof formSchema>;

export function ExampleForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      country: "",
      role: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);
    // Handle form submission here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
      <h2 className="text-2xl font-bold">Example Form</h2>

      {/* Basic Input Example */}
      <InputController
        name="email"
        control={control}
        label="Email Address"
        placeholder="Enter your email"
        type="email"
        required
        description="We'll never share your email with anyone else."
      />

      {/* Password Input Example */}
      <InputController
        name="password"
        control={control}
        label="Password"
        placeholder="Enter your password"
        type="password"
        required
        description="Must be at least 8 characters long."
      />

      {/* Text Input with Validation */}
      <InputController
        name="username"
        control={control}
        label="Username"
        placeholder="Choose a username"
        required
      />

      {/* Select with Flat Options */}
      <SelectController
        name="country"
        control={control}
        label="Country"
        placeholder="Select your country"
        required
        options={[
          { value: "us", label: "United States" },
          { value: "uk", label: "United Kingdom" },
          { value: "ca", label: "Canada" },
          { value: "au", label: "Australia" },
          { value: "in", label: "India" },
        ]}
        description="Select the country you're from."
      />

      {/* Select with Grouped Options */}
      <SelectController
        name="role"
        control={control}
        label="Role"
        placeholder="Select your role"
        required
        optionGroups={[
          {
            label: "Engineering",
            options: [
              { value: "frontend", label: "Frontend Developer" },
              { value: "backend", label: "Backend Developer" },
              { value: "fullstack", label: "Full Stack Developer" },
            ],
          },
          {
            label: "Design",
            options: [
              { value: "ui", label: "UI Designer" },
              { value: "ux", label: "UX Designer" },
              { value: "product", label: "Product Designer" },
            ],
          },
          {
            label: "Management",
            options: [
              { value: "pm", label: "Product Manager" },
              { value: "em", label: "Engineering Manager" },
            ],
          },
        ]}
        description="Choose the role that best describes you."
      />

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}

/**
 * USAGE EXAMPLES:
 *
 * 1. Basic Input:
 * <InputController
 *   name="fieldName"
 *   control={control}
 *   label="Field Label"
 *   placeholder="Enter value"
 * />
 *
 * 2. Input with Validation Rules:
 * <InputController
 *   name="fieldName"
 *   control={control}
 *   label="Field Label"
 *   rules={{ required: "This field is required" }}
 * />
 *
 * 3. Select with Options:
 * <SelectController
 *   name="fieldName"
 *   control={control}
 *   label="Field Label"
 *   options={[
 *     { value: "1", label: "Option 1" },
 *     { value: "2", label: "Option 2" },
 *   ]}
 * />
 *
 * 4. Horizontal Layout:
 * <InputController
 *   name="fieldName"
 *   control={control}
 *   label="Field Label"
 *   orientation="horizontal"
 * />
 *
 * 5. Disabled Field:
 * <InputController
 *   name="fieldName"
 *   control={control}
 *   label="Field Label"
 *   disabled
 * />
 */
