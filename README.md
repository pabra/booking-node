booking-node
============

turn any website into a book-anything managing page


DB
--

```bash
./db/build_container.sh
./db/detach_container.sh

# start PHPMyAdmin
./db/run_phpmyadmin.sh
```


API
---

```bash
# run in docker container (will be production)
./api/build_container.sh
./api/detach_container.sh

# run local natively (development)
cd api/build
npm install
../run_local.sh
```


communicate with the API
------------------------

Running the node (API) app local (not in the docker container), will print out
some debug information.

Ever tried [httpie](https://github.com/jkbrzt/httpie)? Replace `http` with
`curl -v` if you like `curl` more.

```bash
# test DB connection
http localhost:3000

# request item availbility
http localhost:3000/item/item01/2016

# post a booking
http POST localhost:3000/item/abc123/2016-06-01..2016-06-30

# invalid requests
http localhost:3000/abc/def
http localhost:3000/item/abc_def/2016
http localhost:3000/item/abc123/2010
http POST localhost:3000/item/abc123/2016-07-01..2016-06-30
```
