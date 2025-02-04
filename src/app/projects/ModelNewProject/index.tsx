import Modal from "@/components/Modal";
import { useState } from "react";
import { createProject } from "@/lib/projects";
import { formatISO } from "date-fns";
import { Loader2 } from "lucide-react"; // For a loading spinner

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewProject = ({ isOpen, onClose }: Props) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!projectName || !startDate || !endDate) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createProject({
        name: projectName,
        description,
        startDate: formatISO(new Date(startDate)),
        endDate: formatISO(new Date(endDate)),
      });
      onClose();
      window.location.reload();
    } catch (err) {
      setError("Failed to create project. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Create a New Project
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Name
            </label>
            <input
              type="text"
              className="w-full mt-1 rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              className="w-full mt-1 rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your project"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date
              </label>
              <input
                type="date"
                className="w-full mt-1 rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white p-2 focus:ring-2 focus:ring-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date
              </label>
              <input
                type="date"
                className="w-full mt-1 rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white p-2 focus:ring-2 focus:ring-blue-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className={`w-full mt-4 flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default ModalNewProject;
