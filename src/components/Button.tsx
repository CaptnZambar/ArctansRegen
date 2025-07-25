import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={
        `py-4 px-9 font-semibold rounded-xl transition ease-in-out duration-200 ` +
        `text-white bg-custom-yellow-100 hover:bg-custom-yellow-200 bg-gradient-to-l ` +
        `from-custom-yellow-200 to-custom-yellow-300 ` +
        (disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer")
      }
    >
      {children}
    </button>
  );
};

export default Button;
