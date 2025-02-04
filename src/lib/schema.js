import { pgTable, serial, varchar, integer, timestamp, text } from 'drizzle-orm/pg-core';

// User Table
export const User = pgTable('User', {
  userId: serial('userId').primaryKey(),
  cognitoId: varchar('cognitoId').unique().notNull(),
  username: varchar('username').unique().notNull(),
  profilePictureUrl: varchar('profilePictureUrl'),
  teamId: integer('teamId').references(() => Team.id, { onDelete: 'SET NULL' }) // Reference to Team
});

// Team Table
export const Team = pgTable('Team', {
  id: serial('id').primaryKey(),
  teamName: varchar('teamName').notNull(),
  productOwnerUserId: integer('productOwnerUserId').references(() => User.userId, { onDelete: 'SET NULL' }),
  projectManagerUserId: integer('projectManagerUserId').references(() => User.userId, { onDelete: 'SET NULL' })
});

// Project Table
export const Project = pgTable('Project', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  description: text('description'),
  startDate: timestamp('startDate'),
  endDate: timestamp('endDate')
});

// ProjectTeam Table
export const ProjectTeam = pgTable('ProjectTeam', {
  id: serial('id').primaryKey(),
  teamId: integer('teamId').notNull().references(() => Team.id, { onDelete: 'CASCADE' }),
  projectId: integer('projectId').notNull().references(() => Project.id, { onDelete: 'CASCADE' })
});

// Task Table
export const Task = pgTable('Task', {
  id: serial('id').primaryKey(),
  title: varchar('title').notNull(),
  description: text('description'),
  status: varchar('status'),
  priority: varchar('priority'),
  tags: varchar('tags'),
  startDate: timestamp('startDate'),
  dueDate: timestamp('dueDate'),
  points: integer('points'),
  projectId: integer('projectId').notNull().references(() => Project.id, { onDelete: 'CASCADE' }),
  authorUserId: integer('authorUserId').notNull().references(() => User.userId, { onDelete: 'CASCADE' }),
  assignedUserId: integer('assignedUserId').references(() => User.userId, { onDelete: 'SET NULL' })
});

// TaskAssignment Table
export const TaskAssignment = pgTable('TaskAssignment', {
  id: serial('id').primaryKey(),
  userId: integer('userId').notNull().references(() => User.userId, { onDelete: 'CASCADE' }),
  taskId: integer('taskId').notNull().references(() => Task.id, { onDelete: 'CASCADE' })
});

// Attachment Table
export const Attachment = pgTable('Attachment', {
  id: serial('id').primaryKey(),
  fileURL: varchar('fileURL').notNull(),
  fileName: varchar('fileName'),
  taskId: integer('taskId').notNull().references(() => Task.id, { onDelete: 'CASCADE' }),
  uploadedById: integer('uploadedById').notNull().references(() => User.userId, { onDelete: 'CASCADE' })
});

// Comment Table
export const Comment = pgTable('Comment', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  taskId: integer('taskId').notNull().references(() => Task.id, { onDelete: 'CASCADE' }),
  userId: integer('userId').notNull().references(() => User.userId, { onDelete: 'CASCADE' })
});