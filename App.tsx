import React, { useState, useMemo } from 'react';
import { Menu, Trash2, Wand2, Plus, Image as ImageIcon, Pencil } from 'lucide-react';
import { Category, Project } from './types';
import { INITIAL_PROJECTS, CATEGORIES } from './constants';
import { Sidebar } from './components/Sidebar';
import { Modal } from './components/Modal';
import { generateProjectDescription } from './services/geminiService';

export default function App() {
  // State
  const [activeTab, setActiveTab] = useState<Category>("ALL");
  const [isUserMode, setIsUserMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  
  // Modal States
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [generatingId, setGeneratingId] = useState<number | null>(null);

  // Add Project State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectCategory, setNewProjectCategory] = useState<Category>("Interior");
  const [newProjectImage, setNewProjectImage] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  // Edit Project State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState<Category>("Interior");
  const [editImage, setEditImage] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Derived State
  const filteredProjects = useMemo(() => {
    return activeTab === "ALL"
      ? projects
      : projects.filter((p) => p.category === activeTab);
  }, [projects, activeTab]);

  // Handlers
  const handleAdminClick = () => {
    if (isUserMode) {
      setIsUserMode(false);
    } else {
      setShowPasswordPrompt(true);
      setPasswordInput("");
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === "1234") {
      setIsUserMode(true);
      setShowPasswordPrompt(false);
    } else {
      alert("Incorrect password");
    }
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      setProjects(prev => prev.filter((p) => p.id !== projectToDelete.id));
    }
    setShowDeleteConfirm(false);
    setProjectToDelete(null);
  };

  const handleAiEnhance = async (project: Project) => {
    setGeneratingId(project.id);
    const newDescription = await generateProjectDescription(project.title, project.category);
    
    setProjects(prev => prev.map(p => 
      p.id === project.id ? { ...p, description: newDescription } : p
    ));
    setGeneratingId(null);
  };

  const openAddModal = () => {
    setNewProjectTitle("");
    setNewProjectCategory("Interior");
    setNewProjectImage("");
    setNewProjectDescription("");
    setShowAddModal(true);
  };

  const handleAddSubmit = () => {
    if (!newProjectTitle || !newProjectImage) {
      alert("Please fill in all fields");
      return;
    }

    const newId = Math.max(...projects.map(p => p.id), 0) + 1;
    const newProject: Project = {
      id: newId,
      title: newProjectTitle,
      category: newProjectCategory,
      image: newProjectImage,
      description: newProjectDescription || "New project added. Click 'AI Enhance' to generate a description."
    };

    setProjects([...projects, newProject]);
    setShowAddModal(false);
  };

  const generateRandomImage = () => {
    const randomId = Math.floor(Math.random() * 1000);
    setNewProjectImage(`https://picsum.photos/800/600?random=${randomId}`);
  };

  // Edit Handlers
  const handleEditClick = (project: Project) => {
    setEditingId(project.id);
    setEditTitle(project.title);
    setEditCategory(project.category);
    setEditImage(project.image);
    setEditDescription(project.description || "");
    setShowEditModal(true);
  };

  const handleEditSubmit = () => {
    if (!editTitle || !editImage) {
      alert("Please fill in all fields");
      return;
    }

    setProjects(prev => prev.map(p => 
      p.id === editingId 
        ? { 
            ...p, 
            title: editTitle, 
            category: editCategory, 
            image: editImage,
            description: editDescription
          } 
        : p
    ));
    setShowEditModal(false);
    setEditingId(null);
  };

  return (
    <div className="flex h-screen bg-[#F0FDFA] overflow-hidden text-slate-800 font-sans">
      
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isUserMode={isUserMode}
        onAdminClick={handleAdminClick}
        isMobileOpen={isMobileMenuOpen}
        closeMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white/80 backdrop-blur-sm border-b border-teal-100 p-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg font-bold text-teal-900">{activeTab}</h2>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-teal-800 hover:bg-teal-50 rounded-full"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <header className="hidden md:flex items-baseline justify-between mb-10">
              <h2 className="text-3xl font-light text-slate-800 tracking-tight">
                {activeTab === "ALL" ? "All Projects" : activeTab}
              </h2>
              <span className="text-sm text-slate-400 font-medium">
                {filteredProjects.length} Projects
              </span>
            </header>

            {/* Empty State */}
            {filteredProjects.length === 0 && !isUserMode && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Menu size={32} className="opacity-20" />
                </div>
                <p>No projects found in this category.</p>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-4 bg-slate-100">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-2 py-1 rounded-md">
                        {project.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-teal-700 transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4">
                      {project.description || "No description available."}
                    </p>
                  </div>

                  {/* Admin Actions */}
                  {isUserMode && (
                    <div className="pt-4 border-t border-slate-100 flex gap-2 mt-auto">
                      <button
                        onClick={() => handleAiEnhance(project)}
                        disabled={generatingId === project.id}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50"
                      >
                         {generatingId === project.id ? (
                           <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                         ) : (
                           <Wand2 size={16} />
                         )}
                         AI Enhance
                      </button>
                      <button
                        onClick={() => handleEditClick(project)}
                        className="flex items-center justify-center px-3 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
                        title="Edit Project"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(project)}
                        className="flex items-center justify-center px-3 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Add New Placeholder (Visual only for Admin) */}
              {isUserMode && (
                <button 
                  onClick={openAddModal}
                  className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50/50 transition-all min-h-[300px]"
                >
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <Plus size={24} />
                  </div>
                  <span className="font-medium">Add New Project</span>
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Admin Login Modal */}
      <Modal
        isOpen={showPasswordPrompt}
        onClose={() => setShowPasswordPrompt(false)}
        title="Admin Access"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-500">Enter password to enable editing features.</p>
          <input
            type="password"
            placeholder="Enter Password"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            autoFocus
          />
          <button
            onClick={handlePasswordSubmit}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg transition-all active:scale-[0.98]"
          >
            Unlock Mode
          </button>
        </div>
      </Modal>

      {/* Add Project Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Project"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
            <input
              type="text"
              placeholder="e.g. Modern Villa"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all bg-white"
              value={newProjectCategory}
              onChange={(e) => setNewProjectCategory(e.target.value as Category)}
            >
              {CATEGORIES.filter(c => c !== 'ALL').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://..."
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                value={newProjectImage}
                onChange={(e) => setNewProjectImage(e.target.value)}
              />
              <button 
                onClick={generateRandomImage}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                title="Generate Random Image"
              >
                <ImageIcon size={20} />
              </button>
            </div>
            {newProjectImage && (
              <div className="mt-2 relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                <img src={newProjectImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              placeholder="Project description..."
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all min-h-[100px]"
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
            />
          </div>

          <button
            onClick={handleAddSubmit}
            className="w-full mt-2 bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg transition-all active:scale-[0.98]"
          >
            Create Project
          </button>
        </div>
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Project"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
            <input
              type="text"
              placeholder="e.g. Modern Villa"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all bg-white"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value as Category)}
            >
              {CATEGORIES.filter(c => c !== 'ALL').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://..."
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                value={editImage}
                onChange={(e) => setEditImage(e.target.value)}
              />
            </div>
            {editImage && (
              <div className="mt-2 relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                <img src={editImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              placeholder="Project description..."
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all min-h-[100px]"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>

          <button
            onClick={handleEditSubmit}
            className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-lg transition-all active:scale-[0.98]"
          >
            Save Changes
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Project?"
      >
        <div className="flex flex-col gap-4">
          <p className="text-slate-600">
            Are you sure you want to delete <span className="font-semibold text-slate-900">"{projectToDelete?.title}"</span>? This action cannot be undone.
          </p>
          
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 px-4 py-3 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 px-4 py-3 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700 shadow-md shadow-rose-200 transition-all active:scale-[0.98]"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}