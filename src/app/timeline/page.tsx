"use client";

import { useEffect, useState, useMemo } from "react";
import { getProjects } from "@/lib/projects"; // Import the Server Action
import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";

type TaskTypeItems = "task" | "milestone" | "project";
type ViewMode = "Day" | "Week" | "Month";

type Project = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

const Timeline = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [viewMode, setViewMode] = useState<ViewMode>("Month");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Fetch projects using Server Action
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects(); // Fetch data from server
        setProjects(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Convert projects into Gantt tasks format
  const ganttTasks = useMemo(() => {
    return projects.map((project) => ({
      start: new Date(project.startDate),
      end: new Date(project.endDate),
      name: project.name,
      id: `Project-${project.id}`,
      type: "project" as TaskTypeItems,
      progress: 50,
    }));
  }, [projects]);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !projects) return <div>An error occurred while fetching projects</div>;

  return (
    <div className="max-w-full p-8">
      <header className="mb-4 flex items-center justify-between">
        <Header name="Projects Timeline" />
        <div className="relative inline-block w-64">
          <select
            className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as ViewMode)}
          >
            <option value="Day">Day</option>
            <option value="Week">Week</option>
            <option value="Month">Month</option>
          </select>
        </div>
      </header>

      <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
        <div className="p-4">
          <table className="w-full table-auto border-collapse border border-gray-300 dark:border-dark-secondary">
            <thead>
              <tr className="bg-gray-200 dark:bg-dark-tertiary">
                <th className="border border-gray-300 px-4 py-2">Project Name</th>
                <th className="border border-gray-300 px-4 py-2">Start Date</th>
                <th className="border border-gray-300 px-4 py-2">End Date</th>
              </tr>
            </thead>
            <tbody>
              {ganttTasks.map((task) => (
                <tr key={task.id}>
                  <td className="border border-gray-300 px-4 py-2">{task.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {task.start.toDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {task.end.toDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
