import React, { useMemo } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useRandomId } from "src/utils/hooks";

const debug = require("debug")("app:Form:TelephoneInput");

interface TelephoneInputProps {
  control: Control<any, object>;
  errors: FieldErrors;

  name: string;
  title?: string;
  required?: boolean;
  className?: string;
}

export default function TelephoneInput(props: TelephoneInputProps) {
  const { title, name, control, errors, className, required } = props;
  const randomId = useRandomId();

  //literally only to apply styling to input, useMemo is to stop rerender which loses focus on error
  const CPI = useMemo(() => {
    return React.forwardRef<HTMLInputElement>(function CustomPhoneInput(
      props,
      ref
    ) {
      return (
        <input
          ref={ref}
          {...props}
          className="w-full form-input block transition duration-150 ease-in-out ml-2"
        />
      );
    });
  }, []);

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
        <Controller
          control={control}
          name={name}
          rules={{
            required,
            validate: (value) =>
              !value || isPossiblePhoneNumber(value) || "Invalid number",
          }}
          //injects value, onChange
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <PhoneInput
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              international
              defaultCountry="US"
              placeholder="Enter phone number with country code"
              className=""
              inputComponent={CPI}
            />
          )}
          defaultValue={""}
        />

        {errors && errors[name] && (
          <div className="mt-1 text-red-500">Invalid phone number</div>
        )}
      </div>
    </div>
  );
}
