-- =============================================
-- ProjectHub Sample Data
-- Azure SQL Database Sample Data Script
-- =============================================

-- NOTE: Run this script AFTER creating the database schema using ProjectHub_Database_Schema.sql
-- This script populates the projecthub schema with realistic sample data

-- =============================================
-- SAMPLE CLIENT DATA
-- =============================================

INSERT INTO projecthub.Clients (Name, ContactPerson, Email, Phone, Company, Address, City, State, ZipCode, Country, Industry, Notes, Status) VALUES
('Acme Corporation', 'John Smith', 'john.smith@acme.com', '+1-555-0101', 'Acme Corporation', '123 Business Street', 'New York', 'NY', '10001', 'USA', 'Technology', 'Long-term client with multiple ongoing projects.', 'Active'),
('Tech Solutions Inc', 'Sarah Johnson', 'sarah.johnson@techsolutions.com', '+1-555-0202', 'Tech Solutions Inc', '456 Innovation Avenue', 'San Francisco', 'CA', '94102', 'USA', 'Software', 'Fast-growing startup with ambitious goals.', 'Active'),
('Global Enterprises', 'Michael Brown', 'michael.brown@global.com', '+1-555-0303', 'Global Enterprises', '789 Corporate Boulevard', 'Chicago', 'IL', '60601', 'USA', 'Manufacturing', 'Multinational corporation requiring enterprise-level solutions.', 'Active'),
('StartupXYZ', 'Emily Davis', 'emily.davis@startupxyz.com', '+1-555-0404', 'StartupXYZ', '321 Startup Lane', 'Austin', 'TX', '78701', 'USA', 'E-commerce', 'Project on hold due to funding issues.', 'Prospect'),
('Healthcare Plus', 'Dr. Robert Wilson', 'robert.wilson@healthcareplus.com', '+1-555-0505', 'Healthcare Plus', '567 Medical Center Drive', 'Boston', 'MA', '02101', 'USA', 'Healthcare', 'Specialized healthcare technology requirements.', 'Active'),
('Finance Partners LLC', 'David Miller', 'david.miller@financepartners.com', '+1-555-0606', 'Finance Partners LLC', '123 Wall Street', 'New York', 'NY', '10005', 'USA', 'Finance', 'Investment banking client with high security requirements.', 'Active'),
('EduTech Systems', 'Jennifer Taylor', 'jennifer.taylor@edutech.com', '+1-555-0707', 'EduTech Systems', '456 Campus Drive', 'Boston', 'MA', '02115', 'USA', 'Education', 'EdTech company focused on remote learning solutions.', 'Active'),
('Retail Innovations', 'Lisa Anderson', 'lisa.anderson@retailinnovations.com', '+1-555-0808', 'Retail Innovations', '789 Market Street', 'San Francisco', 'CA', '94103', 'USA', 'Retail', 'E-commerce and physical retail integration project.', 'Active'),
('Media Solutions Group', 'James Thomas', 'james.thomas@mediasolutions.com', '+1-555-0909', 'Media Solutions Group', '321 Broadcast Avenue', 'Los Angeles', 'CA', '90028', 'USA', 'Media', 'Digital media transformation project.', 'Active'),
('Security Systems Ltd', 'William Lee', 'william.lee@securitysystems.com', '+1-555-1919', 'Security Systems Ltd', '987 Protection Road', 'Dallas', 'TX', '75201', 'USA', 'Security', 'Enterprise security system integration.', 'Active');

-- =============================================
-- SAMPLE PROJECT DATA
-- =============================================

