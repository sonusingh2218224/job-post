import api from "@/lib/api";

export interface JobPayload {
  job_title: string;
  job_type: "full_time" | "part_time" | "contract" | "internship" | "temporary";
  work_mode: "remote" | "onsite" | "hybrid";
  department: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  salary_type: "annual" | "monthly" | "hourly";
  stipend_amount: number | null;
  no_of_openings: number;
  job_description: string;
  required_skills: string[];
  preferred_skills: string[];
  experience_level: "junior" | "mid" | "senior" | "lead";
  no_of_technical_rounds: number;
  interview_process: string;
  application_deadline: string; // ISO date string
  hiring_manager_id: string;
}
  const userStr = localStorage.getItem("organization_id"); // or however you're storing it

export const createJob = async (data: JobPayload) => {

  const res = await api.post("/jobs/", data, {
    headers: {
      "X-Organization-ID": userStr,
    },
  });

  return res.data;
};


export const getJobs = async (limit:string) => {
const res = await api.get(`/jobs/?limit=100`, {
  headers: {
    "X-Organization-ID": userStr,
  },
});

  
  return res.data;
};

export const getJobById = async (id: string) => {
  const res = await api.get(`/jobs/${id}/`,{
     headers: {
    "X-Organization-ID": userStr,
  },
  });
  return res.data;
};

export const updateJob = async (id: string, data: Partial<JobPayload>) => {
  const res = await api.patch(`/jobs/${id}/`, data);
  return res.data;
};

export const deleteJob = async (id: string) => {
  const res = await api.delete(`/jobs/${id}/`,{
      headers: {
    "X-Organization-ID": userStr,
  },
  });
  return res.data;
};
