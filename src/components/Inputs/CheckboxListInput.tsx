import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import CheckboxInput from "./CheckboxInput";

const debug = require("debug")("app:Form:Inputs");

interface CheckboxListInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;

  title: string;
  options: Array<{
    title: string;
    name: string;
  }>;
  className?: string;
}

export default function CheckboxListInput(props: CheckboxListInputProps) {
  const { title, options, register, className } = props;

  return (
    <div className={`flex flex-col ${className}`}>
      {title && (
        <div className="block font-medium leading-5 text-gray-600">{title}</div>
      )}
      {options.map((cb) => (
        <CheckboxInput
          key={cb.title}
          className="mt-2"
          title={cb.title}
          name={cb.name}
          register={register}
        />
      ))}
    </div>
  );
}