INSERT INTO projecthub.Projects (Name, Description, ClientId, Status, Priority, StartDate, EndDate, EstimatedHours, ActualHours, Budget, Progress) VALUES
('E-commerce Platform Redesign', 'Complete redesign of the company''s e-commerce platform with modern UI/UX and enhanced functionality', 1, 'In Progress', 'High', '2024-09-01', '2024-12-31', 250, 180, 85000, 75),
('Mobile App Development', 'Native mobile application for iOS and Android platforms', 2, 'In Progress', 'Critical', '2024-11-01', '2025-03-31', 300, 85, 120000, 30),
('Database Migration', 'Migration from legacy database system to cloud-based solution', 3, 'Completed', 'High', '2024-07-01', '2024-10-31', 180, 195, 60000, 100),
('Security Audit Implementation', 'Comprehensive security review and implementation of enhanced security measures', 3, 'Planning', 'High', '2025-01-15', '2025-02-28', 120, 0, 45000, 0),
('Patient Management System', 'Custom healthcare patient management and scheduling system', 5, 'Completed', 'Medium', '2024-05-01', '2024-08-31', 350, 375, 120000, 100),
('CRM Integration', 'Integration of customer relationship management system with existing systems', 6, 'In Progress', 'High', '2024-10-01', '2024-12-31', 180, 95, 60000, 55),
('E-Learning Platform Development', 'Development of comprehensive online learning platform with course management', 7, 'In Progress', 'Medium', '2024-08-15', '2025-02-28', 400, 175, 90000, 45),
('Inventory Management System', 'Real-time inventory tracking and management solution', 8, 'In Progress', 'High', '2024-09-01', '2024-12-15', 300, 260, 75000, 85),
('Digital Media Asset Management', 'System for managing and organizing digital media assets', 9, 'In Progress', 'Medium', '2024-10-15', '2025-01-31', 200, 45, 55000, 25),
('Enterprise Security Platform', 'Comprehensive security management and monitoring platform', 10, 'Planning', 'Critical', '2025-02-01', '2025-05-31', 500, 0, 180000, 0);

-- =============================================
-- SAMPLE TASK DATA WITH DEPENDENCIES
-- =============================================

INSERT INTO projecthub.Tasks (Title, Description, ProjectId, ParentTaskId, PredecessorIds, AssignedTo, Status, Priority, StartDate, EndDate, DueDate, EstimatedHours, ActualHours, Progress, TaskOrder) VALUES
-- E-commerce Platform Redesign Tasks (Project 1)
('Design Homepage Mockup', 'Create detailed mockup for the new homepage design', 1, NULL, NULL, 'Alice Cooper', 'Completed', 'High', '2024-09-01', '2024-09-15', '2024-09-15', 20, 22, 100, 1000),
('Frontend Development', 'Implement responsive frontend using React and CSS', 1, NULL, '1', 'Bob Wilson', 'In Progress', 'High', '2024-09-16', '2024-11-30', '2024-11-30', 80, 65, 80, 2000),
('Setup React Components', 'Create reusable React components for the platform', 1, 2, NULL, 'Bob Wilson', 'In Progress', 'Medium', '2024-09-16', '2024-10-15', '2024-10-15', 35, 28, 85, 2100),
('Backend API Development', 'Develop RESTful APIs for the e-commerce platform', 1, NULL, NULL, 'Charlie Davis', 'In Progress', 'Critical', '2024-09-10', '2024-11-15', '2024-11-15', 60, 45, 70, 3000),
('Database Schema Design', 'Design and implement database schema for the platform', 1, NULL, NULL, 'Diana Wong', 'Completed', 'High', '2024-09-01', '2024-09-20', '2024-09-20', 25, 28, 100, 4000),
('Authentication System', 'Implement secure user authentication and authorization', 1, NULL, '5', 'Eve Martinez', 'In Progress', 'Critical', '2024-09-21', '2024-10-31', '2024-10-31', 40, 35, 90, 5000),
('Payment Integration', 'Integrate payment gateway for secure transactions', 1, NULL, '4', 'Frank Johnson', 'Not Started', 'High', '2024-11-01', '2024-11-30', '2024-11-30', 30, 0, 0, 6000),
('Content Migration', 'Migrate existing content to the new platform', 1, NULL, '6', 'Grace Kim', 'In Progress', 'Medium', '2024-10-15', '2024-11-15', '2024-11-15', 20, 12, 60, 7000),
('User Testing', 'Conduct comprehensive user testing and feedback collection', 1, NULL, '2,8', 'Hannah Smith', 'Not Started', 'Medium', '2024-11-20', '2024-12-15', '2024-12-15', 15, 0, 0, 8000),
('Deployment & Launch', 'Deploy the platform to production and handle launch', 1, NULL, '9', 'Ian Brown', 'Not Started', 'Critical', '2024-12-16', '2024-12-31', '2024-12-31', 25, 0, 0, 9000),

