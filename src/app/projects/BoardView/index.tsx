import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { EllipsisVertical, Plus, Trash } from "lucide-react";
import { format } from "date-fns";

// Define the Task type if not imported
interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority?: "Urgent" | "High" | "Medium" | "Low";
  points?: number;
  tags?: string;
  startDate?: string;
  dueDate?: string;
}

// Server Actions
import { getTasks, deleteTask, updateTaskStatus } from "@/lib/task";

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const taskStatus = ["TO DO", "WORKING PROGRESS", "UNDER REVIEW", "COMPLETED"] as const;
type TaskStatus = typeof taskStatus[number];

// Type-safe status color mapping
const statusColor: Record<TaskStatus, string> = {
  "TO DO": "#2563EB",
  "WORKING PROGRESS": "#059669",
  "UNDER REVIEW": "#D97706",
  "COMPLETED": "#000000",
};

const DndBoardWrapper = (props: BoardProps) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <BoardView {...props} />
    </DndProvider>
  );
};

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getTasks(Number(id));
        setTasks(fetchedTasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching tasks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [id]);

  const handleUpdateTaskStatus = async (taskId: number, newStatus: TaskStatus) => {
    try {
      const result = await updateTaskStatus(taskId, newStatus);
      if (!result.success) {
        throw new Error(result.error);
      }
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      // Optionally show error to user via toast/alert
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
      {taskStatus.map((status) => (
        <TaskColumn
          key={status}
          status={status}
          tasks={tasks}
          setTasks={setTasks}
          setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          onUpdateTaskStatus={handleUpdateTaskStatus}
        />
      ))}
    </div>
  );
};

type TaskColumnProps = {
  status: TaskStatus;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  onUpdateTaskStatus: (taskId: number, newStatus: TaskStatus) => Promise<void>;
};

const TaskColumn = ({ status, tasks, setTasks, setIsModalNewTaskOpen, onUpdateTaskStatus }: TaskColumnProps) => {
  const tasksCount = tasks.filter((task) => task.status === status).length;

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item: { id: number; currentStatus: string }) => {
      if (item.currentStatus !== status) {
        onUpdateTaskStatus(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop}
      className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
    >
      <div className="mb-3 flex w-full">
        <div
          className="w-2 rounded-s-lg"
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {status}
            <span
              className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary"
              style={{ width: "1.5rem", height: "1.5rem" }}
            >
              {tasksCount}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button 
              type="button"
              className="flex h-6 w-5 items-center justify-center dark:text-neutral-500"
            >
              <EllipsisVertical size={26} />
            </button>
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {tasks
          .filter((task) => task.status === status)
          .map((task) => (
            <Task key={task.id} task={task} setTasks={setTasks} />
          ))}
      </div>
    </div>
  );
};

type TaskProps = {
  task: Task;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const Task = ({ task, setTasks }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id, currentStatus: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleDeleteTask = async () => {
    try {
      await deleteTask(task.id);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
    } catch (error) {
      console.error("Failed to delete task:", error);
      // Optionally show error to user via toast/alert
    }
  };

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "";
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : "";

  const PriorityTag = ({ priority }: { priority: Task["priority"] }) => {
    if (!priority) return null;
    
    return (
      <div
        className={`rounded-full px-2 py-1 text-xs font-semibold ${
          priority === "Urgent"
            ? "bg-red-200 text-red-700"
            : priority === "High"
            ? "bg-yellow-200 text-yellow-700"
            : priority === "Medium"
            ? "bg-green-200 text-green-700"
            : "bg-blue-200 text-blue-700"
        }`}
      >
        {priority}
      </div>
    );
  };

  return (
    <div
      ref={drag}
      className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${
        isDragging ? 'opacity-50' : ''
      } cursor-move`}
    >
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {task.priority && <PriorityTag priority={task.priority} />}
            <div className="flex gap-2">
              {taskTagsSplit.map((tag) => (
                <div
                  key={tag}
                  className="rounded-full bg-blue-100 px-2 py-1 text-xs"
                >
                  {tag.trim()}
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={handleDeleteTask}
            className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500"
          >
            <Trash size={15} />
          </button>
        </div>

        <div className="my-3 flex justify-between">
          <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
          {typeof task.points === "number" && (
            <div className="text-xs font-semibold dark:text-white">
              {task.points} pts
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-neutral-500">
          {formattedStartDate && <span>{formattedStartDate} - </span>}
          {formattedDueDate && <span>{formattedDueDate}</span>}
        </div>
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-neutral-500">
            {task.description}
          </p>
        )}
        <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />
      </div>
    </div>
  );
};

export default DndBoardWrapper;