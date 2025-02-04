"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  PlusSquare,
  X,
  TimerIcon,
  Users,
  List,
  Timer,
} from "lucide-react";
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
} from "@/state/api";
import { getProjects } from "@/lib/projects";
import ModalNewProject from "@/app/projects/ModelNewProject";

interface Project {
  id: number;
  name: string;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectDelete = (projectId: number) => {
    setProjects(currentProjects => 
      currentProjects.filter(project => project.id !== projectId)
    );
  };

  const sidebarClassNames = `fixed flex flex-col h-full justify-between shadow-xl transition-all duration-300 z-40 dark:bg-black bg-white ${
    isSidebarCollapsed ? "w-0 hidden" : "w-64"
  } overflow-y-auto`;

  return (
    <div className={sidebarClassNames}>
      <div className="flex flex-col h-full w-full">
        {/* Top Logo */}
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 dark:bg-black">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            TaskFlow
          </div>
          <button
            className="py-3"
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
          >
            <X className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white" />
          </button>
        </div>

        {/* Team Section */}
        <div className="flex items-center gap-5 border-y border-gray-200 px-8 py-4 dark:border-gray-700">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <div>
            <h3 className="text-md font-bold text-gray-800 dark:text-gray-200">
              Sanjay Team
            </h3>
            <p className="text-xs text-gray-500 mt-1">Private</p>
          </div>
        </div>

        {/* Navbar Links */}
        <nav className="z-10 w-full">
          <SidebarLink
            label="Timeline"
            href="/timeline"
            icon={<Timer className="h-5 w-5 text-black dark:text-white" />}
          />
          <button
            className="flex items-center ml-7 my-3 rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsModalNewProjectOpen(true)}
          >
            <PlusSquare className="mr-2 h-5 w-5" /> New Boards
          </button>
          <ModalNewProject
            isOpen={isModalNewProjectOpen}
            onClose={() => setIsModalNewProjectOpen(false)}
          />
        </nav>

        {/* Projects Section */}
        <button
          onClick={() => setShowProjects((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="flex items-center gap-2 text-black dark:text-white">
            <List className="h-5 w-5" /> Projects
          </span>
          {showProjects ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {showProjects && 
          projects.map((project) => (
            <SidebarLink
              key={project.id}
              label={project.name}
              href={`/projects/${project.id}`}
              projectId={project.id}
              onDelete={handleProjectDelete}
            />
          ))
        }
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  label: string;
  icon?: JSX.Element;
  projectId?: number;
  onDelete?: (projectId: number) => void;
}

const SidebarLink = ({
  href,
  label,
  icon,
  projectId,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const [isHidden, setIsHidden] = useState(false); // Manage hidden state

  if (isHidden) return null; // Hide the project when isHidden is true

  return (
    <Link href={href}>
      <div
        className={`relative flex items-center justify-between transition-colors px-8 py-3 ${
          isActive
            ? "bg-gray-100 text-white dark:bg-black"
            : "bg-white dark:bg-black"
        } hover:bg-gray-300 dark:hover:bg-gray-800`}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-gray-800 dark:text-gray-100">
            {label}
          </span>
        </div>
        {projectId && !isActive && (
          <button
            onClick={() => setIsHidden(true)} // Corrected the onClick handler
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </Link>
  );
};


export default Sidebar;