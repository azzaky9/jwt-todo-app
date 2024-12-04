import React from "react";

type HTMLInputAttributes = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export interface InputProps extends HTMLInputAttributes {
  label: string;
  id: string;
  invalid?: boolean;
}

export default function Input({
  label,
  id,
  className,
  invalid,
  ...inputProps
}: InputProps) {
  const invalidClass = invalid ? "invalid" : "";

  return (
    <div>
      <label
        htmlFor={id}
        className={`block text-sm font-medium ${
          inputProps.disabled ? "text-gray-400" : ""
        }  ${invalid ? "text-red-500" : "text-gray-700"}`}
      >
        {label}
      </label>
      <input
        id={id}
        className={`base-input ${invalidClass} ${className}`}
        {...inputProps}
      />
    </div>
  );
}
