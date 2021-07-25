create table hospitals (
	id SERIAL NOT NULL PRIMARY KEY,
	name TEXT
);

create table suppliers (
	id SERIAL NOT NULL PRIMARY KEY,
	name TEXT
);

create table items (
	id SERIAL NOT NULL PRIMARY KEY,
	item_name text
);

create table inventory (
	item_id INT NOT NULL,
	hospital_id INT NOT NULL REFERENCES hospitals(id),
	foreign key (item_id) references items (id)
);

create table supply (
	supplier_id INT NOT NULL REFERENCES suppliers(id),
	item_id INT NOT NULL REFERENCES items(id),
	PRIMARY KEY (supplier_id, item_id)
);

create table requests (
	id SERIAL NOT NULL PRIMARY KEY,
	hospital_id INT NOT NULL REFERENCES hospitals(id),
	date_time TIMESTAMPTZ
);

create table item_supplied (
	request_id INT NOT NULL,
	item_id INT NOT NULL,
	supplier_id INT NOT NULL REFERENCES suppliers (id),
	PRIMARY KEY(request_id, item_id),
	foreign key (request_id, item_id) references sku (request_id, item_id),
	foreign key (item_id, supplier_id) references supply (item_id, supplier_id) 
);


create table SKU (
	request_id INT NOT NULL REFERENCES requests(id),
	item_id INT NOT NULL REFERENCES items(id),
	qty INT NOT NULL,
	price MONEY NOT NULL DEFAULT 0,
	PRIMARY KEY (request_id, item_id)
);

INSERT INTO hospitals (name)
VALUES ('Hospital A'),
       ('Hospital B');
	   
INSERT INTO suppliers (name)
VALUES ('GloveMed Inc'),
	   ('GownOnly'),
	   ('Everything Limited');

	   
INSERT INTO requests (id, hospital_id, date_time)
VALUES (2106001, 2, '2021-06-23 19:10:25-07'),
	   (2106002, 2, '2021-06-24 04:10'),
	   (2106003, 1, NOW());

INSERT INTO items (id, item_name) 
VALUES (10000, 'Latex Glove (S)'),
	   (10001, 'Latex Glove (M)'),
	   (10002, 'Latex Glove (L)'),
	   (10003, 'Medical Gown (Blue)'),
	   (10004, 'Medical Gown (Yellow)');

	   
INSERT INTO supply (supplier_id, item_id)
VALUES (1, 10000), (3, 10000), (1, 10001), (3, 10001),
	   (1, 10002), (3, 10002), (2, 10003), (3, 10003),
	   (2, 10004), (3, 10004);

/* REQ 2106001
   ORDER OF:
      100x Latex Glove (S) from GloveMed
	  50x Latex Glove (M) from GloveMed
	  200x Medical Gown (Blue) from Everything Limited
*/	   
INSERT INTO SKU (request_id, item_id, qty, price)
VALUES (2106001, 10000, 100, 2.5),
       (2106001, 10001, 50, 3),
	   (2106001, 10003, 200, 0.5);
	   
INSERT INTO item_supplied(request_id, item_id, supplier_id)
VALUES (2106001, 10000, 1),
	   (2106001, 10001, 1),
	   (2106001, 10003, 3);
	   
/* REQ 2106002
   Using Up:
	   10x Latex Glove (M)
	   40x Medical Gown (Blue)
*/
INSERT INTO SKU (request_id, item_id, qty)
VALUES (2106002, 10001, -10),
       (2106002, 10003, -40);
	   
	   
/* REQ 2106003
   ORDER OF:
       25x Latex Glove (L) from Everything LIMITED
	   30x Medical Gown (Blue) from GownOnly
	   50x Medical Gown (Yellow) from GownOnly
 */
INSERT INTO SKU (request_id, item_id, qty, price)
VALUES (2106003, 10002, 25, 1.2),
       (2106003, 10003, 30, 0.2),
	   (2106003, 10004, 50, 0.7);


INSERT INTO item_supplied(request_id, item_id, supplier_id)
VALUES (2106003, 10002, 3),
	   (2106003, 10003, 2),
	   (2106003, 10004, 2);




