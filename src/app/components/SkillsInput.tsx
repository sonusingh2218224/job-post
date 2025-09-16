"use client"
import { X } from "lucide-react";
import { useState } from "react";

function SkillInput({
  values,
  onAdd,
  onRemove,
  name
}: {
  values: string[];
  onAdd: (val: string) => void;
  onRemove: (index: number) => void;
  name:any
}) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      if (!values.includes(inputValue.trim())) {
        onAdd(inputValue.trim());
      }
      setInputValue("");
    }
  };

  return (
    <div className="mt-1 border rounded-md p-2 flex flex-wrap gap-2">
      {values?.map((skill, index) => (
        <span
          key={index}
          className="flex items-center bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm"
        >
          {skill}
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="ml-1 text-purple-700 hover:text-purple-900"
          >
            <X size={14} />
          </button>
        </span>
      ))}

      <input
        type="text"
        value={inputValue}
        placeholder="Type a skill and press enter"
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 outline-none px-1 text-sm"
      />
    </div>
  );
}


export default SkillInput;