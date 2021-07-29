create type organization_type as enum ('hospital', 'vendor');

create table public.accounts (
	account_id BIGINT not null unique,
	organization_name TEXT not null,
	email_address VARCHAR(32) not null,
	mobile_number NUMERIC(10) not null,
	password_hash VARCHAR(32) not null,
	last_login TIMESTAMP not null,
	account_type organization_type not null,
	primary key (account_id)
);

create table public.products (
	product_id BIGINT not null unique,
	title VARCHAR(75) not null,
	size VARCHAR(10),
	created_at TIMESTAMP not null,
	updated_at TIMESTAMP null default null,
	price BIGINT not null,
	primary key (product_id)
);	

create table public.hospitals (
	hospital_id BIGINT not null unique,
	hospital_name TEXT not null,
	email_address VARCHAR(32) not null,
	address VARCHAR(128) not null,
	inventory BIGINT[2][],
	primary key (hospital_id),
	foreign key (hospital_id) references accounts (account_id)
);

create table public.suppliers (
	supplier_id BIGINT not null unique,
	supplier_name TEXT not null,
	email_address VARCHAR(32) not null,
	address VARCHAR(128) not null,
	max_production BIGINT[2][],
	primary key (supplier_id),
	foreign key (supplier_id) references accounts (account_id)
);

create table public.supply_orders (
	order_id BIGINT not null unique,
	supplier_id BIGINT not null,
	hospital_id BIGINT not null,
	product_id BIGINT not null,
	quantity BIGINT not null,
	fulfilled BOOL default false,
	time_created TIMESTAMP not null,
	time_fulfilled TIMESTAMP null default null,
	primary key (order_id),
	foreign key (supplier_id) references suppliers (supplier_id),
	foreign key (hospital_id) references hospitals (hospital_id),
	foreign key (product_id) references products (product_id)
);