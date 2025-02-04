"use server";

import { db } from "@/lib/db";
import { Task } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function createTask(data: {
  title: string;
  description: string;
  status?: string;
  priority?: string;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: number;
  authorUserId: number;
  assignedUserId?: number;
}) {
  try {
    console.log("Payload sent to the database:", {
  title: data.title.trim(),
  description: data.description.trim(),
  status: data.status?.toUpperCase() ?? "PENDING",
  priority: data.priority ?? "Medium",
  tags: data.tags,
  startDate: data.startDate,
  dueDate: data.dueDate,
  points: data.points ?? 0,
  projectId: data.projectId,
  authorUserId: data.authorUserId,
  assignedUserId: data.assignedUserId ?? null,
});

    const newTask = await db
      .insert(Task)
      .values({
        title: data.title.trim(),
        description: data.description.trim(),
        status: data.status?.toUpperCase() ?? "PENDING",
        priority: data.priority ?? "Medium",
        tags: data.tags || null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        points: data.points ?? 0,
        projectId: data.projectId,
        authorUserId: data.authorUserId,
        assignedUserId: data.assignedUserId ?? null,
      })
      .returning();

    return { success: true, task: newTask[0] };
  } catch (error) {
    console.error("Database Error (Create Task):", error);
    return { error: (error as Error).message };
  }
}

export async function getTasks(projectId: number) {
  try {
    const tasks = await db.select().from(Task).where(eq(Task.projectId, projectId));
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

export async function deleteTask(taskId: number) {
  try {
    const result = await db.delete(Task).where(eq(Task.id, taskId));
    return { success: !!result.rowCount }; // Ensure task deletion was successful
  } catch (error) {
    console.error("Error deleting task:", error);
    return { error: (error as Error).message };
  }
}
export async function updateTaskStatus(taskId: number, newStatus: string) {
  try {
    const updatedTask = await db
      .update(Task)
      .set({
        status: newStatus.toUpperCase(),
      })
      .where(eq(Task.id, taskId))
      .returning();

    if (!updatedTask.length) {
      return { success: false, error: "Task not found" };
    }

    return { success: true, task: updatedTask[0] };
  } catch (error) {
    console.error("Database Error (Update Task Status):", error);
    return { error: (error as Error).message };
  }
}