-- Mobile App Development Tasks (Project 2)
('Mobile App Requirements', 'Gather and document requirements for mobile application', 2, NULL, NULL, 'Jake Wilson', 'Completed', 'High', '2024-11-01', '2024-11-15', '2024-11-15', 25, 28, 100, 1000),
('UI/UX Design', 'Design user interface and experience for mobile app', 2, NULL, '11', 'Kelly Davis', 'In Progress', 'High', '2024-11-16', '2024-12-31', '2024-12-31', 45, 20, 45, 2000),
('iOS App Development', 'Develop native iOS application', 2, 12, NULL, 'Liam Johnson', 'In Progress', 'Critical', '2024-12-01', '2025-02-28', '2025-02-28', 80, 25, 30, 2100),
('Android App Development', 'Develop native Android application', 2, 12, NULL, 'Hannah Smith', 'Not Started', 'High', '2025-01-15', '2025-02-15', '2025-02-15', 60, 0, 0, 2200),
('Backend API Development', 'Develop API endpoints for mobile app', 2, NULL, NULL, 'Jake Wilson', 'In Progress', 'Critical', '2024-12-15', '2025-02-28', '2025-02-28', 120, 15, 10, 3000),
('App Store Deployment', 'Deploy apps to iOS App Store and Google Play Store', 2, NULL, '13,14', 'Mia Anderson', 'Not Started', 'Medium', '2025-03-01', '2025-03-31', '2025-03-31', 20, 0, 0, 4000),

-- Database Migration Tasks (Project 3)
('Data Analysis', 'Analyze current database structure and data patterns', 3, NULL, NULL, 'Diana Wong', 'Completed', 'High', '2024-08-01', '2024-08-15', '2024-08-15', 30, 32, 100, 1000),
('Schema Design', 'Design new database schema for cloud migration', 3, NULL, '17', 'Diana Wong', 'Completed', 'High', '2024-08-16', '2024-08-31', '2024-08-31', 25, 28, 100, 2000),
('Data Migration Scripts', 'Develop scripts to migrate data from legacy system', 3, NULL, '18', 'Charlie Davis', 'Completed', 'Critical', '2024-09-01', '2024-09-30', '2024-09-30', 45, 50, 100, 3000),
('Testing & Validation', 'Test migrated data and validate integrity', 3, NULL, '19', 'Eve Martinez', 'Completed', 'High', '2024-10-01', '2024-10-15', '2024-10-15', 20, 22, 100, 4000),
('Production Deployment', 'Deploy new database to production environment', 3, NULL, '20', 'Frank Johnson', 'Completed', 'Critical', '2024-10-16', '2024-10-31', '2024-10-31', 30, 28, 100, 5000),

-- Security Audit Implementation Tasks (Project 4)
('Security Assessment', 'Conduct comprehensive security assessment', 4, NULL, NULL, 'Security Team', 'Not Started', 'Critical', '2025-01-15', '2025-01-31', '2025-01-31', 40, 0, 0, 1000),
('Vulnerability Analysis', 'Analyze identified vulnerabilities and risks', 4, NULL, '22', 'Security Team', 'Not Started', 'High', '2025-02-01', '2025-02-10', '2025-02-10', 25, 0, 0, 2000),
('Security Implementation', 'Implement security measures and patches', 4, NULL, '23', 'Security Team', 'Not Started', 'Critical', '2025-02-11', '2025-02-25', '2025-02-25', 35, 0, 0, 3000),
('Security Testing', 'Test implemented security measures', 4, NULL, '24', 'Security Team', 'Not Started', 'High', '2025-02-26', '2025-02-28', '2025-02-28', 20, 0, 0, 4000),

