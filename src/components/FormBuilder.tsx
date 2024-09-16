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

interface FormField {
  id: string;
  type: string;
  label: string;
}

interface FormBuilderProps {
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
  fields: FormField[];
  newField: {
    type: string;
    label: string;
  };
}

export default function FormBuilder(props: FormBuilderProps) {
  const { register, handleSubmit, append, remove, fields } = props;

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data);
    //todo:call api to create form
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
          onClick={() =>
            append({ id: Date.now().toString(), type: "text", label: "" })
          }
          className="bg-primary-100 mb-16 text-gray-700 border-2 border-dashed border-primary-300 px-6 py-3 rounded w-full hover:bg-primary-200 transition-colors duration-300"
        >
          Add Field
        </button>

        <Button type="submit" className="mt-12">
          Create Form
        </Button>
      </form>
    </div>
  );
}
