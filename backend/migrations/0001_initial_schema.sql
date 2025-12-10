-- Migration: 0001_initial_schema.sql
-- Create all tables for Task Management System

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'superadmin')),
    avatar TEXT,
    division_id TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (division_id) REFERENCES divisions(id)
);

-- Divisions table
CREATE TABLE IF NOT EXISTS divisions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT 'bg-primary/10 border-primary',
    created_at TEXT DEFAULT (datetime('now'))
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Planning' CHECK (status IN ('Planning', 'In Progress', 'Completed', 'On Hold')),
    due_date TEXT,
    progress INTEGER DEFAULT 0,
    created_by TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Columns table (for Kanban)
CREATE TABLE IF NOT EXISTS columns (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    project_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    column_id TEXT NOT NULL,
    assignee_id TEXT,
    due_date TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE,
    FOREIGN KEY (assignee_id) REFERENCES users(id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'system' CHECK (type IN ('assignment', 'mention', 'deadline', 'system')),
    read INTEGER DEFAULT 0,
    user_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Project Members (many-to-many)
CREATE TABLE IF NOT EXISTS project_members (
    project_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_column_id ON tasks(column_id);
CREATE INDEX IF NOT EXISTS idx_columns_project_id ON columns(project_id);
CREATE INDEX IF NOT EXISTS idx_users_division_id ON users(division_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);