-- Patient Management System Tasks (Project 5)
('Requirements Gathering', 'Gather requirements for patient management system', 5, NULL, NULL, 'Medical Team', 'Completed', 'High', '2024-05-01', '2024-05-15', '2024-05-15', 30, 35, 100, 1000),
('System Architecture', 'Design system architecture for healthcare compliance', 5, NULL, '26', 'System Architect', 'Completed', 'Critical', '2024-05-16', '2024-05-31', '2024-05-31', 40, 42, 100, 2000),
('Patient Portal Development', 'Develop patient portal for appointments and records', 5, NULL, '27', 'Web Developer', 'Completed', 'High', '2024-06-01', '2024-07-15', '2024-07-15', 80, 85, 100, 3000),
('Appointment Scheduling', 'Implement appointment scheduling system', 5, NULL, '28', 'Backend Developer', 'Completed', 'Medium', '2024-06-15', '2024-07-31', '2024-07-31', 60, 65, 100, 4000),
('Medical Records Integration', 'Integrate with existing medical records systems', 5, NULL, '26,29', 'Integration Specialist', 'Completed', 'Critical', '2024-07-01', '2024-08-15', '2024-08-15', 70, 75, 100, 5000),
('Testing & Deployment', 'Test system and deploy to production', 5, NULL, '28,29,30', 'QA Team', 'Completed', 'High', '2024-08-01', '2024-08-31', '2024-08-31', 50, 55, 100, 6000),

-- CRM Integration Tasks (Project 6)
('CRM Requirements Analysis', 'Analyze requirements for CRM integration', 6, NULL, NULL, 'Victor Lee', 'Completed', 'High', '2024-10-01', '2024-10-15', '2024-10-15', 30, 32, 100, 1000),
('Data Mapping', 'Map data between existing systems and CRM', 6, NULL, '32', 'Victor Lee', 'Completed', 'Medium', '2024-10-15', '2024-10-31', '2024-10-31', 25, 28, 100, 2000),
('API Development', 'Develop APIs for CRM integration', 6, NULL, '33', 'Wendy Brown', 'In Progress', 'High', '2024-11-01', '2024-12-15', '2024-12-15', 60, 35, 60, 3000),
('Data Synchronization', 'Implement real-time data synchronization', 6, NULL, '34', 'Xavier Chen', 'Not Started', 'Critical', '2024-12-01', '2024-12-31', '2024-12-31', 45, 0, 0, 4000),
('User Training', 'Train users on new CRM system', 6, NULL, '35', 'Yvonne Garcia', 'Not Started', 'Medium', '2024-12-20', '2024-12-31', '2024-12-31', 20, 0, 0, 5000),

-- E-Learning Platform Development Tasks (Project 7)
('Platform Requirements', 'Define requirements for e-learning platform', 7, NULL, NULL, 'Education Team', 'Completed', 'High', '2024-08-15', '2024-08-31', '2024-08-31', 35, 38, 100, 1000),
('Learning Management System', 'Develop core LMS functionality', 7, NULL, '37', 'LMS Developer', 'In Progress', 'Critical', '2024-09-01', '2024-12-31', '2024-12-31', 120, 85, 70, 2000),
('Content Management', 'Implement content creation and management tools', 7, NULL, '38', 'Content Developer', 'In Progress', 'High', '2024-10-01', '2025-01-31', '2025-01-31', 80, 35, 45, 3000),
('Student Portal', 'Develop student portal for course access', 7, NULL, '38', 'Frontend Developer', 'In Progress', 'Medium', '2024-11-01', '2025-01-15', '2025-01-15', 60, 15, 25, 4000),
('Assessment Tools', 'Implement quizzes and assessment functionality', 7, NULL, '39,40', 'Assessment Developer', 'Not Started', 'High', '2025-01-01', '2025-02-15', '2025-02-15', 50, 0, 0, 5000),
('Platform Testing', 'Comprehensive testing of e-learning platform', 7, NULL, '41', 'QA Team', 'Not Started', 'Medium', '2025-02-01', '2025-02-28', '2025-02-28', 35, 0, 0, 6000),

-- Inventory Management System Tasks (Project 8)
('Inventory Analysis', 'Analyze current inventory management processes', 8, NULL, NULL, 'Operations Team', 'Completed', 'High', '2024-09-01', '2024-09-15', '2024-09-15', 25, 28, 100, 1000),
('System Design', 'Design inventory management system architecture', 8, NULL, '43', 'System Designer', 'Completed', 'High', '2024-09-16', '2024-09-30', '2024-09-30', 30, 32, 100, 2000),
('Database Development', 'Develop inventory database and schema', 8, NULL, '44', 'Database Developer', 'Completed', 'Critical', '2024-10-01', '2024-10-31', '2024-10-31', 40, 45, 100, 3000),
('Web Application', 'Develop web-based inventory management application', 8, NULL, '45', 'Web Developer', 'In Progress', 'High', '2024-11-01', '2024-12-15', '2024-12-15', 80, 70, 85, 4000),
('Barcode Integration', 'Implement barcode scanning functionality', 8, NULL, '46', 'Integration Specialist', 'In Progress', 'Medium', '2024-11-15', '2024-12-10', '2024-12-10', 35, 30, 80, 5000),
('Reporting Module', 'Develop reporting and analytics module', 8, NULL, '46', 'Analytics Developer', 'In Progress', 'Medium', '2024-12-01', '2024-12-15', '2024-12-15', 25, 15, 60, 6000),

