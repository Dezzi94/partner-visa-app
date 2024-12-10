export interface User {
  id: string;
  email: string;
  name: string | null;
  profile_picture: string | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  document_name: string;
  document_url: string;
  status: string;
  created_at: string;
}

export type DocumentUpload = Omit<Document, 'id' | 'created_at'>; 