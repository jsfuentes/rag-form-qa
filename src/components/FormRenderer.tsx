import React, { useEffect } from "react";
import { useForm, SubmitHandler, UseFormSetValue } from "react-hook-form";
import Button from "./Button";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface FormField {
  id: string;
  type: string;
  label: string;
  value?: string;
}

interface FormRendererProps {
  fields: Partial<FormField>[];
  formId: number;
  isUpdate: boolean;
  setSetValue?: (setValue: UseFormSetValue<FormInput>) => void;
}

interface FormInput {
  [key: string]: string | boolean;
}

export default function FormRenderer({
  fields,
  formId,
  isUpdate,
  setSetValue,
}: FormRendererProps) {
  const { register, handleSubmit, setValue } = useForm<FormInput>();
  const router = useRouter();

  useEffect(() => {
    if (setSetValue) {
      setSetValue(setValue);
    }
  }, [setSetValue, setValue]);

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    console.log("data", data);

    try {
      const answers = fields.map((field) => ({
        value: String(data[field.id!]),
        formQuestionId: parseInt(field.id!),
      }));

      // Check if all answers have IDs
      //todo: if you delete answer, wont trigger toast
      const missingIds = answers.some((answer) => !answer.formQuestionId);
      if (missingIds) {
        toast.error("Please save your form before creating a case.");
        return;
      }

      let response;
      if (isUpdate) {
        response = await axios.put("/api/case", {
          id: router.query.id,
          formId,
          answers,
        });
      } else {
        response = await axios.post("/api/case", {
          formId,
          answers,
        });
      }

      console.log("Response from creating/updating case:", response.data);

      if (response.status === 200 || response.status === 201) {
        if (isUpdate) {
          toast.success("Case updated successfully!");
        } else {
          toast.success("Case created successfully!");
          // Redirect to the newly created case
          router.push(`/cases/${response.data.id}`);
        }
      } else {
        toast.error(`Failed to ${isUpdate ? "update" : "create"} case`);
      }
    } catch (error) {
      console.error("Error creating case:", error);
      toast.error("Error creating case. Please try again.");
    }
  };

  const renderField = (field: Partial<FormField>, index: number) => {
    // console.log("field", field);
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            id={field.id}
            {...register((field.id || index)!.toString())}
            className="border p-2 rounded w-full"
            placeholder={field.label}
            defaultValue={field.value}
          />
        );
      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.id}
              {...register((field.id || index)!.toString())}
              className="mr-2"
              defaultChecked={field.value === "true"}
            />
            <label htmlFor={field.id}>{field.label}</label>
          </div>
        );
      case "date":
        return (
          <input
            type="date"
            id={field.id}
            {...register((field.id || index)!.toString())}
            className="border p-2 rounded w-full"
            defaultValue={field.value}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start">
          <span className="font-bold mr-2 mt-1">{index + 1}.</span>
          <div className="flex-grow">
            {field.type !== "checkbox" && (
              <label htmlFor={field.id} className="block mb-1">
                {field.label}
              </label>
            )}
            {renderField(field, index)}
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <Button type="submit">
          {isUpdate ? "Update Case" : "Create Case"}
        </Button>
      </div>
    </form>
  );
}
