import React from "react";
import { UseFieldArrayReturn } from "react-hook-form";
import Button from "./Button";

interface FormField {
  id: string;
  type: string;
  label: string;
}

interface FormRendererProps {
  fields: Partial<FormField>[];
}

export default function FormRenderer({ fields }: FormRendererProps) {
  console.log("A", fields);

  const renderField = (field: Partial<FormField>) => {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            id={field.id}
            name={field.id}
            className="border p-2 rounded w-full"
            placeholder={field.label}
          />
        );
      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.id}
              name={field.id}
              className="mr-2"
            />
            <label htmlFor={field.id}>{field.label}</label>
          </div>
        );
      case "date":
        return (
          <input
            type="date"
            id={field.id}
            name={field.id}
            className="border p-2 rounded w-full"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start">
          <span className="font-bold mr-2 mt-1">{index + 1}.</span>
          <div className="flex-grow">
            {field.type !== "checkbox" && (
              <label htmlFor={field.id} className="block mb-1">
                {field.label}
              </label>
            )}
            {renderField(field)}
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <Button onClick={() => console.log("Submit")}>Create Case</Button>
      </div>
    </div>
  );
}
