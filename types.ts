
export interface Project {
  id: string;
  title: string;
description: string;
  technologies: string;
  liveLink: string;
  githubLink: string;
  imageUrl: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  projects: Project[];
}
