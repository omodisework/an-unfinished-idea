
import React, { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import Input from './Input';
import TextArea from './TextArea';
import Button from './Button';
import { generateProjectDescription } from '../services/geminiService';
import { DEFAULT_PROJECT_IMAGE } from '../constants';

interface ProjectFormProps {
  project: Project;
  onUpdate: (project: Project) => void;
  onDelete: (id: string) => void;
  isNew: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onUpdate, onDelete, isNew }) => {
  const [currentProject, setCurrentProject] = useState<Project>(project);
  const [descriptionLoading, setDescriptionLoading] = useState(false);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentProject(project);
  }, [project]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProject(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleGenerateDescription = useCallback(async () => {
    setDescriptionLoading(true);
    setDescriptionError(null);
    try {
      const generatedDescription = await generateProjectDescription({
        projectTitle: currentProject.title,
        technologies: currentProject.technologies,
        initialDescription: currentProject.description,
      });
      setCurrentProject(prev => ({ ...prev, description: generatedDescription }));
    } catch (error) {
      console.error("Failed to generate description:", error);
      setDescriptionError(`Failed to generate description. Please check your API key and try again. ${error instanceof Error ? error.message : String(error)}`);
      // If aistudio is available and the error is due to key, try to prompt user.
      // This is a direct check for the expected environment interaction.
      if ((window as any).aistudio && (error as Error).message.includes("Requested entity was not found.")) {
        await (window as any).aistudio.openSelectKey();
        setDescriptionError("API key might have been reset. Please try generating description again after selecting a key.");
      }
    } finally {
      setDescriptionLoading(false);
    }
  }, [currentProject]);

  // Use useEffect to call onUpdate whenever currentProject changes,
  // but debounce it to avoid excessive re-renders/updates.
  useEffect(() => {
    const handler = setTimeout(() => {
      onUpdate(currentProject);
    }, 300); // Debounce time
    return () => {
      clearTimeout(handler);
    };
  }, [currentProject, onUpdate]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6 relative">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{isNew ? 'New Project' : currentProject.title || 'Untitled Project'}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id={`title-${currentProject.id}`}
          label="Project Title"
          name="title"
          value={currentProject.title}
          onChange={handleChange}
          placeholder="e.g., My Awesome App"
        />
        <Input
          id={`technologies-${currentProject.id}`}
          label="Technologies Used (comma-separated)"
          name="technologies"
          value={currentProject.technologies}
          onChange={handleChange}
          placeholder="e.g., React, Node.js, Tailwind CSS"
        />
      </div>

      <TextArea
        id={`description-${currentProject.id}`}
        label="Project Description"
        name="description"
        value={currentProject.description}
        onChange={handleChange}
        placeholder="A brief description of your project..."
      />
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-4 gap-2 md:gap-4">
        <Button
          onClick={handleGenerateDescription}
          isLoading={descriptionLoading}
          disabled={!currentProject.title || !currentProject.technologies}
          type="button"
          variant="secondary"
          className="w-full md:w-auto flex-shrink-0"
        >
          {descriptionLoading ? 'Generating...' : 'Generate Description with AI'}
        </Button>
        {descriptionError && <p className="text-red-600 text-sm md:ml-4 text-center md:text-left">{descriptionError}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id={`liveLink-${currentProject.id}`}
          label="Live Demo Link"
          name="liveLink"
          value={currentProject.liveLink}
          onChange={handleChange}
          placeholder="https://your-live-demo.com"
          type="url"
        />
        <Input
          id={`githubLink-${currentProject.id}`}
          label="GitHub Repository Link"
          name="githubLink"
          value={currentProject.githubLink}
          onChange={handleChange}
          placeholder="https://github.com/your-username/your-repo"
          type="url"
        />
      </div>
      
      <Input
        id={`imageUrl-${currentProject.id}`}
        label="Project Image URL (e.g., https://picsum.photos/600/400)"
        name="imageUrl"
        value={currentProject.imageUrl}
        onChange={handleChange}
        placeholder={DEFAULT_PROJECT_IMAGE}
        type="url"
      />
      
      <Button
        onClick={() => onDelete(currentProject.id)}
        variant="danger"
        className="mt-4 w-full"
        type="button"
      >
        Delete Project
      </Button>
    </div>
  );
};

export default ProjectForm;
