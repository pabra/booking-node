/* companies have `items` and/or `item_groups` they want to offer. They also have
 * `users` to manage these `items`.
 */
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

/* users can login to the admin page and manage `items`, `requests`, etc.
 * depending on their `user_roles`. They belong to a company.
 */
CREATE TABLE users (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    uid varchar(6) NOT NULL,
    name varchar(32) NOT NULL,
    email varchar(32) NOT NULL,
    pass varchar(32) NOT NULL,
    company int(4) unsigned NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (uid),
    UNIQUE KEY (email),
    KEY (company),
    FOREIGN KEY (company) REFERENCES companies (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

INSERT INTO users
    (uid, name, email, pass, company)
    VALUES
    ('xr00tx', 'root user', 'root@localhost', 'admin', (SELECT id FROM companies WHERE uid = 'XR00TX'));

CREATE TABLE perm_global (
    user int(4) unsigned NOT NULL,
    permission int(1) unsigned NOT NULL,
    UNIQUE KEY (user),
    FOREIGN KEY (user) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

INSERT INTO perm_global
    (user, permission)
    VALUES
    ((SELECT id FROM users WHERE uid = 'xr00tx'), CONV('1111', 2, 10));

CREATE TABLE perm_company (
    user int(4) unsigned NOT NULL,
    company int(4) unsigned NOT NULL,
    permission int(1) unsigned NOT NULL,
    KEY (company),
    UNIQUE KEY (user, company),
    FOREIGN KEY (user) REFERENCES users (id),
    FOREIGN KEY (company) REFERENCES companies (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/* item_groups grouping multiple `items` of the same type. If someone offers seats
 * for a seminar, each seat would be an individual item but you won't offer each
 * item but the `item_group` od these items. Or you have multiple scooters of certain
 * types. You don't offer each individual scooter but all the different types of groups
 * of scooters.
 *  `item_groups` always belong to `companies`.
 * I think, this free grouping is a main feature.
 */
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

CREATE TABLE perm_item_group (
    user int(4) unsigned NOT NULL,
    item_group int(4) unsigned NOT NULL,
    permission int(1) unsigned NOT NULL,
    KEY (item_group),
    UNIQUE KEY (user, item_group),
    FOREIGN KEY (user) REFERENCES users (id),
    FOREIGN KEY (item_group) REFERENCES item_groups (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/* the individual items that are available. `items` always belong to `item_groups`
 * if you don't use `item_groups`, there has to be a transparent dummy groups. So
 * that there are fewer exceptions to look fo in the code and queries.
 */
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

CREATE TABLE perm_item (
    user int(4) unsigned NOT NULL,
    item int(4) unsigned NOT NULL,
    permission int(1) unsigned NOT NULL,
    KEY (item),
    UNIQUE KEY (user, item),
    FOREIGN KEY (user) REFERENCES users (id),
    FOREIGN KEY (item) REFERENCES items (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/* People that actually book/rent `items`
 */
CREATE TABLE customers (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    uid varchar(6) NOT NULL,
    name varchar(32) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/* `requests` of `customers` (the actual bookings). If a `customers` requests
 * `items_groups`, some code has to assign one/some available item(s) of that group.
 */
CREATE TABLE requests (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    uid varchar(6) NOT NULL,
    customer int(4) unsigned NOT NULL,
    date_from date NOT NULL,
    date_to date NOT NULL,
    request_time datetime NOT NULL,
    accept_time datetime DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (uid),
    KEY (customer),
    FOREIGN KEY (customer) REFERENCES customers (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/* Which `items` are involved by `requests`
 */
CREATE TABLE request_items (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    request int(4) unsigned NOT NULL,
    item int(4) unsigned NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (request, item),
    KEY (item),
    FOREIGN KEY (request) REFERENCES requests (id),
    FOREIGN KEY (item) REFERENCES items (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- DEMO DATA
INSERT INTO companies
    (uid, name)
    VALUES
    ('comp01', 'some company'),
    ('comp02', 'another company');

INSERT INTO item_groups
    (uid, name, company)
    VALUES
    ('grou01', 'transparant', (SELECT id FROM companies WHERE uid = 'comp01')),
    ('grou02', 'transparant', (SELECT id FROM companies WHERE uid = 'comp02'));

INSERT INTO items
    (uid, name, item_group)
    VALUES
    ('item01', 'unique thing to rent', (SELECT id FROM item_groups WHERE uid = 'grou01')),
    ('item02', 'another thing', (SELECT id FROM item_groups WHERE uid = 'grou01'));

INSERT INTO users
    (uid, name, email, pass, company)
    VALUES
    ('user01', 'ein user', 'user@localhost', 'pass', (SELECT id FROM companies WHERE uid = 'comp01')),
    ('user02', 'view company user', 'user2@localhost', 'pass', (SELECT id FROM companies WHERE uid = 'comp01')),
    ('user03', 'company2 owner', 'user3@localhost', 'pass', (SELECT id FROM companies WHERE uid = 'comp02')),
    ('user04', 'company2 user', 'user4@localhost', 'pass', (SELECT id FROM companies WHERE uid = 'comp02'));

INSERT INTO perm_company
    (user, company, permission)
    VALUES
    ((SELECT id FROM users WHERE uid = 'user01'),
     (SELECT id FROM companies WHERE uid = 'comp01'),
     CONV('1111', 2, 10)),
    ((SELECT id FROM users WHERE uid = 'user02'),
     (SELECT id FROM companies WHERE uid = 'comp01'),
     CONV('0001', 2, 10)),
    ((SELECT id FROM users WHERE uid = 'user03'),
     (SELECT id FROM companies WHERE uid = 'comp02'),
     CONV('1111', 2, 10));

INSERT INTO customers
    (uid, name)
    VALUES
    ('cust01', 'a regular customer'),
    ('cust02', 'an unregular customer');

INSERT INTO requests
    (uid, customer, date_from, date_to, request_time)
    VALUES
    ('requ01', (SELECT id FROM customers WHERE uid = 'cust01'), '2016-06-15', '2016-07-03', '2016-05-05'),
    ('requ02', (SELECT id FROM customers WHERE uid = 'cust02'), '2016-06-02', '2016-06-20', '2016-05-09'),
    ('requ03', (SELECT id FROM customers WHERE uid = 'cust02'), '2016-05-21', '2016-06-01', '2016-05-04');

INSERT INTO request_items
    (request, item)
    VALUES
    ((SELECT id FROM requests WHERE uid = 'requ01'), (SELECT id FROM items WHERE uid = 'item01')),
    ((SELECT id FROM requests WHERE uid = 'requ02'), (SELECT id FROM items WHERE uid = 'item02')),
    ((SELECT id FROM requests WHERE uid = 'requ03'), (SELECT id FROM items WHERE uid = 'item01'));
