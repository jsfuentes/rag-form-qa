import classNames from "classnames";
import React from "react";
import { UseFormRegister } from "react-hook-form";
import { useRandomId } from "src/utils/hooks";

const debug = require("debug")("app:Form:Inputs");

interface CheckboxInputProps {
  register: UseFormRegister<any>;

  title: string;
  name: string;
  className?: string;
  inverse?: boolean;
}

export default function CheckboxInput(props: CheckboxInputProps) {
  const { title, name, register, className, inverse } = props;
  const randomId = useRandomId();

  return (
    <div
      className={classNames({
        "text-gray-700 flex": true,
        "flex-row-inverse": inverse,
        "flex-row": !inverse,
        [className || ""]: className,
      })}
    >
      <input
        id={randomId}
        type="checkbox"
        className="mt-1 block transition duration-150 ease-in-out"
        {...register(name)}
      />
      {title && (
        <label htmlFor={randomId} className="ml-1.5 flex leading-snug">
          {title}
        </label>
      )}
    </div>
  );
}
