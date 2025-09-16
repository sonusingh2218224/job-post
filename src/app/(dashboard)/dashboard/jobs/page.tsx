"use client";

import React, { useEffect, useState } from "react";
import { MapPin, DollarSign, Users, Calendar, Loader2, Trash } from "lucide-react";
import { useJobContext } from "@/contexts/JobContext";
import Link from "next/link";
import { toast } from "react-toastify";

type Job = {
    job_id: string;
    job_title: string;
    job_type: string;
    work_mode: string;
    department: string;
    location: string;
    salary: {
        min: number;
        max: number;
        currency: string;
        type: string;
    };
    no_of_openings: number;
    status: string;
    created_at: string;
    application_count: number;
};

function Page() {
    const { fetchJobs, loading, jobs, pagination, removeJob }: any = useJobContext();
    const [currentPage, setCurrentPage] = useState(1);

    const [deleting, setDeleting] = useState(false);

    const DeleteJob = async (job_id: string | undefined) => {
        if (!job_id) return;
        setDeleting(true);
        try {
            await removeJob(job_id);
            fetchJobs()
            toast.success('Job deleted successfully');

        } catch (err) {
            console.error("Error deleting job:", err);
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        fetchJobs(currentPage);
    }, []);

    // Load more handler
    const loadMore = async () => {
        const nextPage = currentPage + 1;
        if (pagination && nextPage <= pagination.total_pages) {
            await fetchJobs(nextPage, 10, true);
            setCurrentPage(nextPage);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto p-6">
  <h2 className="text-2xl font-semibold mb-4">Open Positions</h2>

  {loading ? (
    <Loader2 color="#5937B7" className="mx-auto my-8 h-10 w-10 animate-spin" />
  ) : jobs.length > 0 ? (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job: Job) => (
        <article
          key={job.job_id}
          className="rounded-2xl shadow-md p-5 bg-white border border-gray-100 flex flex-col"
        >
          {/* Job Header */}
          <header className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{job.job_title}</h3>
              <p className="text-sm text-gray-500 mt-1">{job.department}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-[#5937B7] bg-[#efe8ff] border border-[#e6dfff]">
                {job.job_type.replace("_", " ")}
              </span>
            </div>
          </header>

          {/* Job Info */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>
                {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.currency}{" "}
                {job.salary.max.toLocaleString()} {job.salary.type === "monthly" ? "/mo" : "/yr"}
              </span>
            </div>
          </div>

          {/* Job Footer */}
          <div className="flex items-center justify-end gap-2 pt-4 mt-auto">
            <Link
              href={`/dashboard/jobs/${job.job_id}`}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-[#5937B7] text-white bg-[#5937B7] hover:opacity-95"
            >
              Details
            </Link>

            <button
              onClick={() => DeleteJob(job.job_id)}
              disabled={deleting}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border border-red-500 text-red-500 flex items-center gap-2 ${
                deleting ? "opacity-70 cursor-not-allowed" : "hover:opacity-95"
              }`}
            >
              {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
              <Trash className="w-4 h-4" color="red" />
            </button>
          </div>
        </article>
      ))}
    </div>
  ) : (
    // No Jobs Found Centered
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <img
        src="/assets/job.jpg" // replace with your image path
        alt="No Jobs Found"
        className="w-64 h-64 mb-6 object-contain"
      />
      <h2 className="text-2xl font-semibold mb-2 text-gray-700">No Jobs Found</h2>
      <p className="text-gray-500 mb-4">
        You currently have no jobs listed. Start by creating a new job!
      </p>
      <Link
        href="/dashboard/create-job"
        className="px-4 py-2 rounded-md bg-[#5937B7] text-white font-medium hover:bg-[#4b2fa0] transition-colors"
      >
        Create a New Job
      </Link>
    </div>
  )}
</div>

        </div>
    );
}

export default Page;
