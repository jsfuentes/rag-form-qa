import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useRandomId } from "src/utils/hooks";
const debug = require("debug")("app:Form:SelectInput");

interface SelectInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;

  name: string;
  options: Array<{
    label: string;
    value: string;
  }>;
  required?: boolean;
  title?: string;
  className?: string;
}

SelectInput.defaultProps = {
  className: "",
};

export default function SelectInput(props: SelectInputProps) {
  const { title, options, register, required, className, name } = props;
  const randomId = useRandomId();

  return (
    <div className={`${className}`}>
      {title && (
        <label
          htmlFor={randomId}
          className="block font-medium leading-5 text-gray-600 mb-2"
        >
          {title}
        </label>
      )}
      <div className="relative">
        <select
          id={randomId}
          className="block form-select w-full bg-white border border-gray-200 text-gray-700 px-4 pr-8 rounded"
          {...register(name, {
            required,
          })}
        >
          {options.map((o, i) => (
            <option key={i} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
