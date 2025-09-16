"use client";

import React, { useEffect, useState } from "react";
import { useJobContext } from "@/contexts/JobContext";
import { useParams, useRouter } from "next/navigation";
import { MapPin, DollarSign, Users, Calendar, User, ClipboardList, ArrowLeft } from "lucide-react";

type Job = {
  job_id: string;
  job_title: string;
  job_type: string;
  work_mode: string;
  department: string;
  location: string;
  experience_level: string;
  no_of_openings: number;
  no_of_technical_rounds: number;
  preferred_skills: string[];
  required_skills: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
    type: string;
  };
  status: string;
  created_at: string;
  application_deadline?: string | null;
  job_description: string;
  interview_process: string;
  hiring_manager: {
    id: string;
    name: string;
    email: string;
  };
  custom_form: {
    id: string;
    name: string;
    organization_id: string;
    created_by_id: string;
    created_at: string;
  };
  analytics: {
    total_views: number;
    total_applications: number;
    applications_this_week: number;
  };
  published_at?: string | null;
};

const JobPage: React.FC = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { fetchJobById, loading } = useJobContext();
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const result:any = await fetchJobById(id);
        setJob(result?.data);
      } catch (err) {
        console.error("Error fetching job:", err);
      }
    };
    fetchData();
  }, [id, fetchJobById]);

  if (loading) return <div>Loading...</div>;
  if (!job) return <div>No job found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 text-sm text-gray-700 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-3xl font-bold mb-4">{job?.job_title}</h1>
      <p className="text-gray-600 mb-2">{job?.department}</p>

      <div className="flex flex-wrap gap-4 mb-4">
        <span className="px-2 py-1 rounded-full bg-[#efe8ff] text-[#5937B7] border text-sm">{job?.job_type}</span>
        <span className="px-2 py-1 rounded-full bg-[#eef6ff] text-[#1e40af] border text-sm">{job?.work_mode}</span>
        <span className="px-2 py-1 rounded-full bg-[#f0fdf4] text-[#166534] border text-sm">{job?.experience_level}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-gray-700">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" /> {job?.location}
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> {job?.salary.currency} {job.salary.min} - {job.salary.currency} {job.salary.max} {job.salary.type === "monthly" ? "/mo" : "/yr"}
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" /> {job?.no_of_openings} openings
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" /> Hiring Manager: {job?.hiring_manager.name} ({job?.hiring_manager.email})
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Created At: {new Date(job?.created_at).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4" /> Technical Rounds: {job?.no_of_technical_rounds}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Job Description</h2>
        <p>{job?.job_description}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Interview Process</h2>
        <p>{job?.interview_process}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Skills</h2>
        <p>Preferred Skills: {job?.preferred_skills.join(", ") || "N/A"}</p>
        <p>Required Skills: {job?.required_skills.join(", ") || "N/A"}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Analytics</h2>
        <p>Total Views: {job?.analytics.total_views}</p>
        <p>Total Applications: {job?.analytics.total_applications}</p>
        <p>Applications This Week: {job?.analytics.applications_this_week}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Custom Form</h2>
        <p>{job?.custom_form.name}</p>
      </div>

      <div className="mb-4">
        <p>Status: <strong>{job?.status}</strong></p>
        <p>Application Deadline: {job?.application_deadline || "N/A"}</p>
        <p>Published At: {job?.published_at || "N/A"}</p>
      </div>
    </div>
  );
};

export default JobPage;
