export type Podcast = {
  id: number; // primary key
  category: string;
  episode_number: number;
  title: string;
  description: string;
  run_time: number; // in seconds
  upload_date: Date;
  link: string;
};