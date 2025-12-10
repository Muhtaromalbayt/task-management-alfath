-- Create Super Admin User
INSERT INTO users (id, email, password, name, role, created_at)
VALUES (
  'u_superadmin',
  'programtutorial@upi.edu',
  '$2a$10$/E5HBYg1nJ63dZxkF3L0OO03dGspFMRrm7U7EpHq1ctYByJCZLb0K',
  'Super Admin Tutorial',
  'superadmin',
  datetime('now')
);
