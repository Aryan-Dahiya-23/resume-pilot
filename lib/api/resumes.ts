import axios from "axios";

export type UploadResumeResponse = {
  resume: {
    id: string;
    fileName: string;
    roleTarget: string | null;
    targetLevel: string | null;
    status: string;
    size: number;
    mimeType: string;
    storageKey: string;
    bucket: string;
    createdAt: string;
  };
  processingQueued: boolean;
};

type UploadResumePayload = {
  file: File;
  roleTarget: string;
  targetLevel?: string;
  onProgress?: (progress: number) => void;
};

export async function uploadResume(payload: UploadResumePayload) {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("roleTarget", payload.roleTarget);
  if (payload.targetLevel) {
    formData.append("targetLevel", payload.targetLevel);
  }

  const response = await axios.post<UploadResumeResponse>("/api/resumes/upload", formData, {
    withCredentials: true,
    onUploadProgress: (progressEvent) => {
      const total = progressEvent.total ?? payload.file.size;
      if (!total) return;
      const progress = Math.round((progressEvent.loaded / total) * 100);
      payload.onProgress?.(progress);
    },
  });

  return response.data;
}

export type ResumeListItem = {
  id: string;
  fileName: string;
  roleTarget: string | null;
  targetLevel: string | null;
  status: "UPLOADED" | "PARSING" | "REVIEWING" | "READY" | "FAILED";
  createdAt: string;
  score: number | null;
};

type ListResumesResponse = {
  resumes: ResumeListItem[];
};

export async function listResumes() {
  const response = await axios.get<ListResumesResponse>("/api/resumes", {
    withCredentials: true,
  });
  return response.data.resumes;
}

export type ResumeDetails = {
  id: string;
  fileName: string;
  roleTarget: string | null;
  targetLevel: string | null;
  status: "UPLOADED" | "PARSING" | "REVIEWING" | "READY" | "FAILED";
  createdAt: string;
  updatedAt: string;
  mimeType: string;
  size: number;
  storageKey: string;
  parse: {
    parserVersion: string;
    rawText: string;
    structuredJson: unknown;
  } | null;
  feedback: ResumeReviewFeedback | null;
  reviewHistory: ResumeReviewVersion[];
};

export type ResumeReviewFeedback = {
  score: number;
  strengths: string[];
  weaknesses: string[];
  nextActions: string[];
  missingKeywords: string[];
  atsChecks: Array<{
    label: string;
    ok: boolean;
  }>;
  rewriteSuggestions: Array<{
    before: string;
    after: string;
    why: string;
  }>;
};

export type ResumeReviewVersion = ResumeReviewFeedback & {
  id: string;
  model: string;
  createdAt: string;
};

type GetResumeDetailsResponse = {
  resume: ResumeDetails;
};

export async function getResumeDetails(resumeId: string) {
  const response = await axios.get<GetResumeDetailsResponse>(`/api/resumes/${resumeId}`, {
    withCredentials: true,
  });
  return response.data.resume;
}
