// components/dashboard/PortfolioManager.tsx
"use client";

import { useState } from "react";
import { User, PortfolioProject } from "@prisma/client";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

interface PortfolioManagerProps {
  user: User;
  portfolioProjects: PortfolioProject[];
}

export default function PortfolioManager({ user, portfolioProjects }: PortfolioManagerProps) {
  const router = useRouter();
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const addPortfolioProject = api.portfolio.createProject.useMutation({
    onSuccess: () => {
      resetForm();
      setIsAddingProject(false);
      router.refresh();
    },
  });
  
  const updatePortfolioProject = api.portfolio.updateProject.useMutation({
    onSuccess: () => {
      resetForm();
      setEditingProjectId(null);
      router.refresh();
    },
  });
  
  const deletePortfolioProject = api.portfolio.deleteProject.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLink("");
    setImageUrl("");
    setImageUrls([]);
  };
  
  const handleAddImage = () => {
    if (imageUrl.trim() && !imageUrls.includes(imageUrl.trim())) {
      setImageUrls([...imageUrls, imageUrl.trim()]);
      setImageUrl("");
    }
  };
  
  const handleRemoveImage = (urlToRemove: string) => {
    setImageUrls(imageUrls.filter(url => url !== urlToRemove));
  };
  
  const handleEdit = (project: PortfolioProject) => {
    setTitle(project.title);
    setDescription(project.description);
    setLink(project.link || "");
    setImageUrls(project.images);
    setEditingProjectId(project.id);
  };
  
  const handleDelete = async (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deletePortfolioProject.mutateAsync({
          projectId,
          userId: user.id,
        });
      } catch (error) {
        console.error("Failed to delete project:", error);
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      alert("Title and description are required");
      return;
    }
    
    try {
      if (editingProjectId) {
        await updatePortfolioProject.mutateAsync({
          projectId: editingProjectId,
          userId: user.id,
          title,
          description,
          link,
          images: imageUrls,
        });
      } else {
        await addPortfolioProject.mutateAsync({
          userId: user.id,
          title,
          description,
          link,
          images: imageUrls,
        });
      }
    } catch (error) {
      console.error("Failed to save project:", error);
    }
  };
  
  return (
    <div>
      {/* Add Project Button */}
      {!isAddingProject && editingProjectId === null && (
        <button
          onClick={() => setIsAddingProject(true)}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add New Project
        </button>
      )}
      
      {/* Project Form */}
      {(isAddingProject || editingProjectId !== null) && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingProjectId ? "Edit Project" : "Add New Project"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Project Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project title"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Project Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your project, your role, technologies used, etc."
                required
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                Project Link
              </label>
              <input
                type="url"
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/your-project"
              />
            </div>
            
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
                Project Images
              </label>
              <div className="flex">
                <input
                  type="url"
                  id="images"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              
              {imageUrls.length > 0 && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Project image ${index + 1}`}
                        className="h-36 w-full object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Invalid+Image";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(url)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsAddingProject(false);
                  setEditingProjectId(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={addPortfolioProject.isLoading || updatePortfolioProject.isLoading}
              >
                {addPortfolioProject.isLoading || updatePortfolioProject.isLoading 
                  ? "Saving..." 
                  : editingProjectId ? "Update Project" : "Add Project"
                }
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Project List */}
      {portfolioProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow overflow-hidden">
              {project.images.length > 0 && (
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x150?text=No+Image";
                  }}
                />
              )}
              
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-block mb-4"
                  >
                    View Project
                  </a>
                )}
                
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-600 hover:text-red-800"
                    disabled={deletePortfolioProject.isLoading}
                  >
                    {deletePortfolioProject.isLoading && deletePortfolioProject.variables?.projectId === project.id
                      ? "Deleting..."
                      : "Delete"
                    }
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No portfolio projects yet</h3>
          <p className="text-gray-500 mb-4">
            Add your past work to showcase your skills and experience to potential clients.
          </p>
          {!isAddingProject && (
            <button
              onClick={() => setIsAddingProject(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Your First Project
            </button>
          )}
        </div>
      )}
    </div>
  );
}