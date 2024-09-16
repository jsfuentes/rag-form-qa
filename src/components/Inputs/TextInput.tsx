import React, { HTMLInputTypeAttribute } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useRandomId } from "src/utils/hooks";
import { getError, getErrorMessage } from "./utils";

const debug = require("debug")("app:Form:TextInput");

interface TextInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;

  id?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  title?: React.ReactNode;
  prefix?: React.ReactNode;
  pattern?: RegExp;
  className?: string;
  autoFocus?: boolean;
  style?: React.CSSProperties;
  disabled?: boolean;
  type?: HTMLInputTypeAttribute;
  maxLength?: number;
  validate?: (value: string) => boolean | string;
}

export default function TextInput(props: TextInputProps) {
  const {
    title,
    placeholder,
    name,
    register,
    required,
    pattern,
    errors,
    className,
    autoFocus,
    style,
    disabled,
    id,
    prefix,
    maxLength,
    validate,
  } = props;
  const randomId = useRandomId();

  const err = getError(props.errors, name);
  return (
    <div id={id} className={className}>
      {title && (
        <label
          htmlFor={randomId}
          className="block font-medium leading-5 text-gray-600"
        >
          {title}
        </label>
      )}
      <div className="mt-2">
        <div className="flex flex-row items-center">
          {prefix && (
            <div className="text-gray-700 font-medium flex-none">{prefix}</div>
          )}
          <input
            id={randomId}
            type={props.type || "text"}
            className="form-input"
            placeholder={placeholder}
            {...register(name, {
              required,
              maxLength: maxLength ? maxLength : 250,
              pattern: pattern ? pattern : undefined,
              validate: (value) => {
                return (
                  (validate && validate(value)) || !required || !!value.trim()
                );
              },
            })}
            autoComplete="off"
            autoFocus={autoFocus || false}
            style={style}
            disabled={disabled}
          />
        </div>

        {err && <div className="mt-1 text-red-500">{getErrorMessage(err)}</div>}
      </div>
    </div>
  );
}
