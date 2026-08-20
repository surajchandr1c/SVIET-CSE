export type BatchConfig = {
  year: string;
  label: string;
  semester: number;
  courseSplit: boolean;
};

export const DEFAULT_BATCH_CONFIGS: BatchConfig[] = [
  { year: "2024", label: "2024 Batch", semester: 4, courseSplit: false },
  { year: "2025", label: "2025 Batch", semester: 2, courseSplit: true },
];
