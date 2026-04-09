export type ApplicationStatus =
  | "Applied"
  | "Interviewing"
  | "Offer"
  | "Rejected";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  company_name: string;
  role_title: string;
  status: ApplicationStatus;
  salary_range: string | null;
  location: string | null;
  job_url: string | null;
  applied_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      applications: {
        Row: Application;
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          role_title: string;
          status?: ApplicationStatus;
          salary_range?: string | null;
          location?: string | null;
          job_url?: string | null;
          applied_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string;
          role_title?: string;
          status?: ApplicationStatus;
          salary_range?: string | null;
          location?: string | null;
          job_url?: string | null;
          applied_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "applications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      application_status: ApplicationStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
