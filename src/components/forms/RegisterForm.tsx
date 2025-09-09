"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { useState } from "react";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import {
  BriefcaseBusiness,
  Building2,
  Globe,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";

type Mode = "login" | "register";

interface AuthFormProps {
  mode: Mode;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const { login, register, loading } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");

  const initialValues =
    mode === "login"
      ? { email: "", password: "" }
      : {
          email: "",
          password: "",
          first_name: "",
          last_name: "",
          gender: "",
          job_title: "",
          company: "",
          company_website: "",
          hiring_description: "",
        };

  const validationSchema =
    mode === "login"
      ? Yup.object({
          email: Yup.string().email("Invalid email").required("Email required"),
          password: Yup.string().required("Password required"),
        })
      : Yup.object({
          first_name: Yup.string().required("First name required"),
          last_name: Yup.string().required("Last name required"),
          email: Yup.string().email("Invalid email").required("Email required"),
          password: Yup.string()
            .min(3, "Min 3 chars")
            .required("Password required"),
          gender: Yup.string().required("Gender required"),
          job_title: Yup.string().required("Job title required"),
          company: Yup.string().required("Company required"),
          company_website: Yup.string()
            .url("Must be a valid URL")
            .required("Company website required"),
          hiring_description: Yup.string().required(
            "Hiring description required"
          ),
        });

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      if (mode === "login") {
        await login(values);
        toast.success("Welcome back 👋");
      } else {
        await register(values);
        resetForm();
        setSuccessMessage("Account created successfully!");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="  bg-white p-12   ">
      <h2 className="text-2xl font-semibold  font-spartan text-center text-[#5937B7]">
        {mode === "login" ? "Sign In" : "Create Account"}
      </h2>
      <p className="text-center text-[#5937B7] text-lg font-normal pb-10">
        Join HireCoop and start your recruitment journey
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {mode === "register" && (
              <>
                <FormInput
                  label="First Name"
                  name="first_name"
                  placeholder="Enter your first name"
                  icon={<User color="#5937B7" size={18} />}
                />
                <FormInput
                  label="Last Name"
                  name="last_name"
                  placeholder="Enter your last name"
                  icon={<User color="#5937B7" size={18} />}
                />
              </>
            )}

            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              icon={<Mail color="#5937B7" size={18} />}
            />
            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              icon={<LockKeyhole color="#5937B7" size={18} />}
            />
            {mode === "register" && (
              <>
                <FormSelect
                  label="Gender"
                  name="gender"
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                />
                <FormInput
                  label="Job Title"
                  name="job_title"
                  placeholder="Enter your job tittle"
                  icon={<BriefcaseBusiness color="#5937B7" size={18} />}
                />
                <FormInput
                  label="Company"
                  name="company"
                  placeholder="Enter your company name"
                  icon={<Building2 color="#5937B7" size={18} />}
                />
                <FormInput
                  label="Company Website"
                  name="company_website"
                  type="url"
                  placeholder="Enter your company website"
                  icon={<Globe color="#5937B7" size={18} />}
                />
                <label className="block font-medium mb-1  text-[#5937B7]">
                  Hiring Description
                </label>
                <Field
                  as="textarea"
                  id="hiring_description"
                  name="hiring_description"
                  placeholder="Describe what kind of talent you are looking...."
                  className="w-full p-5 border-none rounded-xl bg-[#E9E7FF] focus:ring-2 placeholder-[#5937B7B2]"
                />
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-[#5937B7] text-white py-4 font-medium text-xl rounded-full hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading && (
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              )}
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
            <span className="flex items-center justify-center text-center">
              {mode === "register" ? (
                <>
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#5937B7] pl-1">
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <Link href="/" className="text-[#5937B7] pl-1">
                    Register
                  </Link>
                </>
              )}
            </span>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AuthForm;
