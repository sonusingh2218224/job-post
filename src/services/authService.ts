// src/services/authService.ts
import api from "@/lib/api";

export interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  gender: string;
  job_title: string;
  company: string;
  company_website: string;
  hiring_description: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterPayload) => {
  const res = await api.post("/auth/register/", data);
  return res.data;
};

export const loginUser = async (data: LoginPayload) => {
  const res = await api.post("/auth/login/", data);
  return res.data;
};
