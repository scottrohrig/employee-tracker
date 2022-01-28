SOURCE db/schema.sql;

INSERT INTO department (name)
VALUES 
    ('Management'),
    ('Marketing'),
    ('Finance'),
    ('Purchasing'),
    ('Human Resources'),
    ('Research and Development'),
    ('Information Technology'),
    ('Production');

INSERT INTO role (title, salary, department_id)
VALUES 
    -- General Management
    ('CEO', 200000.00, 1),
        -- manager = ceo
    ('Chief of Staff', 160000.00, 1), 
    ('Director of Marketing', 130000.00, 1),
        -- manager = D. of Staff
    ('Director of Finance', 150000.00, 1),
    ('Director of Operations', 160000.00, 1),
        -- negotiations, budgeting, purchasing
    ('Director of Human Resources', 145000.00, 1),
    ('Director of R&D', 180000.00, 1),
    ('Director of IT', 135000.00, 1),
    ('Director of Production', 145000.00, 1),
    -- Marketing
    ('Campaign Manager', 90000.00, 2),
    ('Digital Marketing Specialist', 80000.00, 2),
    ('Social Media Expert', 60000.00, 2),
    ('SEO Expert', 60000.00, 2),
    -- Finance
    ('Senior Analyst', 95000.00, 3),
    ('Junior Analyst', 70000.00, 3),
    -- Purchasing
    ('Contracts Officer', 90000.00, 4),
    ('Sourcing Officer', 75000.00, 4),
    ('Sourcing Agent', 60000.00, 4),
    -- HR
    ('Development Manager', 90000.00, 5),
    ('Safety Manager', 78000.00, 5),
    ('HR Analyst', 65000.00, 5),
    -- R&D
    ('Senior Engineer',90000.00, 6),
    ('Junior Engineer',75000.00, 6),
    -- IT
    ('Systems Administrator', 80000.00, 7),
    ('Data Analyst', 78000.00, 7),
    ('Technician', 60000.00, 7),
    -- Production
    ('Logistics Director', 80000.00, 8),
    ('Warehouse Supervisor', 65000.00, 8);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('James','Fraser', 1, NULL),
    ('Antoinette','Capet', 2, 1),
    ('Jack','London', 3, 2),
    ('Robert','Bruce', 4, 2),
    ('Paolo','Pasolini', 5, 2),
    ('Sandy','Powell', 6, 2),
    ('Emil','Zola', 7, 2),
    ('Derek','Jarman', 8, 2),
    ('Heathcote','Williams', 9, 2),
    ('Dennis','Cooper', 10, 3),
    ('Sissy','Coapolis', 11, 3),
    ('Tony','Duvert', 12, 3),
    ('Monica','Bellucci', 13, 3),
    ('Samuel','Delaney', 14, 3),
    ('John','Dryden',15, 4),
    ('Samuel','Johnson',16, 4),
    ('Mary','Greeneburg',16, 4);