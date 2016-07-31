-- CREATE DATABASE fewo_py CHARACTER SET utf8;
-- USE fewo_py;

SET time_zone = '+00:00';

CREATE TABLE companies (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    uid varchar(6) NOT NULL,
    name varchar(32) DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

INSERT INTO companies
    (uid, name)
    VALUES
    ('XR00TX', 'root company');

CREATE TABLE user_roles (
    id int(1) unsigned NOT NULL AUTO_INCREMENT,
    name varchar(16) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

INSERT INTO user_roles
    (name)
    VALUES
    ('root'),       -- all rights to everything
    ('owner'),      -- all rights for an company (right to rename and remove company)
    ('deputy'),     -- all rights for an company (except rename and remove company)
    ('manager'),    -- rights for specific items or groups (allowed to add and remove items in groups)
    ('booker');     -- can only handle requests for specific items or groups

CREATE TABLE users (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    uid varchar(6) NOT NULL,
    name varchar(32) NOT NULL,
    email varchar(32) NOT NULL,
    pass varchar(32) NOT NULL,
    company int(4) unsigned NOT NULL,
    role int(1) unsigned NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (uid),
    KEY (company),
    KEY (role),
    FOREIGN KEY (company) REFERENCES companies (id),
    FOREIGN KEY (role) REFERENCES user_roles (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

INSERT INTO users
    (uid, name, email, pass, company, role)
    VALUES
    ('xr00tx', 'root user', 'root@localhost', 'admin', (SELECT id FROM companies WHERE uid = 'XR00TX'), (SELECT id FROM user_roles WHERE name = 'root'));

CREATE TABLE item_groups (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    uid varchar(6) NOT NULL,
    name varchar(32) NOT NULL,
    company int(4) unsigned NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (uid),
    UNIQUE KEY (company,name),
    FOREIGN KEY (company) REFERENCES companies (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE items (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    uid varchar(6) NOT NULL,
    name varchar(32) NOT NULL,
    item_group int(4) unsigned NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (uid),
    UNIQUE KEY (item_group,name),
    FOREIGN KEY (item_group) REFERENCES item_groups (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE user_item_group (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    user int(4) unsigned NOT NULL,
    item_group int(4) unsigned NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (user,item_group),
    KEY (item_group),
    FOREIGN KEY (user) REFERENCES users (id),
    FOREIGN KEY (item_group) REFERENCES item_groups (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE user_item (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    user int(4) unsigned NOT NULL,
    item int(4) unsigned NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (user,item),
    KEY (item),
    FOREIGN KEY (user) REFERENCES users (id),
    FOREIGN KEY (item) REFERENCES items (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE customers (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    uid varchar(6) NOT NULL,
    name varchar(32) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE requests (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    uid varchar(6) NOT NULL,
    customer int(4) unsigned NOT NULL,
    item int(4) unsigned DEFAULT NULL,
    date_from date NOT NULL,
    date_to date NOT NULL,
    request_time datetime NOT NULL,
    accept_time datetime DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (uid),
    KEY (customer),
    KEY (item),
    FOREIGN KEY (customer) REFERENCES customers (id),
    FOREIGN KEY (item) REFERENCES items (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


-- DEMO DATA
INSERT INTO companies
    (uid, name)
    VALUES
    ('AbCDeF', 'some company');

INSERT INTO users
    (uid, name, email, pass, company, role)
    VALUES
    ('abc123', 'ein user', 'user@localhost', 'pass', (SELECT id FROM companies WHERE uid = 'AbCDeF'), (SELECT id FROM user_roles WHERE name = 'owner'));
