export interface AppItem {
  id: string;
  name: string;
  title: string;
  description: string;
  thumbnail: string | null;
  htmlContent: string;
  createdAt: number;
  updatedAt: number;
  shareCount: number;
  isPublic: boolean;
}

export interface ShareConfig {
  title: string;
  description: string;
  thumbnail: string | null;
}
