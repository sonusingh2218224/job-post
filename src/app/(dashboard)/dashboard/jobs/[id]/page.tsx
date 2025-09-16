"use client";

import React, { useEffect, useState } from "react";
import { useJobContext, Job } from "@/contexts/JobContext";
import { useParams, useRouter } from "next/navigation";
import { MapPin, DollarSign, Users, Calendar, User, ClipboardList, ArrowLeft } from "lucide-react";

const JobPage: React.FC = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { fetchJobById, loading } = useJobContext();
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const result = await fetchJobById(id);
        setJob(result);
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

      <h1 className="text-3xl font-bold mb-4">{job.job_title}</h1>
      <p className="text-gray-600 mb-2">{job.department}</p>

      <div className="flex flex-wrap gap-4 mb-4">
        <span className="px-2 py-1 rounded-full bg-[#efe8ff] text-[#5937B7] border text-sm">{job.job_type}</span>
        <span className="px-2 py-1 rounded-full bg-[#eef6ff] text-[#1e40af] border text-sm">{job.work_mode}</span>
        <span className="px-2 py-1 rounded-full bg-[#f0fdf4] text-[#166534] border text-sm">{job.experience_level}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-gray-700">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" /> {job.location}
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> {job.salary_currency} {job.salary_min?.toLocaleString()} - {job.salary_currency} {job.salary_max?.toLocaleString()} {job.salary_type === "monthly" ? "/mo" : "/yr"}
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" /> {job.no_of_openings} openings
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" /> Hiring Manager ID: {job.hiring_manager_id}
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Created At: {job.created_at ? new Date(job.created_at).toLocaleDateString() : "N/A"}
        </div>
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4" /> Technical Rounds: {job.no_of_technical_rounds}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Job Description</h2>
        <p>{job.job_description}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Interview Process</h2>
        <p>{job.interview_process}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Skills</h2>
        <p>Preferred Skills: {job.preferred_skills.join(", ") || "N/A"}</p>
        <p>Required Skills: {job.required_skills.join(", ") || "N/A"}</p>
      </div>

      <div className="mb-4">
        <p>Application Deadline: {job.application_deadline || "N/A"}</p>
        {job.stipend_amount && (
          <p>Stipend Amount: {job.stipend_amount}</p>
        )}
      </div>
    </div>
  );
};

export default JobPage;
