import classNames from "classnames";
import React from "react";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  useWatch,
} from "react-hook-form";
import { getError, getErrorMessage } from "src/components/Inputs/utils";
const debug = require("debug")("app:AutosizeTextArea");

interface AutosizeTextAreaProps {
  control: Control<any, object>;
  errors: FieldErrors;
  register: UseFormRegister<any>;
  name: string;
  required?: boolean;

  placeholder: string;
  className?: string;
  inputClassName?: string;
}

//https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/
// divs autoexpand based on the contents so have the div autoexpand which expands the parent which expands the textarea
// div auto changes padding based on what is given, so don't set horizontal padding
export default function AutosizeTextArea(props: AutosizeTextAreaProps) {
  const {
    control,
    errors,
    register,
    name,
    required,
    placeholder,
    className,
    inputClassName,
  } = props;

  const value = useWatch({
    control,
    name: name,
  });

  const err = getError(errors, name);
  const finalInputClassName = classNames({
    "pl-1 w-full whitespace-pre-wrap break-words border-none border-transparent ring-0 focus:ring-0 active:ring-0 appearance-none outline-nonefocus:outline-none placeholder-gray-400 bg-gray-50 mousetrap overflow-hidden":
      true,
    [inputClassName || ""]: inputClassName,
  });

  return (
    <div
      className={classNames({
        "flex flex-row items-center border border-gray-250 rounded-xl text-gray-900 bg-gray-50 focus-within-luminous-border-lightened":
          true,
        [className || ""]: className,
      })}
    >
      <div className="flex-1 relative overflow-hidden m-[7px]">
        <div className={`${finalInputClassName} pt-4`}>
          {value || placeholder}
        </div>
        <textarea
          data-cy="chat-input"
          className={`${finalInputClassName} absolute p-0 top-0 w-full h-full`}
          {...register(name, {
            required,
          })}
          placeholder={placeholder}
          style={{ resize: "none" }}
          spellCheck={true}
        />
      </div>
      {err && <div className="mt-1 text-red-600">{getErrorMessage(err)}</div>}
    </div>
  );
}
