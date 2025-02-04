import { useGetTasksQuery, useUpdateTaskStatusMutation, useDeleteTaskMutation } from "@/state/api";
import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task as TaskType } from "@/state/api";
import { ArrowRight, EllipsisVertical, Plus, Trash } from "lucide-react";
import { format } from "date-fns";


type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId: Number(id) });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [deleteTask] = useDeleteTaskMutation(); // Initialize delete mutation

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
            deleteTask={deleteTask} // Pass delete mutation
          />
        ))}
      </div>
    </DndProvider>
  );
};

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  deleteTask: (taskId: number) => void; // Add delete task prop
};

const TaskColumn = ({ status, tasks, moveTask, setIsModalNewTaskOpen, deleteTask }: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const tasksCount = tasks.filter((task) => task.status === status).length;

  const statusColor: any = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    Completed: "#000000",
  };

  return (
    <div
      ref={drop}
      className={`py-4 rounded-lg  xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
    >
      <div className="mb-3 flex w-full">
        <div
          className={`w-2 rounded-s-lg`}
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {status}{" "}
            <span
              className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary"
              style={{ width: "1.5rem", height: "1.5rem" }}
            >
              {tasksCount}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
              <EllipsisVertical size={26} />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <Task key={task.id} task={task} deleteTask={deleteTask} />
        ))}
      
    </div>
  );
};

type TaskProps = {
  task: TaskType;
  deleteTask: (taskId: number) => void; // Accept delete function
};

const Task = ({ task, deleteTask }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  const formattedStartDate = task.startDate ? format(new Date(task.startDate), "P") : "";
  const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), "P") : "";

  const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => (
    <div
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        priority === "Urgent"
          ? "bg-red-200 text-red-700"
          : priority === "High"
          ? "bg-yellow-200 text-yellow-700"
          : priority === "Medium"
          ? "bg-green-200 text-green-700"
          : priority === "Low"
          ? "bg-blue-200 text-blue-700"
          : "bg-gray-200 text-gray-700"
      }`}
    >
      {priority}
    </div>
  );

  return (
  <div ref={drag}
  className={`mb-4 rounded-lg bg-white shadow-lg dark:bg-dark-secondary transition-all ${
    isDragging ? "opacity-50 scale-95" : "opacity-100 scale-100"
  }`}
>
  <div className="p-5 md:p-6 space-y-4">
    {/* Task Header */}
    <div className="flex items-start justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {task.priority && <PriorityTag priority={task.priority} />}
        <div className="flex gap-2 flex-wrap">
          {taskTagsSplit.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800 font-medium shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <button
        onClick={() => deleteTask(task.id)}
        className="flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash size={20} />
      </button>
    </div>

    {/* Task Title */}
    <div className="flex items-center justify-between">
      <h4 className="text-lg font-semibold text-black dark:text-white truncate">
        {task.title}
      </h4>
      {typeof task.points === "number" && (
        <span className="text-sm font-medium bg-gray-100 dark:bg-dark-primary px-3 py-1 rounded-lg dark:text-white">
          {task.points} pts
        </span>
      )}
    </div>

    {/* Task Dates */}
    <div className="text-sm flex items-center space-x-1 text-gray-600 dark:text-gray-300">
      {formattedStartDate && (
        <span className="whitespace-nowrap">{formattedStartDate}</span>
      )}
      {formattedStartDate && formattedDueDate && <span>-</span>}
      {formattedDueDate && (
        <span className="whitespace-nowrap">{formattedDueDate}</span>
      )}
    </div>

    {/* Task Description */}
    <p className="text-sm text-gray-700 dark:text-gray-300">
      {task.description}
    </p>

    {/* Task Author and Assignee */}
    <div className="flex items-center space-x-3">
      <span className="inline-flex items-center px-3 py-1 bg-blue-500 text-white text-sm rounded-lg shadow-md">
        {task.author?.username}
      </span>
      <ArrowRight className="h-4 text-gray-400" />
      <span className="inline-flex items-center px-3 py-1 bg-red-500 text-white text-sm rounded-lg shadow-md">
        {task.assignee?.username}
      </span>
    </div>
  </div>
</div>

  );
};

export default BoardView;