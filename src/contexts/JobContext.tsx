// src/context/JobContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  JobPayload,
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "@/services/jobService";

export interface Job {
  id: string;
  job_title: string;
  job_type: string;
  work_mode: string;
  department: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  salary_type: string;
  stipend_amount: number | null;
  no_of_openings: number;
  job_description: string;
  required_skills: string[];
  preferred_skills: string[];
  experience_level: string;
  no_of_technical_rounds: number;
  interview_process: string;
  application_deadline: string;
  hiring_manager_id: string;
  created_at?: string;
  updated_at?: string;
}

interface JobContextType {
  jobs: Job[];
  loading: boolean;
  fetchJobs: () => Promise<void>;
  fetchJobById: (id: string) => Promise<Job | null>;
  addJob: (data: JobPayload) => Promise<Job | null>;
  editJob: (id: string, data: Partial<JobPayload>) => Promise<Job | null>;
  removeJob: (id: string) => Promise<void>;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobById = async (id: string): Promise<Job | null> => {
    try {
      return await getJobById(id);
    } catch (error) {
      console.error("Failed to fetch job:", error);
      return null;
    }
  };

  const addJob = async (data: JobPayload): Promise<Job | null> => {
    try {
      const newJob = await createJob(data);
      setJobs((prev) => [...prev, newJob]);
      return newJob;
    } catch (error) {
      console.error("Failed to create job:", error);
      return null;
    }
  };

  const editJob = async (id: string, data: Partial<JobPayload>): Promise<Job | null> => {
    try {
      const updatedJob = await updateJob(id, data);
      setJobs((prev) => prev.map((job) => (job.id === id ? updatedJob : job)));
      return updatedJob;
    } catch (error) {
      console.error("Failed to update job:", error);
      return null;
    }
  };

  const removeJob = async (id: string) => {
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };

  // auto-fetch on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <JobContext.Provider
      value={{ jobs, loading, fetchJobs, fetchJobById, addJob, editJob, removeJob }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJobContext must be used within a JobProvider");
  }
  return context;
};
