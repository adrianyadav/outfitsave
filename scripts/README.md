# Scripts

This directory contains utility scripts for the unpacked project.

## Available Scripts

### `reset-db.sh`

Resets the local database to a fresh state. This script will:

1. **Reset the database** - Completely clears all data
2. **Generate Prisma client** - Ensures the client is up to date
3. **Run migrations** - Applies all database migrations
4. **Verify connection** - Tests the database connection

#### Usage

```bash
# Using npm script (recommended)
npm run db:reset

# Or directly
./scripts/reset-db.sh
```

#### Safety Features

- **Confirmation prompt** - Asks for confirmation before proceeding
- **Error handling** - Stops execution if any step fails
- **Environment check** - Verifies you're in the project root
- **Colored output** - Easy to read status messages

#### When to Use

- Starting fresh development
- After schema changes
- When database is in an inconsistent state
- Before running tests that require a clean database

#### ⚠️ Warning

This script will **permanently delete all data** in your local database. Make sure you have backed up any important data before running it.
