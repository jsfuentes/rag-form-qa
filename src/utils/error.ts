import * as Sentry from "@sentry/react";

// Only returns the first error
export function traverseChangesetError(changesetError: any): string {
  try {
    if (typeof changesetError === "string") {
      return changesetError;
    } else if (typeof changesetError === "object") {
      //if its an array
      if ("forEach" in changesetError) {
        let errMsg = "";
        //only return first nonempty error
        changesetError.forEach((changesetError: any) => {
          const newError = traverseChangesetError(changesetError);
          if (errMsg.length === 0 && newError.length > 1) {
            errMsg = " " + newError;
          }
        });
        return errMsg;
      } else {
        for (const [key, value] of Object.entries(changesetError)) {
          const errString = key;
          return errString + " " + traverseChangesetError(value);
        }
      }
    }
  } catch (err) {
    Sentry.captureException(err, { extra: { changesetError } });
  }

  return "";
}
