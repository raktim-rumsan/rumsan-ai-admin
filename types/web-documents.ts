export interface Section {
  id: string;
  title: string;
  content: string;
  isEditing: boolean;
}

export interface CapturedContent {
  id: string;
  url: string;
  title: string;
  date: string;
  sections: Section[];
  enabled: boolean;
  isTraining?: boolean;
  status?: string;
  createdAt?: string;
}

export interface ScrapeWebsiteResponse {
  markdown?: string;
  content?: string;
  data?: {
    markdown?: string;
    content?: string;
  };
}
