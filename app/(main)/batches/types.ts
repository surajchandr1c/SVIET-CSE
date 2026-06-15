export type BatchProject = {
  title: string;
  description?: string;
  link?: string;
};

export type BatchCertificate = {
  title: string;
  date?: string;
  previewImage?: string;
  link?: string;
};

export type BatchAchievement = {
  title: string;
  description?: string;
  previewImage?: string;
  link?: string;
  date?: string;
};

export type BatchSkillGroup = {
  title: string;
  items: string[];
};

export type BatchProfile = {
  _id: string;
  name: string;
  position: string;
  image: string;
  admissionNo: string;
  batch: string;
  course?: string;
  about: string;
  keywords?: string;
  skills?: Array<string | BatchSkillGroup>;
  projects?: Array<string | BatchProject>;
  certificates?: Array<string | BatchCertificate>;
  achievements?: Array<string | BatchAchievement>;
  isDisabled?: boolean;
  instagram?: string;
  email?: string;
  linkedin?: string;
  github?: string;
};
