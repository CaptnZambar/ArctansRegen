import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className=
        "py-4 px-9 text-white font-semibold rounded-xl bg-custom-yellow-100 cursor-pointer hover:bg-custom-yellow-200 transition ease-in-out duration-200 bg-gradient-to-l from-custom-yellow-200 to-custom-yellow-300"
    >
      {children}
    </button>
  );
};

export default Button;
