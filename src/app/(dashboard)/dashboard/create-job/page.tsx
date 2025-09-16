
"use client"

import type React from "react"
import { useState } from "react"
import { Formik, Form, Field, ErrorMessage, type FormikHelpers, FieldArray } from "formik"
import * as Yup from "yup"
import Image from "next/image"
import { CustomSelect } from "@/app/components/CustomSelect"
import SkillInput from "@/app/components/SkillsInput"
import { useJobContext } from "@/contexts/JobContext"
import { toast } from "react-toastify"
import { ArrowLeft, ArrowRight } from "lucide-react"

// ----- Types -----
export type CreateJobPayload = {
  job_title: string
  job_type: "full_time" | "part_time" | "contract" | "internship" | "temporary" | "freelance" | ""
  work_mode: "on_site" | "remote" | "hybrid" | ""
  department: string
  location: string
  salary_min: number | ""
  salary_max: number | ""
  salary_currency: "USD" | "EUR" | "GBP" | string | ""
  salary_type: "annual" | "monthly" | "hourly" | "stipend" | ""
  stipend_amount: number | null | ""
  no_of_openings: number | ""
  job_description: string
  required_skills: string[]; // <-- array now
  preferred_skills: string[];
  experience_level: "junior" | "mid" | "senior" | string | ""
  no_of_technical_rounds: number | ""
  interview_process: string
  application_deadline: string // yyyy-mm-dd
  hiring_manager_id: string
}
const userStr = localStorage.getItem("user");
const user = userStr ? JSON.parse(userStr) : null;
console.log(user)
// ----- Initial Values (example defaults taken from your payload) -----
const initialValues: CreateJobPayload = {
  job_title: "",
  job_type: "",
  work_mode: "",
  department: "",
  location: "",
  salary_min: 0,
  salary_max: 0,
  salary_currency: "",
  salary_type: "",
  stipend_amount: "",
  no_of_openings: 0,
  job_description: "",
  required_skills: [],// <-- array now
  preferred_skills: [],
  experience_level: "",
  no_of_technical_rounds: 0,
  interview_process: "",
  application_deadline: "",
  hiring_manager_id: user?.user_id || "", // <-- default UUID
}

// ----- Validation -----
const validationStepJob = Yup.object({
  job_title: Yup.string().required("Job title is required"),
  job_type: Yup.string()
    .oneOf(["full_time", "part_time", "contract", "internship", "temporary", "freelance"])
    .required("Job type is required"),
  work_mode: Yup.string().oneOf(["on_site", "remote", "hybrid"]).required("Work mode is required"),
  department: Yup.string().required("Department is required"),
  location: Yup.string().required("Location is required"),
  no_of_openings: Yup.number()
    .typeError("Openings must be a number")
    .min(1, "At least 1")
    .required("Number of openings is required"),
})

