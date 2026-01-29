export interface Question {
  id: number;
  title: string;
  description: string;
  type: string;
  createdAt: string;
  user: {
    id: number;
    displayName: string;
  };
}