-- Digital Media Asset Management Tasks (Project 9)
('Asset Requirements', 'Define requirements for digital asset management', 9, NULL, NULL, 'Media Team', 'Completed', 'High', '2024-10-15', '2024-10-31', '2024-10-31', 20, 22, 100, 1000),
('Storage Architecture', 'Design cloud storage architecture for media assets', 9, NULL, '49', 'Cloud Architect', 'In Progress', 'Critical', '2024-11-01', '2024-11-30', '2024-11-30', 35, 15, 45, 2000),
('Metadata Management', 'Implement metadata tagging and search functionality', 9, NULL, '50', 'Backend Developer', 'In Progress', 'High', '2024-11-15', '2024-12-31', '2024-12-31', 40, 8, 20, 3000),
('Media Processing', 'Develop media processing and optimization tools', 9, NULL, '50', 'Media Developer', 'Not Started', 'Medium', '2024-12-01', '2025-01-15', '2025-01-15', 45, 0, 0, 4000),
('User Interface', 'Create user interface for asset management', 9, NULL, '51', 'UI Developer', 'Not Started', 'High', '2024-12-15', '2025-01-31', '2025-01-31', 35, 0, 0, 5000),

-- Enterprise Security Platform Tasks (Project 10)
('Security Requirements', 'Gather comprehensive security requirements', 10, NULL, NULL, 'Security Analyst', 'Not Started', 'Critical', '2025-02-01', '2025-02-15', '2025-02-15', 40, 0, 0, 1000),
('Threat Modeling', 'Conduct threat modeling and risk assessment', 10, NULL, '54', 'Security Architect', 'Not Started', 'Critical', '2025-02-16', '2025-02-28', '2025-02-28', 35, 0, 0, 2000),
('Security Framework', 'Develop security framework and policies', 10, NULL, '55', 'Security Engineer', 'Not Started', 'High', '2025-03-01', '2025-03-31', '2025-03-31', 60, 0, 0, 3000),
('Monitoring System', 'Implement security monitoring and alerting', 10, NULL, '56', 'DevOps Engineer', 'Not Started', 'Critical', '2025-03-15', '2025-04-30', '2025-04-30', 80, 0, 0, 4000),
('Incident Response', 'Develop incident response procedures', 10, NULL, '57', 'Security Team', 'Not Started', 'High', '2025-04-01', '2025-04-30', '2025-04-30', 45, 0, 0, 5000),
('Security Training', 'Conduct security awareness training', 10, NULL, '58', 'Training Team', 'Not Started', 'Medium', '2025-05-01', '2025-05-31', '2025-05-31', 30, 0, 0, 6000),
('Platform Testing', 'Comprehensive security testing and validation', 10, NULL, '56,57,58', 'Security QA', 'Not Started', 'Critical', '2025-05-15', '2025-05-31', '2025-05-31', 50, 0, 0, 7000);

-- =============================================
-- DATA SUMMARY
-- =============================================

PRINT 'ProjectHub sample data inserted successfully!'
PRINT 'Summary:'
PRINT '- Clients: 10 records (mix of Active and Prospect statuses)'
PRINT '- Projects: 10 records (various statuses and progress levels)'
PRINT '- Tasks: 60 records (with realistic dependencies and hierarchies)'
PRINT ''
PRINT 'Key Features:'
PRINT '- Task dependencies stored as comma-separated predecessor IDs'
PRINT '- Hierarchical task structures with parent-child relationships'
PRINT '- Realistic project timelines spanning 2024-2025'
PRINT '- Varied progress levels and status combinations'
PRINT '- Multiple industries and project types represented'
PRINT ''
PRINT 'Ready for testing with Power Apps Code App integration!'
