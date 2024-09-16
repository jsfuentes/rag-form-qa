import React, { useState } from "react";
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  UseFormRegister,
  Control,
  FieldValues,
} from "react-hook-form";
import Button from "./Button";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface FormField {
  id: string;
  type: string;
  label: string;
}

interface FormBuilderProps {
  formId: string;
  formFields: FormField[];
  setFormFields: React.Dispatch<React.SetStateAction<FormField[]>>;
  register: UseFormRegister<FieldValues>;
  handleSubmit: (
    onSubmit: SubmitHandler<FormInput>
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  append: (value: Partial<FormField> | Partial<FormField>[]) => void;
  remove: (index?: number | number[]) => void;
  fields: Partial<FormField>[];
}

interface FormInput {
  questions: FormField[];
  newField: {
    type: string;
    label: string;
  };
}

export default function FormBuilder(props: FormBuilderProps) {
  const { register, handleSubmit, append, remove, fields } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    setIsSubmitting(true);
    console.log("Form data to be submitted:", data);
    try {
      const response = await axios.put("/api/form", {
        id: props.formId,
        name: "New Form", // You might want to add a name field to your form
        questions: data.questions,
      });
      console.log("Form created:", response.data);
      toast.success("Form saved successfully!");
    } catch (error) {
      console.error("Error creating form:", error);
      toast.error("Error saving form. Please try again.");
    } finally {
      setIsSubmitting(false);
      //todo instead of reloading reset React hook form to have IDs
      router.reload();
    }
  };

  const removeField = (index: number) => {
    remove(index);
  };

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-2"
      >
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-center space-x-2 bg-white p-3 rounded shadow"
          >
            <div className="flex-grow space-y-2">
              <div className="flex space-x-2">
                <span className="font-bold mr-2 mt-1">{index + 1}.</span>

                <input
                  type="text"
                  className="border p-2 rounded flex-grow"
                  placeholder="Question"
                  {...register(`questions.${index}.label`, { required: true })}
                />
                <select
                  className="border p-2 rounded"
                  {...register(`questions.${index}.type`)}
                >
                  <option value="text">Text</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="date">Date</option>
                </select>
              </div>
            </div>

            <i
              className="bx bx-x-circle text-red-400 text-3xl hover:text-red-700 transition-colors duration-300 cursor-pointer"
              onClick={() => removeField(index)}
            ></i>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ type: "text", label: "" })}
          className="bg-primary-100 mb-16 text-gray-700 border-2 border-dashed border-primary-300 px-6 py-3 rounded w-full hover:bg-primary-200 transition-colors duration-300"
        >
          Add Field
        </button>

        <Button type="submit" className="mt-12" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Form"}
        </Button>
      </form>
    </div>
  );
}
