import { useEffect } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { getError, getErrorMessage } from "src/components/Inputs/utils";
import { useRandomId } from "src/utils/hooks";
// import { isDesktop } from "src/utils/utils";

const debug = require("debug")("app:Form:TextAreaInput");

// const TEXTAREA_COLS = isDesktop ? 4 : 5;
const TEXTAREA_COLS = 4;

interface TextAreaInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;

  name: string;
  rows: number;
  maxLength?: number;
  placeholder?: string;
  title?: string;
  className?: string;
  autoFocus?: boolean;
  delayAutoFocus?: boolean; //after 150 seconds focus(needed if animates in apparently or jank)
  required?: boolean;
}

TextAreaInput.defaultProps = {
  rows: TEXTAREA_COLS,
};

export default function TextAreaInput(props: TextAreaInputProps) {
  const {
    title,
    placeholder,
    name,
    register,
    required,
    errors,
    className,
    rows,
    autoFocus,
    delayAutoFocus,
  } = props;
  const randomId = useRandomId();
  const err = getError(props.errors, name);

  useEffect(() => {
    if (delayAutoFocus) {
      const timeoutId = setTimeout(() => {
        const el = document.getElementById(randomId);
        el && el.focus();
      }, 150);
      return () => clearTimeout(timeoutId);
    }
  }, [delayAutoFocus, randomId]);

  return (
    <div className={className}>
      {title && (
        <label
          htmlFor={randomId}
          className="block font-medium leading-5 text-gray-600"
        >
          {title}
        </label>
      )}
      <div className="mt-2">
        <textarea
          className="form-input block w-full transition duration-150 ease-in-out"
          id={randomId}
          rows={rows}
          placeholder={placeholder}
          {...register(name, {
            required,
            maxLength: props.maxLength,
          })}
          autoFocus={autoFocus || false}
        />
        {err && <div className="mt-1 text-red-600">{getErrorMessage(err)}</div>}
      </div>
    </div>
  );
}
