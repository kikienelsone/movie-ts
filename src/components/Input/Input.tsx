import React, { useState } from "react";
import "./Input.css";
interface InputProps {
  delay: (arg: string, arg1: number | null) => void;
}
const Input: React.FC<InputProps> = ({ delay }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <input
      className="input"
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);
        delay(e.target.value, null);
      }}
      placeholder="Type to search..."
    />
  );
};
export default Input;
