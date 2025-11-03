
import React, { useState, useEffect, useCallback } from 'react';
import { PortfolioData, Project } from './types';
import Input from './components/Input';
import TextArea from './components/TextArea';
import Button from './components/Button';
import ProjectForm from './components/ProjectForm';
import PortfolioPreview from './components/PortfolioPreview';
import { DEFAULT_PROJECT_IMAGE } from './constants';

const LOCAL_STORAGE_KEY = 'portfolioGeneratorData';

function App() {
  const [portfolio, setPortfolio] = useState<PortfolioData>(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error("Failed to parse saved portfolio data", e);
        // Fallback to default if parsing fails
      }
    }
    return {
      name: '',
      title: '',
      bio: '',
      email: '',
      githubUrl: '',
      linkedinUrl: '',
      projects: [],
    };
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(portfolio));
  }, [portfolio]);

  const handlePortfolioChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPortfolio(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleAddProject = useCallback(() => {
    const newProject: Project = {
      id: crypto.randomUUID(), // Unique ID for keying
      title: '',
      description: '',
      technologies: '',
      liveLink: '',
      githubLink: '',
      imageUrl: DEFAULT_PROJECT_IMAGE,
    };
    setPortfolio(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  }, []);

  const handleUpdateProject = useCallback((updatedProject: Project) => {
    setPortfolio(prev => ({
      ...prev,
      projects: prev.projects.map(p => (p.id === updatedProject.id ? updatedProject : p)),
    }));
  }, []);

  const handleDeleteProject = useCallback((id: string) => {
    setPortfolio(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
    }));
  }, []);

  const handleDownloadJson = useCallback(() => {
    const jsonString = JSON.stringify(portfolio, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [portfolio]);

  const handleDownloadHtml = useCallback(() => {
    // Generate a simple HTML representation of the portfolio.
    // This uses the PortfolioPreview component's structure as a template
    // and injects the current portfolio data.
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolio.name || 'Personal Portfolio'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      /* Add any custom styles here if needed */
      .animate-fade-in-up {
        animation: fadeInUp 0.5s ease-out;
      }
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>
</head>
<body class="bg-gray-50 antialiased">
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <header class="text-center py-12 bg-white shadow-lg rounded-xl mb-12">
        <h1 class="text-5xl font-extrabold text-gray-900 leading-tight mb-3">
          ${portfolio.name || 'Your Name'}
        </h1>
        <p class="text-2xl font-light text-blue-600 mb-6">
          ${portfolio.title || 'Your Professional Title'}
        </p>
        <div class="flex justify-center space-x-6 text-gray-600 text-lg">
          ${portfolio.email ? `<a href="mailto:${portfolio.email}" class="hover:text-blue-700 transition-colors duration-200">Email</a>` : ''}
          ${portfolio.githubUrl ? `<a href="${portfolio.githubUrl}" target="_blank" rel="noopener noreferrer" class="hover:text-blue-700 transition-colors duration-200">GitHub</a>` : ''}
          ${portfolio.linkedinUrl ? `<a href="${portfolio.linkedinUrl}" target="_blank" rel="noopener noreferrer" class="hover:text-blue-700 transition-colors duration-200">LinkedIn</a>` : ''}
        </div>
      </header>

      ${(portfolio.bio || portfolio.email || portfolio.githubUrl || portfolio.linkedinUrl) ? `
        <section class="bg-white p-8 rounded-xl shadow-lg mb-12 animate-fade-in-up">
          <h2 class="text-4xl font-bold text-gray-800 mb-6 text-center">About Me</h2>
          <p class="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto text-center">
            ${portfolio.bio || 'Write a compelling biography about yourself, your skills, and what drives you.'}
          </p>
        </section>
      ` : ''}

      ${portfolio.projects.length > 0 ? `
        <section class="bg-white p-8 rounded-xl shadow-lg animate-fade-in-up">
          <h2 class="text-4xl font-bold text-gray-800 mb-8 text-center">My Projects</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${portfolio.projects.map((project: Project) => `
              <div class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img
                  src="${project.imageUrl || DEFAULT_PROJECT_IMAGE}"
                  alt="${project.title || 'Project image'}"
                  class="w-full h-48 object-cover object-center"
                />
                <div class="p-6">
                  <h3 class="text-2xl font-bold text-gray-800 mb-2">
                    ${project.title || 'Untitled Project'}
                  </h3>
                  <p class="text-gray-600 text-sm mb-4">
                    ${project.technologies ? `<span class="font-medium text-blue-600">Tech: </span>` : ''}
                    ${project.technologies || 'No technologies listed'}
                  </p>
                  <p class="text-gray-700 leading-relaxed mb-4">
                    ${project.description || 'A concise description of the project, its goals, and key features.'}
                  </p>
                  <div class="flex flex-wrap gap-3 mt-auto">
                    ${project.liveLink ? `
                      <a
                        href="${project.liveLink}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm transition-colors duration-200"
                      >
                        Live Demo
                      </a>
                    ` : ''}
                    ${project.githubLink ? `
                      <a
                        href="${project.githubLink}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm transition-colors duration-200"
                      >
                        GitHub Repo
                      </a>
                    ` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <footer class="text-center py-8 text-gray-600 mt-12">
        <p>&copy; ${new Date().getFullYear()} ${portfolio.name || 'Your Name'}. All rights reserved.</p>
      </footer>
    </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [portfolio]);


  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Editor Section */}
      <div className="w-full lg:w-1/2 p-6 md:p-8 border-b lg:border-r border-gray-200 bg-white shadow-lg overflow-y-auto max-h-screen">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Portfolio Generator</h1>

        {/* About Me Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Me</h2>
          <Input
            id="name"
            label="Your Name"
            name="name"
            value={portfolio.name}
            onChange={handlePortfolioChange}
            placeholder="e.g., Jane Doe"
          />
          <Input
            id="title"
            label="Professional Title"
            name="title"
            value={portfolio.title}
            onChange={handlePortfolioChange}
            placeholder="e.g., Senior Frontend Developer"
          />
          <TextArea
            id="bio"
            label="Short Bio"
            name="bio"
            value={portfolio.bio}
            onChange={handlePortfolioChange}
            placeholder="A passionate developer with expertise in..."
          />
          <Input
            id="email"
            label="Email"
            name="email"
            value={portfolio.email}
            onChange={handlePortfolioChange}
            placeholder="your.email@example.com"
            type="email"
          />
          <Input
            id="githubUrl"
            label="GitHub Profile URL"
            name="githubUrl"
            value={portfolio.githubUrl}
            onChange={handlePortfolioChange}
            placeholder="https://github.com/your-username"
            type="url"
          />
          <Input
            id="linkedinUrl"
            label="LinkedIn Profile URL"
            name="linkedinUrl"
            value={portfolio.linkedinUrl}
            onChange={handlePortfolioChange}
            placeholder="https://linkedin.com/in/your-profile"
            type="url"
          />
        </div>

        {/* Projects Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Projects</h2>
          <div className="space-y-6">
            {portfolio.projects.map((project: Project) => (
              <ProjectForm
                key={project.id}
                project={project}
                onUpdate={handleUpdateProject}
                onDelete={handleDeleteProject}
                isNew={!project.title}
              />
            ))}
          </div>
          <Button onClick={handleAddProject} className="mt-6 w-full" type="button">
            Add New Project
          </Button>
        </div>

        {/* Fixed CTA for download */}
        <div className="sticky bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 shadow-xl flex justify-around gap-4 z-10 lg:static lg:p-0 lg:border-none lg:shadow-none lg:mt-8">
          <Button onClick={handleDownloadJson} variant="secondary" className="w-1/2" type="button">
            Download JSON
          </Button>
          <Button onClick={handleDownloadHtml} variant="primary" className="w-1/2" type="button">
            Download HTML
          </Button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="w-full lg:w-1/2 lg:flex-shrink-0 bg-gray-100 overflow-y-auto max-h-screen">
        <PortfolioPreview portfolio={portfolio} />
      </div>
    </div>
  );
}

export default App;
