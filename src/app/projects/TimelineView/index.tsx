import React, { useMemo, useState } from "react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (state: boolean) => void;
};

type TaskTypeItems = "task" | "milestone" | "project";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  tags: string[];
  startDate: string;
  dueDate: string;
  points: number | null;
}

const Timeline = ({ id, setIsModalNewTaskOpen }: Props) => {
  const [displayOptions, setDisplayOptions] = useState({
    viewMode: "Month",
    statusFilter: "All",
    priorityFilter: "All",
  });

  // Sample tasks based on table
  const taskList: Task[] = [
    {
      id: 72,
      title: "Sanjay",
      description: "Sanjay",
      status: "Completed",
      priority: "Backlog",
      tags: ["backlog"],
      startDate: "2025-01-11T00:00:00Z",
      dueDate: "2025-01-22T00:00:00Z",
      points: null,
    },
    {
      id: 73,
      title: "Signin Component",
      description: "A sign-in page",
      status: "To Do",
      priority: "High",
      tags: ["important", "ss1"],
      startDate: "2025-01-11T00:00:00Z",
      dueDate: "2025-01-14T00:00:00Z",
      points: null,
    },
  ];

  const filteredTasks = useMemo(() => {
    return taskList.filter(
      (task) =>
        (displayOptions.statusFilter === "All" ||
          task.status === displayOptions.statusFilter) &&
        (displayOptions.priorityFilter === "All" ||
          task.priority === displayOptions.priorityFilter)
    );
  }, [taskList, displayOptions]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value,
    }));
  };

  const handleStatusFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      statusFilter: event.target.value,
    }));
  };

  const handlePriorityFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      priorityFilter: event.target.value,
    }));
  };

  return (
    <div className="px-4 xl:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2 py-5">
        <h1 className="text-lg font-bold dark:text-white">
          Project Tasks Timeline
        </h1>
        <div className="flex gap-2">
          {/* View Mode Selector */}
          <select
            className="focus:shadow-outline block w-full rounded border px-4 py-2"
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value="Day">Day</option>
            <option value="Week">Week</option>
            <option value="Month">Month</option>
          </select>
          {/* Status Filter */}
          <select
            className="focus:shadow-outline block w-full rounded border px-4 py-2"
            value={displayOptions.statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="To Do">To Do</option>
          </select>
          {/* Priority Filter */}
          <select
            className="focus:shadow-outline block w-full rounded border px-4 py-2"
            value={displayOptions.priorityFilter}
            onChange={handlePriorityFilterChange}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Backlog">Backlog</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-slate-50">
        <div className="timeline">
          <ul className="divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <li key={task.id} className="p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-500">{task.description}</p>
                    <div className="flex gap-2 mt-1">
                      {task.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block rounded bg-blue-100 px-2 py-1 text-xs text-blue-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm">
                      Status:{" "}
                      <span
                        className={`font-medium ${
                          task.status === "Completed"
                            ? "text-green-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {task.status}
                      </span>
                    </p>
                    <p className="text-sm">
                      Priority:{" "}
                      <span className="font-medium text-red-500">
                        {task.priority}
                      </span>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="px-4 pb-5 pt-1">
          <button
            className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add New Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