const validationStepReq = Yup.object({
  salary_min: Yup.number()
    .required("Salary min is required"),
  salary_max: Yup.number()
    .required("Salary max is required"),
  salary_currency: Yup.string().required("Currency is required"),
  salary_type: Yup.string().oneOf(["annual", "monthly", "hourly", "stipend"]).required("Salary type is required"),
  job_description: Yup.string().min(20, "Please provide a longer description").required("Job description is required"),

  stipend_amount: Yup.number()
    .typeError("Stipend must be a number")
    .min(0, "Must be >= 0")
    .when("salary_type", {
      is: "stipend",
      then: (schema) => schema.required("Stipend amount is required for stipend type"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
  required_skills: Yup.array()
    .of(Yup.string().required("Skill cannot be empty"))
    .min(1, "At least one required skill"),

  preferred_skills: Yup.array().of(Yup.string()),

  experience_level: Yup.string().required("Experience level is required"),
  no_of_technical_rounds: Yup.number()
    .typeError("Must be a number")
    .min(0, "Must be >= 0")
    .required("Number of rounds is required"),
  interview_process: Yup.string().required("Interview process is required"),
})

const validationStepPublish = Yup.object({
  application_deadline: Yup.string().required("Application deadline is required"),
  hiring_manager_id: Yup.string().uuid("Must be a valid UUID").required("Hiring manager is required"),
})

// 


// ----- Steps -----
type UI_StepKey = "job" | "jobSkills" | "publishing" | "success"

const steps: { key: UI_StepKey; label: string; icon: string }[] = [
  { key: "job", label: "Basic Job details", icon: "/assets/jobpost/download.svg" },
  { key: "jobSkills", label: "Job Skills Information", icon: "/assets/jobpost/download.svg" },
  { key: "publishing", label: "Form and Publish Setting", icon: "/assets/jobpost/setting.svg" },
  // { key: "success", label: "Finish", icon: "/assets/jobpost/setting.svg" },
]

const fieldsByStep: Record<Exclude<UI_StepKey, "success">, (keyof CreateJobPayload)[]> = {
  job: ["job_title", "job_type", "work_mode", "department", "location", "no_of_openings", "job_description"],
  jobSkills: [
    "salary_min",
    "salary_max",
    "salary_currency",
    "salary_type",
    "stipend_amount",
    "required_skills",
    "preferred_skills",
    "experience_level",
    "no_of_technical_rounds",
    "interview_process",
  ],
  publishing: ["application_deadline", "hiring_manager_id"],
}




const StepIndicator = ({ current, completedSteps }: { current: UI_StepKey; completedSteps: Set<UI_StepKey> }) => {
  const visibleSteps = steps.filter((s) => s.key !== "success")

  // const indexByKey = useMemo(() => Object.fromEntries(visibleSteps.map((s, i) => [s.key, i])), [])

  // const activeIndex = indexByKey[current] ?? visibleSteps.length

  const completedCount = Array.from(completedSteps).filter((step) => step !== "success").length
  const progressPercent = current === "success" ? 100 : (completedCount / visibleSteps.length) * 100

  return (
    <div className="relative w-full">
      <div className="w-[50%] bg-red-500">
        <div className="absolute gap-2 top-4 left-0 right-0 h-1 bg-gray-300 rounded-full z-0">
          <div
            className="h-1 bg-gradient-to-r from-[#FFC362d9] via-[#7721D3d9] to-[#2A3AE4d9] rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      <div className="relative flex items-center justify-between w-full z-10">
        {visibleSteps.map((s) => {
          const isCompleted = completedSteps.has(s.key)
          // const isActive = current === s.key
          // const shouldHighlight = isCompleted || isActive
          const iconHightLight = isCompleted
          return (
            <div key={s.key}>
              <div className="flex items-center justify-center gap-2 mt-10">
                <div
                  className="w-8 h-8 p-2 rounded-full transition-all duration-300"
                  style={{
                    background: iconHightLight
                      ? "linear-gradient(149.16deg, rgba(255, 195, 98, 0.85) 13.29%, rgba(119, 33, 211, 0.85) 36.34%, rgba(42, 58, 228, 0.85) 86.24%)"
                      : "#E3E3E3",
                  }}
                >
                  <Image src={s.icon || "/placeholder.svg"} alt="" width={32} height={32} className="w-full h-full object-contain" />
                </div>
                <span className="text-sm font-medium text-gray-700">{s.label}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ----- Field helpers -----
const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[18px] font-medium  text-[#21272A]">{children}</label>
)
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="mt-1 w-full rounded-md  p-2 border-1 border-[#D0D5DD] focus:border-[#5937B7] focus:ring-[#5937B7]"
  />
)

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className="mt-1 w-full rounded-md border-1 border-[#D0D5DD] focus:border-[#5937B7] focus:ring-[#5937B7]"
  />
)
const ErrorText = ({ name }: { name: keyof CreateJobPayload | string }) => (
  <div className="text-xs text-red-600 mt-1">
    <ErrorMessage name={name as string} />
  </div>
)

export default function CreateJobPage() {
  const [current, setCurrent] = useState<UI_StepKey>("job")
  const [completedSteps, setCompletedSteps] = useState<Set<UI_StepKey>>(new Set())
  const { addJob,loading } = useJobContext();

  const goNext = () => {
    const order: UI_StepKey[] = ["job", "jobSkills", "publishing", "success"]
    const i = order.indexOf(current)
    setCurrent(order[Math.min(i + 1, order.length - 1)])
  }
  const goBack = () => {
    const order: UI_StepKey[] = ["job", "jobSkills", "publishing", "success"]
    const i = order.indexOf(current)
    setCurrent(order[Math.max(i - 1, 0)])
  }

  const onSubmit = async (values: CreateJobPayload, helpers: FormikHelpers<CreateJobPayload>) => {
    const payload :any = {
      ...values,
      required_skills: Array.isArray(values.required_skills)
        ? values.required_skills.map((s) => s.trim()).filter(Boolean) // array -> trim & remove empty
        : [],

      preferred_skills: Array.isArray(values.preferred_skills)
        ? values.preferred_skills.map((s) => s.trim()).filter(Boolean)
        : [],

      stipend_amount:
        values.salary_type === "stipend" && values.stipend_amount !== "" ? Number(values.stipend_amount) : null,

      salary_min: values.salary_min === "" ? 0 : Number(values.salary_min),
      salary_max: values.salary_max === "" ? 0 : Number(values.salary_max),
      no_of_openings: values.no_of_openings === "" ? 0 : Number(values.no_of_openings),
      no_of_technical_rounds: values.no_of_technical_rounds === "" ? 0 : Number(values.no_of_technical_rounds),
    }

       try {
    const created:any = await addJob(payload) // your API call

    if (created?.success) {
      toast.success(created?.message || "Job created successfully!")
         console.log("Final Payload:", payload)
    helpers.setSubmitting(false)
    setCurrent("success")
    } else {
      toast.error(created?.message || "Failed to create job")
    }
  } catch (error: any) {
    toast.error(error?.message || "Something went wrong while creating job")
  }

 
  }


  const onSaveAsDraft = async (values: CreateJobPayload, helpers: FormikHelpers<CreateJobPayload>) => {
    const payload = {
      ...values,
      required_skills: Array.isArray(values.required_skills)
        ? values.required_skills.map((s) => s.trim()).filter(Boolean)
        : [],
      preferred_skills: Array.isArray(values.preferred_skills)
        ? values.preferred_skills.map((s) => s.trim()).filter(Boolean)
        : [],
      stipend_amount:
        values.salary_type === "stipend" && values.stipend_amount !== "" ? Number(values.stipend_amount) : null,
      salary_min: values.salary_min === "" ? 0 : Number(values.salary_min),
      salary_max: values.salary_max === "" ? 0 : Number(values.salary_max),
      no_of_openings: values.no_of_openings === "" ? 0 : Number(values.no_of_openings),
      no_of_technical_rounds: values.no_of_technical_rounds === "" ? 0 : Number(values.no_of_technical_rounds),
      status: "draft",
    }

    console.log("Draft Payload:", payload)
    helpers.setSubmitting(false)
    alert("Job saved as draft!")
  }


const renderActions = (
  submit?: boolean,
  validateAndNext?: () => void,
  formikProps?: any
) => (
  <div className="flex items-center justify-between gap-2 pt-4">
    {/* Left side (Previous button) */}
    <button
      type="button"
      onClick={goBack}
      className="px-4 py-2 text-[10px] md:text-[16px] flex items-center gap-2 rounded-md border border-[#5937B7] text-[#5937B7] hover:bg-gray-50"
    >
      <ArrowLeft size={18} /> Previous
    </button>

    {/* Right side */}
    {submit ? (
      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded-md flex items-center justify-center bg-[#5937B7] text-white hover:bg-[#4b2fa0] ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading && (
          <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
        )}
        {loading ? "Submitting..." : "Submit"}
      </button>
    ) : (
      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={() =>
            formikProps && onSaveAsDraft(formikProps.values, formikProps)
          }
          className="px-4 py-2 text-[10px] md:text-[16px] rounded-md border border-[#5937B7] text-[#5937B7] hover:bg-gray-50"
        >
          Save as Draft
        </button>

        <button
          type="button"
          onClick={validateAndNext}
          className="px-4 py-2 flex text-[10px] md:text-[16px] items-center gap-3 rounded-md bg-[#5937B7] text-white hover:bg-[#4b2fa0]"
        >
          Continue <ArrowRight size={18} />
        </button>
      </div>
    )}
  </div>
)


  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 ">
          <h2 className="text-lg font-semibold text-gray-900">Post a job</h2>
          <p className="text-sm text-gray-500">Welcome to Your Job Creation Page – Post and Manage Opportunities Easily.</p>
        </div>
        <div className="px-6 py-4 md:w-[80%] mx-auto">
          <StepIndicator current={current} completedSteps={completedSteps} />
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={
          current === "job"
            ? validationStepJob
            : current === "jobSkills"
              ? validationStepReq
              : current === "publishing"
                ? validationStepPublish
                : undefined
        }
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, validateForm, setTouched, errors, resetForm, ...formikProps }: any) => {
          const validateAndNext = async () => {
            const stepKey = current as Exclude<UI_StepKey, "success">
            const stepFields = fieldsByStep[stepKey]
            setTouched(
              stepFields.reduce((acc, k) => ({ ...acc, [k]: true }), {}),
              false,
            )

            const formErrors = await validateForm()
            const hasErrors = stepFields.some((k) => Boolean((formErrors as any)[k]))
            if (!hasErrors) {
              setCompletedSteps((prev) => new Set([...prev, stepKey]))
              goNext()
            }
          }

          return (
            <Form>
              {current === "job" && (
                <div className="p-6 space-y-6">
                  <h3 className="text-base font-semibold text-gray-900">Job Information</h3>
                  <div className="bg-white  rounded-lg p-6 space-y-6 border-1 border-[#EAECF0]">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Job Title</Label>
                        <p className="text-[#6B7280]">Enter the job title for the position you are seeking to make</p>
                        <Field name="job_title" as={Input} placeholder="e.g. AI Specialist" />
                        <ErrorText name="job_title" />
                      </div>
                      <div>
                        <Label >Department</Label>
                        <p className="text-[#6B7280]">Enter the departmenet</p>
                        <Field name="department" as={Input} placeholder="Engineering" />
                        <ErrorText name="department" />
                      </div>
                      <div>
                        <Label>Job Type</Label>
                        <Field name="job_type">
                          {({ field, form }: any) => (
                            <CustomSelect
                              name={field.name}
                              value={field.value}
                              onChange={(val) => form.setFieldValue(field.name, val)}
                              options={[

                                { value: "full_time", label: "Full-time" },
                                { value: "part_time", label: "Part-time" },
                                { value: "internship", label: "Internship" },
                                { value: "onsite", label: "On-Site" },
                                { value: "remote", label: "Remote" },
                              ]}
                              placeholder="Select job type"
                            />
                          )}
                        </Field>


                        <ErrorText name="job_type" />
                      </div>
                      <div>
                        <Label>Work Mode</Label>
                        <Field name="work_mode">
                          {({ field, form }: any) => (
                            <CustomSelect
                              name={field.name}
                              value={field.value}
                              onChange={(val) => form.setFieldValue(field.name, val)}
                              options={[

                                { value: "onsite", label: "On-Site" },
                                { value: "hybrid", label: "Hybrid" },

                                { value: "remote", label: "Remote" },
                              ]}
                              placeholder="Remote"
                            />
                          )}
                        </Field>


                        <ErrorText name="work_mode" />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Field name="location" as={Input} placeholder="City, Country" />
                        <ErrorText name="location" />
                      </div>
                      <div>
                        <Label>Number of Openings</Label>
                        <Field name="no_of_openings" as={Input} type="number" min={1} />
                        <ErrorText name="no_of_openings" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white  rounded-lg p-6 space-y-6 border-1 border-[#EAECF0]">
                    <span>Compensation</span>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label>Salary Min</Label>
                        <Field name="salary_min">
  {({ field, form }: any) => (
    <CustomSelect
      name={field.name}
      value={field.value}
      onChange={(val) => form.setFieldValue(field.name, val)}
     options={[
  { value: "20000", label: "Up to $20,000 (2)" },
  { value: "40000", label: "$40,000 (2)" },
  { value: "75000", label: "$75,000 (7)" },
]}

      placeholder="Select salary Min"
    />
  )}
</Field>

                        <ErrorText name="salary_min" />
                      </div>
                      <div>
                        <Label>Salary Max</Label>
                         <Field name="salary_max">
  {({ field, form }: any) => (
    <CustomSelect
      name={field.name}
      value={field.value}
      onChange={(val) => form.setFieldValue(field.name, val)}
       options={[
  { value: "20000", label: "Up to $20,000 (2)" },
  { value: "40000", label: "$40,000 (2)" },
  { value: "75000", label: "$75,000 (7)" },
]}
      placeholder="Select salary Max"
    />
  )}
</Field>
                        <ErrorText name="salary_max" />
                      </div>
                      <div>
                        <Label>Currency</Label>
                        <Field name="salary_currency">
                          {({ field, form }: any) => (
                            <CustomSelect
                              name={field.name}
                              value={field.value}
                              onChange={(val) => form.setFieldValue(field.name, val)}
                              options={[

                                { value: "USD", label: "USD" },
                                { value: "EUR", label: "EUR" },
                                { value: "GBP", label: "GBP" },
                              ]}
                              placeholder="Currency"
                            />
                          )}
                        </Field>

                        <ErrorText name="salary_currency" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Salary Type</Label>
                        <Field name="salary_type">
                          {({ field, form }: any) => (
                            <CustomSelect
                              name={field.name}
                              value={field.value}
                              onChange={(val) => form.setFieldValue(field.name, val)}
                              options={[

                                { value: "annual", label: "Annual" },
                                { value: "monthly", label: "Monthly" },

                              ]}
                              placeholder="Salary Type"
                            />
                          )}
                        </Field>


                        <ErrorText name="salary_type" />
                      </div>
                      <div>
                        <Label>Stipend Amount (only for stipend)</Label>
                        <Field name="stipend_amount" as={Input} placeholder="e.g. 1000" />
                        <ErrorText name="stipend_amount" />
                      </div>
                    </div>
                  </div>

                  {renderActions(false, validateAndNext, { values, ...formikProps })}
                </div>
              )}

              {current === "jobSkills" && (
                <div className="bg-white shadow rounded-lg p-6 space-y-6">
                  <h3 className="text-base font-semibold text-gray-900">Compensation & Skills</h3>


                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Required Skills (comma separated)</Label>
                      <FieldArray
                        name="required_skills"
                        render={(arrayHelpers) => (
                          <SkillInput
                            name="required_skills"
                            values={values?.required_skills || []}  // fallback to []
                            onAdd={(val) => arrayHelpers.push(val)}
                            onRemove={(i) => arrayHelpers.remove(i)}
                          />
                        )}
                      />
                      <ErrorText name="required_skills" />
                    </div>
                    <div>
                      <Label>Preferred Skills (comma separated)</Label>
                      <FieldArray
                        name="preferred_skills"
                        render={(arrayHelpers) => (
                          <SkillInput
                            name="required_skills"
                            values={values?.preferred_skills || []}  // fallback to []
                            onAdd={(val) => arrayHelpers.push(val)}
                            onRemove={(i) => arrayHelpers.remove(i)}
                          />
                        )}
                      />
                      <ErrorText name="preferred_skills" />
                    </div>
                    <div>
                      <Label>Experience Level</Label>
                      <Field name="experience_level">
                        {({ field, form }: any) => (
                          <CustomSelect
                            name={field.name}
                            value={field.value}
                            onChange={(val) => form.setFieldValue(field.name, val)}
                            options={[

                              { value: "junior", label: "Junior" },
                              { value: "mid", label: "Mid" },
                              { value: "senior", label: "Senior" },


                            ]}
                            placeholder="Experience Level"
                          />
                        )}
                      </Field>


                      <ErrorText name="experience_level" />
                    </div>
                    <div>
                      <Label>No. of Technical Rounds</Label>
                      <Field name="no_of_technical_rounds" as={Input} type="number" min={0} />
                      <ErrorText name="no_of_technical_rounds" />
                    </div>
                  </div>
                  <div>
                    <Label>Interview Process</Label>
                    <Field name="interview_process" as={TextArea} rows={5} />
                    <ErrorText name="interview_process" />
                  </div>
                  <div>
                    <Label>Job Description</Label>
                    <Field name="job_description" as={TextArea} rows={5} />
                    <ErrorText name="job_description" />
                  </div>
                  {renderActions(false, validateAndNext, { values, ...formikProps })}
                </div>
              )}

              {current === "publishing" && (
                <div className="bg-white shadow rounded-lg p-6 space-y-6">
                  <h3 className="text-base font-semibold text-gray-900">Publishing</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Application Deadline</Label>
                      <Field name="application_deadline" as={Input} type="date" />
                      <ErrorText name="application_deadline" />
                    </div>
                    <div>
                      <Label>Hiring Manager ID (UUID)</Label>
                      <Field name="hiring_manager_id" as={Input} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
                      <ErrorText name="hiring_manager_id" />
                    </div>
                  </div>
                  {renderActions(true, undefined, { values, ...formikProps })}
                </div>
              )}

              {current === "success" && (
                <div className="bg-white shadow rounded-lg p-10 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Job Posted Successfully!</h3>
                  <p className="text-sm text-gray-600">Your job has been created and is ready to receive candidates.</p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <a href="/dashboard" className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50">
                      View Dashboard
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        resetForm()
                        setCurrent("job")
                        setCompletedSteps(new Set())
                      }} className="px-4 py-2 rounded-md bg-[#5937B7] text-white hover:bg-[#4b2fa0]"
                    >
                      Post Another Job
                    </button>
                  </div>
                </div>
              )}
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
