"use server"; // This makes it a Server Action

import { db } from "./db"; // Import Drizzle instance
import { Project } from "./schema";

export async function createProject(data: {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
}) {
  try {
    await db.insert(Project).values({
      name: data.name,
      description: data.description,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    });

    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: (error as Error).message };
  }
}

export async function getProjects() {
  try {
    const projects = await db.select().from(Project);
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}