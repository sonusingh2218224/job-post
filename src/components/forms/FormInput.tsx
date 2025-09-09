// "use client";
// import { Field, ErrorMessage } from "formik";

// interface FormInputProps {
//   label: string;
//   name: string;
//   type?: string;
//   as?: "input" | "textarea";
// }

// const FormInput = ({
//   label,
//   name,
//   type = "text",
//   as = "input",
// }: FormInputProps) => {
//   return (
//     <div>
//       <label htmlFor={name} className="block mb-1 font-medium text-[#5937B7]">
//         {label}
//       </label>
//       <Field
//         as={as}
//         id={name}
//         name={name}
//         type={type}
//         className="w-full p-4 border  focus:ring-2 bg-[#E9E7FF] border-none rounded-full"
//       />
//       <ErrorMessage
//         name={name}
//         component="div"
//         className="text-red-500 text-sm mt-1"
//       />
//     </div>
//   );
// };

// export default FormInput;
"use client";
import { Field, ErrorMessage } from "formik";
import { ReactNode } from "react";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  as?: "input" | "textarea";
  placeholder?: string;
  icon?: ReactNode; // Pass SVG or Icon component
}

const FormInput = ({
  label,
  name,
  type = "text",
  as = "input",
  placeholder,
  icon,
}: FormInputProps) => {
  return (
    <div>
      <label htmlFor={name} className="block mb-1 font-medium text-[#5937B7]">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <Field
          as={as}
          id={name}
          name={name}
          type={type}
          style={{ "::placeholder": { color: "red" } }} // Custom red
          placeholder={placeholder}
          className={`w-full py-4  border focus:ring-2 bg-[#E9E7FF] border-none rounded-full ${
            icon ? "pl-12" : ""
          } placeholder-[#5937B7B2]`}
        />
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

export default FormInput;
