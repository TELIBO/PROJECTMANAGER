"use client";

import {
  Project,
  useGetProjectsQuery,
  useGetTasksQuery,
} from "@/state/api";
import React from "react";
import { useAppSelector } from "../redux";
import Header from "@/components/Header";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const HomePage = () => {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery({ projectId: parseInt("1") });
  const { data: projects, isLoading: isProjectsLoading } =
    useGetProjectsQuery();


  if (tasksLoading || isProjectsLoading) return <div>Loading..</div>;
  if (tasksError || !tasks || !projects) return <div>Error fetching data</div>;

  // Count project status for PieChart
  const statusCount = projects.reduce(
    (acc: Record<string, number>, project: Project) => {
      const status = project.endDate ? "Completed" : "Active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {}
  );

  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

  return (
    <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
      <Header name="Project Management Dashboard" />

      {/* Project Status Pie Chart */}
      <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
        <h3 className="mb-4 text-lg font-semibold dark:text-white">
          Project Status
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie dataKey="count" data={projectStatus} fill="#82ca9d" label>
              {projectStatus.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Simple Task Table */}
      
      
    </div>
  );
};

export default HomePage;
