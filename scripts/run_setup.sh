# Install node packages
npm install

# Copy .env.sample to .env
cp .env.sample .env;

# Create databases: kingdom_rush_db, test_db, empty_test_db
# Run migrations for test_db and kingdom_rush_db
# Populate kingdom_rush_db from yaml to json to database tables to csv
# then populates test_db with csv data
npm run db:reset-data;

# Print the information in the test_db
psql kingdom_rush_user -h localhost -d test_db --pset=pager -f ./scripts/db_gen_info.sql;
psql kingdom_rush_user -h localhost -d test_db --pset=pager -f ./scripts/db_table_info.sql;

# Wait for a while before accessing the database when testing
# to make sure that the database is already populated before accessing it
# this helps prevent errors in testing the database
sleep 5

# Run tests
npm run test
