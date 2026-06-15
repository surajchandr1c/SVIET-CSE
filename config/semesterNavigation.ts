import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CalendarClock,
  ClipboardList,
  FileText,
  NotebookPen,
  Presentation,
} from "lucide-react";

import type { SemesterKey } from "@/config/semesters";

export type SemesterNavItem = {
  name: string;
  link: string;
  description: string;
  Icon: LucideIcon;
};

const semesterItems: Record<SemesterKey, SemesterNavItem[]> = {
  "4th": [
    {
      name: "Time Table",
      link: "/semester/4thSem/timetable",
      description: "University-style timetable (SEC - D).",
      Icon: CalendarClock,
    },
    {
      name: "Syllabus",
      link: "/semester/4thSem/syllabus",
      description: "Subjects and course structure.",
      Icon: BookOpen,
    },
    {
      name: "Previous 5-Year Question Papers",
      link: "/semester/4thSem/Previous",
      description: "Prepare with past papers.",
      Icon: FileText,
    },
    {
      name: "Assignment",
      link: "/semester/4thSem/assignment",
      description: "Assignments and uploads.",
      Icon: ClipboardList,
    },
    {
      name: "Notes",
      link: "/semester/4thSem/notes",
      description: "Topic-wise notes.",
      Icon: NotebookPen,
    },
    {
      name: "PPT",
      link: "/semester/4thSem/ppt",
      description: "Presentations & slides.",
      Icon: Presentation,
    },
  ],
  "6th": [
    {
      name: "Time Table",
      link: "/semester/6thSem/timetable",
      description: "Schedule and lectures.",
      Icon: CalendarClock,
    },
    {
      name: "Syllabus",
      link: "/semester/6thSem/syllabus",
      description: "Subjects and course structure.",
      Icon: BookOpen,
    },
    {
      name: "Previous 5-Year Question Papers",
      link: "/semester/6thSem/Previous",
      description: "Prepare with past papers.",
      Icon: FileText,
    },
    {
      name: "Assignment",
      link: "/semester/6thSem/assignment",
      description: "Assignments and uploads.",
      Icon: ClipboardList,
    },
    {
      name: "Notes",
      link: "/semester/6thSem/notes",
      description: "Topic-wise notes.",
      Icon: NotebookPen,
    },
    {
      name: "PPT",
      link: "/semester/6thSem/ppt",
      description: "Presentations & slides.",
      Icon: Presentation,
    },
  ],
};

export const getSemesterNavigationItems = (semester: SemesterKey) =>
  semesterItems[semester];
