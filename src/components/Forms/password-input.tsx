"use client";

import * as React from "react";
import Input, { InputProps } from "./input";
import { EyeClosed, Eye } from "lucide-react";

export default function PasswordInput({
  label,
  id,
  className,
  ...inputProps
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <Input
        label={label}
        id={id}
        type={showPassword ? "text" : "password"}
        className={className}
        {...inputProps}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute top-[2.1rem] right-0 pr-3 flex items-center text-sm leading-5"
      >
        {showPassword ? (
          <Eye className="w-5 h-5" />
        ) : (
          <EyeClosed className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
