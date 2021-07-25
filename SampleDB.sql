create table hospitals (
	id SERIAL NOT NULL PRIMARY KEY,
	name TEXT
);


create table inventory (
	hospital_id SERIAL NOT NULL REFERENCES hospitals(id),
	item_id INT NOT NULL REFERENCES items(id),
	qty INT,
	ts TIMESTAMPTZ
);

create table items (
	id SERIAL NOT NULL PRIMARY KEY,
	name TEXT
);

create table suppliers (
	id SERIAL NOT NULL PRIMARY KEY,
	name TEXT
)

create table supply (
	supplier_id INT NOT NULL REFERENCES suppliers(id),
	item_id INT NOT NULL REFERENCES items(id),
	qty INT
)

INSERT INTO hospitals (name)
VALUES ('Hospital A'),
       ('Hospital B');

INSERT INTO items (id, name)
VALUES (1000, 'Latex Gloves (S)'),
	   (1001, 'Latex Gloves (M)'),
	   (1002, 'Latex Gloves (L)')


INSERT INTO inventory (hospital_id, item_id, qty, ts)
VALUES ((SELECT id from hospitals where name = 'Hospital A'), (SELECT id from items where name = 'Latex Gloves (S)'), 30, NOW()),
	   ((SELECT id from hospitals where name = 'Hospital A'), (SELECT id from items where name = 'Latex Gloves (L)'), 50, NOW()),
	   ((SELECT id from hospitals where name = 'Hospital B'), (SELECT id from items where name = 'Latex Gloves (S)'), 600, NOW()),
	   ((SELECT id from hospitals where name = 'Hospital B'), (SELECT id from items where name = 'Latex Gloves (M)'), 150, NOW()),
	   ((SELECT id from hospitals where name = 'Hospital B'), (SELECT id from items where name = 'Latex Gloves (L)'), 100, NOW()),
	   ((SELECT id from hospitals where name = 'Hospital B'), (SELECT id from items where name = 'Latex Gloves (S)'), -150, NOW())
   
