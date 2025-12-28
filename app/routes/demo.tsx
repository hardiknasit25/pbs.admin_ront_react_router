import { useLoaderData, type LoaderFunction } from "react-router";
import { ExampleForm } from "~/components/formController/ExampleUsage";

export const loader: LoaderFunction = () => {
  return { message: "Hello, world!" };
};

export default function Demo() {
  const { message } = useLoaderData();

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Demo Page</h1>

        <ExampleForm />
      </div>
    </div>
  );
}
