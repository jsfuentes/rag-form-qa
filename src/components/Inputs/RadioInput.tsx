import classNames from "classnames";
import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { getError, getErrorMessage } from "src/components/Inputs/utils";
import { useRandomId } from "src/utils/hooks";

const debug = require("debug")("app:Form:RadioInput");

interface RadioInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;

  name: string;
  options: Array<{
    label: string;
    value: string;
    description?: React.ReactNode;
  }>;
  title?: string;
  required?: boolean;
  className?: string;
  optionClassName?: string;
}

export default function RadioInput(props: RadioInputProps) {
  const {
    title,
    name,
    register,
    required,
    options,
    errors,
    className,
    optionClassName,
  } = props;

  const err = getError(props.errors, name);

  return (
    <div className={className}>
      {title && (
        <div className="block font-medium leading-5 text-gray-600">{title}</div>
      )}
      <div className="mt-3">
        {options.map((opt) => (
          <RadioButton
            key={opt.value}
            className={optionClassName}
            label={opt.label}
            description={opt.description}
            value={opt.value}
            name={name}
            register={register}
            required={Boolean(required)}
          />
        ))}

        {err && <div className="mt-1 text-red-600">{getErrorMessage(err)}</div>}
      </div>
    </div>
  );
}

interface RadioButtonProps {
  register: UseFormRegister<any>;

  label: string;
  description?: React.ReactNode;
  value: string;
  name: string;
  required?: boolean;
  className?: string;
}

export function RadioButton(props: RadioButtonProps) {
  const { label, value, name, register, required, description } = props;
  const randomId = useRandomId();

  return (
    <div
      className={classNames({
        "flex mt-4": true,
        [props.className || ""]: props.className,
      })}
    >
      <input
        id={randomId}
        type="radio"
        className="form-radio block transition duration-150 ease-in-out text-purple-500 h-4 w-4 active:outline-none"
        value={value}
        {...register(name, {
          required,
        })}
      />
      <label htmlFor={randomId} className="-mt-0.5 ml-3 block">
        <div
          className={`text-gray-700 leading-tight ${
            description ? "font-medium" : ""
          }`}
        >
          {label}
        </div>
        {description && (
          <div className="text-gray-500 mt-1 leading-snug">{description}</div>
        )}
      </label>
    </div>
  );
}
