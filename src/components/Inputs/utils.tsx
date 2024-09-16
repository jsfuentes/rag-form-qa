import {
  FieldError,
  FieldErrors,
  FieldErrorsImpl,
  Merge,
} from "react-hook-form";
const debug = require("debug")("app:Inputs:utils");

export function getErrorMessage(
  errors: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
) {
  if (!errors || !errors.type) {
    return;
  }

  const type = errors.type;
  debug(type, typeof type);
  switch (type) {
    case "maxLength":
      return "This field is too long";
    case "max":
      return "Value is too large";
    case "required":
      return "Oops, you missed this field";
    case "pattern":
      return `Please match the format requested`;
    case "unembeddable":
      return "This link is not embeddable";
    case "upload_missing":
      return "Please upload a file";
    default:
      return "Invalid value";
  }
}

export function generateErrorMessage(
  errors: FieldErrors,
  key: keyof FieldErrors
) {
  if (!errors) {
    console.error("No error message if no error");
    return "";
  }
  const err = getError(errors, key);
  if (!err) {
    return "";
  }

  return getErrorMessage(err);
}

export function getError(errors: FieldErrors, name: string) {
  let err: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined =
    undefined;
  for (const subKey of name.split(".")) {
    // debug("TEST", { err, subKey, name, errors });
    if (errors && subKey in errors) {
      err = errors[subKey];
      break;
    } else {
      return undefined;
    }
  }

  return err;
}
