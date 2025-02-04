"use client";

import React, { useState, useTransition } from "react";
import { createTask } from "@/lib/task";
import Modal from "@/components/Modal";
import { toast } from "react-hot-toast";
import { formatISO } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null; // Optional project ID
};

const ModalNewTask = ({ isOpen, onClose, id = null }: Props) => {
  // Status and Priority Enums
  const StatusOptions = ["To Do", "Working Progress", "Under Review", "Completed"] as const;
  const PriorityOptions = ["High", "Medium", "Low"] as const;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: StatusOptions[0], // Default: "To Do"
    priority: PriorityOptions[1], // Default: "Medium"
    tags: "",
    startDate: "",
    dueDate: "",
    projectId: "",
    assignedUserId: "", // Optional assigned user
  });

  const [isPending, startTransition] = useTransition();

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: StatusOptions[0],
      priority: PriorityOptions[1],
      tags: "",
      startDate: "",
      dueDate: "",
      projectId: "",
      assignedUserId: "",
    });
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started"); // Check if this runs
  
    const projectIdToUse = id !== null ? id : formData.projectId;
    if (!formData.title || !projectIdToUse) {
      toast.error("Please fill in all required fields.");
      console.log("Validation failed"); // Check validation
      return;
    }
  
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      priority: formData.priority,
      tags: formData.tags ??undefined,
      startDate: formData.startDate ? formatISO(new Date(formData.startDate)) : undefined,
      dueDate: formData.dueDate ? formatISO(new Date(formData.dueDate)) : undefined,
      projectId: parseInt(projectIdToUse, 10),
      authorUserId: 1, // Replace with actual user ID
      assignedUserId:undefined, // Replace with actual assigned user ID if needed
    };
  
    console.log("Payload:", payload); // Log the payload
  
    startTransition(async () => {
      try {
        const response = await createTask(payload);
        console.log("Response from createTask:", response); // Log the response
        if (response?.success) {
          toast.success("Task created successfully!");
          resetForm();
          onClose();
          window.location.reload();
        } else {
          toast.error(response?.error || "Failed to create task.");
        }
      } catch (error) {
        toast.error("An error occurred while creating the task.");
        console.error("Error in createTask:", error); // Log the error
      }
    });
  };
  

  const inputStyles =
    "w-full mt-1 rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white p-2 focus:ring-2 focus:ring-blue-500";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
      <form className="p-6 space-y-6" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          className={inputStyles}
          placeholder="Title *"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          className={inputStyles}
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <select
            name="status"
            className={inputStyles}
            value={formData.status}
            onChange={handleChange}
          >
            {StatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            name="priority"
            className={inputStyles}
            value={formData.priority}
            onChange={handleChange}
          >
            {PriorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          name="tags"
          className={inputStyles}
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <input
            type="date"
            name="startDate"
            className={inputStyles}
            value={formData.startDate}
            onChange={handleChange}
          />
          <input
            type="date"
            name="dueDate"
            className={inputStyles}
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>
        {id === null && (
          <input
            type="text"
            name="projectId"
            className={inputStyles}
            placeholder="Project ID *"
            value={formData.projectId}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="text"
          name="assignedUserId"
          className={inputStyles}
          placeholder="Assigned User ID (optional)"
          value={formData.assignedUserId}
          onChange={handleChange}
        />
        <button
          type="submit"
          className={`w-full flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isPending ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Task"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;
