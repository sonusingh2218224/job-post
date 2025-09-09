"use client";
import { Field, ErrorMessage } from "formik";

interface FormSelectProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
}

const FormSelect = ({ label, name, options }: FormSelectProps) => {
  return (
    <div>
      <label htmlFor={name} className="block mb-1 font-medium text-[#5937B7]">
        {label}
      </label>
      <Field
        as="select"
        id={name}
        name={name}
        className="w-full p-5  border-none rounded-full bg-[#E9E7FF] text-[#5937B7] focus:ring-2"
      >
        <option value="" disabled hidden className="text-[#5937B7B2]">
          Select your gender
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Field>

      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

export default FormSelect;
