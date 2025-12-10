-- Add start_date column to tasks
ALTER TABLE tasks ADD COLUMN start_date TEXT;

-- Insert Project
INSERT INTO projects (id, title, description, status, progress, created_at)
VALUES ('proj_timeline_2026', 'Tutorial PAI SPAI Genap 2025/2026', 'Timeline Kegiatan Tutorial PAI SPAI Semester Genap Tahun Ajaran 2025/2026', 'In Progress', 0, datetime('now'));

-- Insert Default Column
INSERT INTO columns (id, title, "order", project_id, created_at)
VALUES ('col_timeline_2026', 'Timeline Activities', 0, 'proj_timeline_2026', datetime('now'));

-- Insert Tasks (Events)
INSERT INTO tasks (id, content, priority, column_id, start_date, due_date, "order", created_at) VALUES 
('t_01', 'Pembacaan SK dan Pengambilan Sumpah Jabatan (Aula ITC)', 'High', 'col_timeline_2026', '2025-12-20', '2025-12-20', 0, datetime('now')),
('t_02', 'Musyawarah Pimpinan', 'Medium', 'col_timeline_2026', '2026-01-17', '2026-01-18', 1, datetime('now')),
('t_03', 'Musyawarah Akbar (Aula ITC & Online)', 'High', 'col_timeline_2026', NULL, NULL, 2, datetime('now')),
('t_04', 'Musyawarah Bidang', 'Medium', 'col_timeline_2026', '2026-01-24', '2026-01-30', 3, datetime('now')),
('t_05', 'Musyawarah Kerja (Aula ITC & Online)', 'High', 'col_timeline_2026', '2026-01-31', '2026-02-01', 4, datetime('now')),
('t_06', 'Sosialisasi Kahim (Online)', 'Medium', 'col_timeline_2026', '2026-02-02', '2026-02-02', 5, datetime('now')),
('t_07', 'Sosialisasi PJ Tutorial PAI SPAI (Aula ITC)', 'Medium', 'col_timeline_2026', '2026-02-07', '2026-02-07', 6, datetime('now')),
('t_08', 'In House Training Pengurus (Aula ITC)', 'Medium', 'col_timeline_2026', '2026-02-08', '2026-02-08', 7, datetime('now')),
('t_09', 'Sosialisasi Delegasi (Online)', 'Low', 'col_timeline_2026', '2026-02-13', '2026-02-13', 8, datetime('now')),
('t_10', 'Sosialisasi Bina Kader (Online & Aula ITC)', 'Medium', 'col_timeline_2026', '2026-02-14', '2026-02-14', 9, datetime('now')),
('t_11', 'Musyawarah Pimpinan (Feb)', 'Low', 'col_timeline_2026', '2026-02-15', '2026-02-15', 10, datetime('now')),
('t_12', 'Pembukaan Tutorial PAI SPAI', 'High', 'col_timeline_2026', '2026-02-21', '2026-02-22', 11, datetime('now')),
('t_13', 'Diklat PAI-SPAI', 'High', 'col_timeline_2026', '2026-02-21', '2026-02-22', 12, datetime('now')),
('t_14', 'Pekan 2: Tutorial PAI', 'Medium', 'col_timeline_2026', '2026-02-28', '2026-03-01', 13, datetime('now')),
('t_15', 'Pekan 2: Tutorial SPAI', 'Medium', 'col_timeline_2026', '2026-02-25', '2026-02-27', 14, datetime('now')),
('t_16', 'Pekan 2: Bina Kader', 'Low', 'col_timeline_2026', '2026-03-01', '2026-03-01', 15, datetime('now')),
('t_17', 'Pekan 2: Bina Mentor', 'Low', 'col_timeline_2026', '2026-02-28', '2026-03-01', 16, datetime('now')),
('t_18', 'Musyawarah Pimpinan (Mar)', 'Low', 'col_timeline_2026', '2026-03-15', '2026-03-15', 17, datetime('now')),
('t_19', 'Pekan 3: Tutorial PAI', 'Medium', 'col_timeline_2026', '2026-03-07', '2026-03-08', 18, datetime('now')),
('t_20', 'Pekan 3: Tutorial SPAI', 'Medium', 'col_timeline_2026', '2026-03-04', '2026-03-06', 19, datetime('now')),
('t_21', 'Pekan 3: Bina Kader', 'Low', 'col_timeline_2026', '2026-03-08', '2026-03-08', 20, datetime('now')),
('t_22', 'Pekan 4: Tutorial PAI', 'Medium', 'col_timeline_2026', '2026-04-04', '2026-04-05', 21, datetime('now')),
('t_23', 'Pekan 4: Tutorial SPAI', 'Medium', 'col_timeline_2026', '2026-04-11', '2026-04-13', 22, datetime('now')),
('t_24', 'Pekan 4: Bina Kader', 'Low', 'col_timeline_2026', '2026-04-05', '2026-04-05', 23, datetime('now')),
('t_25', 'Pekan 4: Bina Mentor', 'Low', 'col_timeline_2026', '2026-04-04', '2026-04-05', 24, datetime('now')),
('t_26', 'Pekan 5: Tutorial PAI', 'Medium', 'col_timeline_2026', '2026-04-11', '2026-04-12', 25, datetime('now')),
('t_27', 'Pekan 5: Tutorial SPAI', 'Medium', 'col_timeline_2026', '2026-04-08', '2026-04-10', 26, datetime('now')),
('t_28', 'Pekan 6: Tutorial PAI', 'Medium', 'col_timeline_2026', '2026-04-18', '2026-04-19', 27, datetime('now')),
('t_29', 'Pekan 6: Tutorial SPAI', 'Medium', 'col_timeline_2026', '2026-04-15', '2026-04-17', 28, datetime('now')),
('t_30', 'Pekan 7: Tutorial PAI', 'Medium', 'col_timeline_2026', '2026-04-25', '2026-04-26', 29, datetime('now')),
('t_31', 'Pekan 7: Tutorial SPAI', 'Medium', 'col_timeline_2026', '2026-04-22', '2026-04-24', 30, datetime('now')),
('t_32', 'Pengukuhan Bina Kader 42', 'High', 'col_timeline_2026', '2026-05-02', '2026-05-03', 31, datetime('now')),
('t_33', 'Pekan 8: Tutorial PAI', 'Medium', 'col_timeline_2026', '2026-05-09', '2026-05-10', 32, datetime('now')),
('t_34', 'Projek Mini Tutorial', 'Medium', 'col_timeline_2026', '2026-05-30', '2026-05-31', 33, datetime('now')),
('t_35', 'Rihlah', 'Low', 'col_timeline_2026', '2026-06-20', '2026-06-21', 34, datetime('now')),
('t_36', 'Evaluasi Sughra', 'High', 'col_timeline_2026', '2026-07-04', '2026-07-05', 35, datetime('now')),
('t_37', 'Serah Terima Jabatan', 'High', 'col_timeline_2026', '2026-08-07', '2026-08-07', 36, datetime('now'));
