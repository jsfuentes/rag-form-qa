import classNames from "classnames";
import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { getError, getErrorMessage } from "src/components/Inputs/utils";
import { useRandomId } from "src/utils/hooks";

const debug = require("debug")("app:Form:NumberInput");

interface NumberInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;

  name: string;
  placeholder?: number;
  title?: string;
  required?: boolean;
  min?: number;
  max?: number;
  className?: string;
  inputClassName?: string;
  icon?: React.ReactNode;
}

NumberInput.defaultProps = {
  min: 0,
};

export default function NumberInput(props: NumberInputProps) {
  const {
    title,
    placeholder,
    name,
    register,
    required,
    errors,
    className,
    icon,
    inputClassName,
  } = props;
  const randomId = useRandomId();
  const err = getError(errors, name);

  const registerOpts: {
    required: boolean;
    valueAsNumber: boolean;
    min?: number;
    max?: number;
  } = {
    required: Boolean(required),
    valueAsNumber: true,
  };
  if (props.min !== null) {
    registerOpts.min = props.min;
  }
  if (props.max !== null) {
    registerOpts.max = props.max;
  }

  return (
    <div className={className}>
      {title && (
        <label
          htmlFor={randomId}
          className="block font-medium leading-5 text-gray-600 mb-2"
        >
          {title}
        </label>
      )}
      <div className="relative">
        {icon}

        <input
          type="number"
          id={randomId}
          className={classNames({
            "form-input overflow-text": true,
            [inputClassName || ""]: inputClassName,
          })}
          placeholder={
            typeof placeholder === "number"
              ? placeholder.toString()
              : placeholder
          }
          {...register(name, registerOpts)}
          min={props.min}
        />
      </div>
      {err && <div className="mt-1 text-red-600">{getErrorMessage(err)}</div>}
    </div>
  );
}
