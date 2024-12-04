import { FieldState } from "@tanstack/react-form";

export function useErrorTransform() {
  const getInputStatus = (state: FieldState<string>) => {
    const status = {
      invalid: false,
      messageOnChange: "",
      messageOnSubmit: ""
    };

    if (state.meta.errors.length > 0) {
      status.invalid = true;
      status.messageOnChange = state.meta.errorMap.onChange?.toString() ?? "";
      status.messageOnSubmit = state.meta.errorMap.onSubmit?.toString() ?? "";
    }

    return status;
  };

  return { getInputStatus };
}
