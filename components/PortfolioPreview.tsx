
import React from 'react';
import { PortfolioData, Project } from '../types';
import { DEFAULT_PROJECT_IMAGE } from '../constants';

interface PortfolioPreviewProps {
  portfolio: PortfolioData;
}

const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({ portfolio }) => {
  const { name, title, bio, email, githubUrl, linkedinUrl, projects } = portfolio;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      {/* Header Section */}
      <header className="text-center py-12 bg-white shadow-lg rounded-xl mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-3">
          {name || 'Your Name'}
        </h1>
        <p className="text-2xl font-light text-blue-600 mb-6">
          {title || 'Your Professional Title'}
        </p>
        <div className="flex justify-center space-x-6 text-gray-600 text-lg">
          {email && (
            <a href={`mailto:${email}`} className="hover:text-blue-700 transition-colors duration-200">
              Email
            </a>
          )}
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 transition-colors duration-200">
              GitHub
            </a>
          )}
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 transition-colors duration-200">
              LinkedIn
            </a>
          )}
        </div>
      </header>

      {/* About Section */}
      {(bio || email || githubUrl || linkedinUrl) && (
        <section className="bg-white p-8 rounded-xl shadow-lg mb-12 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">About Me</h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto text-center">
            {bio || 'Write a compelling biography about yourself, your skills, and what drives you.'}
          </p>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="bg-white p-8 rounded-xl shadow-lg animate-fade-in-up">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">My Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: Project) => (
              <div key={project.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img
                  src={project.imageUrl || DEFAULT_PROJECT_IMAGE}
                  alt={project.title || 'Project image'}
                  className="w-full h-48 object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {project.title || 'Untitled Project'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {project.technologies && (
                      <span className="font-medium text-blue-600">Tech: </span>
                    )}
                    {project.technologies || 'No technologies listed'}
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {project.description || 'A concise description of the project, its goals, and key features.'}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-auto">
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm transition-colors duration-200"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm transition-colors duration-200"
                      >
                        GitHub Repo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer Section */}
      <footer className="text-center py-8 text-gray-600 mt-12">
        <p>&copy; {new Date().getFullYear()} {name || 'Your Name'}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PortfolioPreview;
