-- Migration: 0002_seed_data.sql
-- Seed initial data for development

-- Insert divisions
INSERT OR IGNORE INTO divisions (id, name, description, color) VALUES
    ('presidium', 'Presidium Inti', 'Core leadership and strategic direction.', 'bg-primary/10 border-primary'),
    ('pai', 'Tutorial PAI', 'Managing Islamic Education tutorial programs.', 'bg-blue-500/10 border-blue-500'),
    ('spai', 'Tutorial SPAI', 'Specialized Islamic Education tutorial programs.', 'bg-indigo-500/10 border-indigo-500'),
    ('bk', 'Bina Kader', 'Cadre development and training.', 'bg-amber-500/10 border-amber-500'),
    ('syiar', 'Syiar & Media', 'Public relations and media management.', 'bg-emerald-500/10 border-emerald-500'),
    ('rt', 'Rumah Tangga', 'Secretariat management and logistics.', 'bg-pink-500/10 border-pink-500');

-- Insert admin user (password: admin123)
INSERT OR IGNORE INTO users (id, email, password, name, role, division_id) VALUES
    ('user-admin-001', 'admin@alfath.org', '$2a$10$rQZ8K.MzN0Hn6y6QXlR.YOKcRxH8xKwhV0VMvN4x8K7y5Y9YpKPhm', 'Admin Al-FATH', 'superadmin', 'presidium'),
    ('user-001', 'rifqi@alfath.org', '$2a$10$rQZ8K.MzN0Hn6y6QXlR.YOKcRxH8xKwhV0VMvN4x8K7y5Y9YpKPhm', 'Muhammad Rifqi', 'admin', 'presidium'),
    ('user-002', 'aisyah@alfath.org', '$2a$10$rQZ8K.MzN0Hn6y6QXlR.YOKcRxH8xKwhV0VMvN4x8K7y5Y9YpKPhm', 'Aisyah Putri', 'user', 'presidium'),
    ('user-003', 'budi@alfath.org', '$2a$10$rQZ8K.MzN0Hn6y6QXlR.YOKcRxH8xKwhV0VMvN4x8K7y5Y9YpKPhm', 'Budi Santoso', 'user', 'pai'),
    ('user-004', 'fajar@alfath.org', '$2a$10$rQZ8K.MzN0Hn6y6QXlR.YOKcRxH8xKwhV0VMvN4x8K7y5Y9YpKPhm', 'Fajar Siddiq', 'user', 'pai'),
    ('user-005', 'nadia@alfath.org', '$2a$10$rQZ8K.MzN0Hn6y6QXlR.YOKcRxH8xKwhV0VMvN4x8K7y5Y9YpKPhm', 'Nadia Rahma', 'user', 'spai');

-- Insert sample project
INSERT OR IGNORE INTO projects (id, title, description, status, due_date, progress, created_by) VALUES
    ('proj-001', 'Website Redesign', 'Revamp the main company website with new branding.', 'In Progress', '2025-12-31', 65, 'user-001'),
    ('proj-002', 'Mobile App Development', 'Create a cross-platform mobile app for clients.', 'Planning', '2026-01-15', 10, 'user-001'),
    ('proj-003', 'Marketing Campaign', 'Q1 2026 marketing strategy and execution.', 'Completed', '2025-11-30', 100, 'user-002');

-- Insert columns for Website Redesign project
INSERT OR IGNORE INTO columns (id, title, "order", project_id) VALUES
    ('col-todo', 'To Do', 0, 'proj-001'),
    ('col-inprogress', 'In Progress', 1, 'proj-001'),
    ('col-review', 'Review', 2, 'proj-001'),
    ('col-done', 'Done', 3, 'proj-001');

-- Insert sample tasks
INSERT OR IGNORE INTO tasks (id, content, priority, column_id, assignee_id, "order") VALUES
    ('task-001', 'Design System Draft', 'High', 'col-todo', 'user-001', 0),
    ('task-002', 'Competitor Analysis', 'Medium', 'col-todo', 'user-003', 1),
    ('task-003', 'Auth API Integration', 'High', 'col-inprogress', 'user-004', 0),
    ('task-004', 'Sidebar Component', 'Low', 'col-inprogress', 'user-001', 1),
    ('task-005', 'Database Schema', 'High', 'col-review', 'user-003', 0),
    ('task-006', 'Project Setup', 'Medium', 'col-done', 'user-001', 0);

-- Insert project members
INSERT OR IGNORE INTO project_members (project_id, user_id, role) VALUES
    ('proj-001', 'user-001', 'owner'),
    ('proj-001', 'user-003', 'member'),
    ('proj-001', 'user-004', 'member'),
    ('proj-002', 'user-001', 'owner'),
    ('proj-002', 'user-005', 'member');

-- Insert sample notifications
INSERT OR IGNORE INTO notifications (id, title, message, type, read, user_id) VALUES
    ('notif-001', 'New Task Assigned', 'You have been assigned to ''Homepage Redesign''', 'assignment', 0, 'user-001'),
    ('notif-002', 'Mentioned in Comment', 'Sarah mentioned you in ''API Schema'': @alex can you review this?', 'mention', 0, 'user-001'),
    ('notif-003', 'Task Deadline Approaching', '''Database Migration'' is due tomorrow at 5:00 PM', 'deadline', 1, 'user-001');
