import React, { useState } from "react";
import "./Input.css";
interface InputProps {
  delay: (arg: string) => void;
}
const Input: React.FC<InputProps> = ({ delay }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <input
      className="input"
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);
        delay(inputValue);
      }}
      placeholder="Type to search..."
    />
  );
};
export default Input;
