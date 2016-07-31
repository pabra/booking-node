# booking-node
turn any website into a book-anything managing page

## DB
```bash
./db/build_container.sh
./db/detach_container.sh

# use PHPMyAdmin
./db/run_phpmyadmin.sh
```

## API
```bash
# run in docker container (will be production)
./api/build_container.sh
./api/detach_container.sh

# run local natively (development)
cd api/build
npm install 
../run_local.sh
```
