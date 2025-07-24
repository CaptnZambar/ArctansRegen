import React, { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ id, name, error, className = "", ...rest }, ref) => (
    <div className="flex flex-col">
      <input
        id={id}
        name={name}
        ref={ref}
        className={
          `px-4 py-3.5 text-white placeholder-gray-400 bg-transparent outline-none border rounded-lg focus:ring focus:ring-indigo-300 ` +
          `border-gray-800 ${className}`
        }
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
);

Input.displayName = "Input";
export default Input;
