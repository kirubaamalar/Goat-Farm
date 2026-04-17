# Requirements Document

## Introduction

This requirements document specifies the functional and non-functional requirements for migrating a Python Flask goat farm management application from MySQL to SQLite. The migration enables standalone desktop deployment as a PyInstaller executable with a portable, self-contained database that requires no external database server installation. The system must maintain complete backward compatibility with existing functionality while adapting to SQLite's architecture and constraints.

## Glossary

- **Application**: The Python Flask goat farm management web application
- **Database_Layer**: The database connection and query execution module (database/db.py)
- **Model_Layer**: The data access layer providing CRUD operations (models/*.py)
- **SQLite_Database**: The local file-based database (goatfarm.db)
- **PyInstaller_Executable**: The standalone .exe file containing the bundled application
- **Soft_Delete**: Setting is_active=0 instead of removing records from database
- **Row_Factory**: SQLite configuration enabling dictionary-like access to query results
- **Parameterized_Query**: SQL query using ? placeholders to prevent SQL injection
- **Schema**: The database table structure definitions
- **CRUD_Operations**: Create, Read, Update, Delete operations on database records
- **ISO_8601**: International date/time format (YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)

## Requirements

### Requirement 1: Database Connection Management

**User Story:** As a developer, I want the application to connect to a local SQLite database, so that the application can run without requiring an external database server.

#### Acceptance Criteria

1. WHEN the application starts, THE Database_Layer SHALL establish a connection to the SQLite_Database file
2. WHEN a database connection is established, THE Database_Layer SHALL configure the Row_Factory to enable dictionary-like access to query results
3. IF the SQLite_Database file does not exist, THEN THE Database_Layer SHALL create it automatically
4. WHEN a database connection fails, THE Database_Layer SHALL log the error and return None
5. WHEN database operations complete, THE Database_Layer SHALL close the connection to release resources

### Requirement 2: Database Initialization

**User Story:** As a user, I want the application to automatically set up the database on first run, so that I don't need to manually configure the database.

#### Acceptance Criteria

1. WHEN the application starts for the first time, THE Application SHALL create all required database tables
2. THE Schema SHALL define six tables: goats, feeding, health, expense, sales, and users
3. WHEN tables already exist, THE Application SHALL skip table creation without errors
4. WHEN creating tables, THE Schema SHALL use SQLite-compatible data types and syntax
5. WHEN table creation fails, THE Application SHALL log the error and prevent application startup

### Requirement 3: Data Persistence and Retrieval

**User Story:** As a user, I want to store and retrieve goat farm data, so that I can manage my farm operations effectively.

#### Acceptance Criteria

1. WHEN a user creates a new record, THE Model_Layer SHALL insert it into the appropriate table and commit the transaction
2. WHEN a user requests data, THE Model_Layer SHALL retrieve all active records (is_active=1) from the database
3. WHEN a user updates a record, THE Model_Layer SHALL modify only the specified fields and update the updated_on timestamp
4. WHEN a user deletes a record, THE Model_Layer SHALL perform a Soft_Delete by setting is_active=0
5. WHEN query results are returned, THE Model_Layer SHALL provide dictionary-like access to row data

### Requirement 4: Query Security

**User Story:** As a security-conscious developer, I want all database queries to be protected against SQL injection, so that the application is secure from malicious input.

#### Acceptance Criteria

1. THE Model_Layer SHALL use Parameterized_Query syntax with ? placeholders for all user input
2. THE Model_Layer SHALL never concatenate user input directly into SQL query strings
3. WHEN executing queries, THE Database_Layer SHALL automatically escape all parameter values
4. THE Model_Layer SHALL validate that the number of ? placeholders matches the number of parameters

### Requirement 5: Data Type Compatibility

**User Story:** As a developer, I want data types to be correctly mapped between MySQL and SQLite, so that existing data structures remain compatible.

#### Acceptance Criteria

1. THE Schema SHALL use INTEGER for boolean fields (0 for false, 1 for true)
2. THE Schema SHALL use TEXT for date and datetime fields in ISO_8601 format
3. THE Schema SHALL use INTEGER PRIMARY KEY AUTOINCREMENT for auto-incrementing primary keys
4. THE Schema SHALL use REAL for floating-point numbers (weights, prices, quantities)
5. WHEN storing dates, THE Application SHALL format them as ISO_8601 strings

### Requirement 6: Standalone Deployment

**User Story:** As an end user, I want to run the application as a standalone executable, so that I don't need to install Python or database servers.

#### Acceptance Criteria

1. THE PyInstaller_Executable SHALL bundle all application code and dependencies
2. WHEN running as a PyInstaller_Executable, THE Application SHALL correctly resolve the database file path
3. THE Application SHALL create the SQLite_Database file in the same directory as the executable
4. THE PyInstaller_Executable SHALL include all static files (frontend assets, uploads directory)
5. THE Application SHALL run without requiring external Python installation

### Requirement 7: Goat Management

**User Story:** As a farm manager, I want to manage goat records, so that I can track my livestock inventory.

#### Acceptance Criteria

1. WHEN a user adds a new goat, THE Application SHALL store goat_code, name, breed, age, weight, gender, status, and photo_url
2. THE Application SHALL enforce unique goat_code values across all goat records
3. WHEN a user views goats, THE Application SHALL display all active goat records
4. WHEN a user updates a goat, THE Application SHALL modify the specified fields and preserve the goat_code
5. WHEN a user deletes a goat, THE Application SHALL perform a Soft_Delete

### Requirement 8: Feeding Management

**User Story:** As a farm manager, I want to track feeding records, so that I can monitor nutrition and feeding schedules.

#### Acceptance Criteria

1. WHEN a user records feeding, THE Application SHALL store goat_id, food_type, quantity, feeding_date, and notes
2. THE Application SHALL validate that goat_id references an existing active goat
3. WHEN a user views feeding records, THE Application SHALL display all active feeding records
4. THE Application SHALL store feeding_date in ISO_8601 date format (YYYY-MM-DD)

### Requirement 9: Health Management

**User Story:** As a farm manager, I want to track health and vaccination records, so that I can maintain animal health and schedule vaccinations.

#### Acceptance Criteria

1. WHEN a user records health information, THE Application SHALL store goat_id, issue, medicine, vaccination_date, next_due_date, and notes
2. THE Application SHALL validate that goat_id references an existing active goat
3. WHEN a user queries overdue vaccinations, THE Application SHALL return records where next_due_date is today or earlier
4. THE Application SHALL validate that next_due_date is greater than or equal to vaccination_date
5. THE Application SHALL store vaccination_date and next_due_date in ISO_8601 date format

### Requirement 10: Expense Management

**User Story:** As a farm manager, I want to track farm expenses, so that I can monitor costs and maintain financial records.

#### Acceptance Criteria

1. WHEN a user records an expense, THE Application SHALL store expense_type, amount, date, and notes
2. THE Application SHALL validate that amount is a positive number
3. WHEN a user views expenses, THE Application SHALL display all active expense records
4. THE Application SHALL store expense date in ISO_8601 date format

### Requirement 11: Sales Management

**User Story:** As a farm manager, I want to track goat sales, so that I can record revenue and buyer information.

#### Acceptance Criteria

1. WHEN a user records a sale, THE Application SHALL store goat_id, price, buyer_name, date, and notes
2. THE Application SHALL validate that goat_id references an existing active goat
3. THE Application SHALL validate that price is a positive number
4. WHEN a user views sales, THE Application SHALL display all active sales records
5. THE Application SHALL store sale date in ISO_8601 date format

### Requirement 12: User Authentication

**User Story:** As a system administrator, I want to manage user accounts, so that I can control access to the application.

#### Acceptance Criteria

1. WHEN a user account is created, THE Application SHALL store username and password
2. THE Application SHALL enforce unique username values across all user records
3. WHEN a user views user accounts, THE Application SHALL display all active user records
4. THE Application SHALL validate that username and password are non-empty

### Requirement 13: Error Handling and Recovery

**User Story:** As a user, I want the application to handle errors gracefully, so that I receive clear feedback when operations fail.

#### Acceptance Criteria

1. WHEN a database connection fails, THE Application SHALL log the error and display a user-friendly message
2. WHEN a query fails, THE Application SHALL roll back the transaction to maintain data integrity
3. WHEN a constraint violation occurs, THE Application SHALL display a descriptive error message
4. IF the database file is corrupted, THEN THE Application SHALL log the error and suggest recovery steps
5. WHEN an error occurs, THE Application SHALL not expose sensitive system information to users

### Requirement 14: Data Integrity

**User Story:** As a developer, I want the database to enforce data integrity constraints, so that invalid data cannot be stored.

#### Acceptance Criteria

1. THE Schema SHALL enforce primary key uniqueness for all tables
2. THE Schema SHALL enforce unique constraints on goat_code and username fields
3. WHEN a transaction fails, THE Database_Layer SHALL roll back all changes
4. WHEN a transaction succeeds, THE Database_Layer SHALL commit all changes atomically
5. THE Application SHALL validate data types and ranges before inserting or updating records

### Requirement 15: Backward Compatibility

**User Story:** As a developer, I want the migration to maintain API compatibility, so that existing frontend code continues to work without modifications.

#### Acceptance Criteria

1. THE Model_Layer SHALL maintain identical function signatures after migration
2. THE Model_Layer SHALL return data in the same format (list of dictionaries) as before migration
3. THE Application SHALL support all existing API endpoints without changes
4. THE Application SHALL preserve all existing data fields and their meanings
5. WHEN queries execute, THE Application SHALL return results with the same structure as MySQL implementation

### Requirement 16: Performance

**User Story:** As a user, I want the application to respond quickly to my requests, so that I can work efficiently.

#### Acceptance Criteria

1. WHEN a user queries data, THE Application SHALL return results within 1 second for datasets under 10,000 records
2. WHEN a user inserts or updates a record, THE Application SHALL complete the operation within 500 milliseconds
3. THE SQLite_Database SHALL handle concurrent read operations without blocking
4. THE Application SHALL maintain acceptable performance with database files up to 100MB

### Requirement 17: Configuration Management

**User Story:** As a developer, I want centralized configuration, so that I can easily modify application settings.

#### Acceptance Criteria

1. THE Application SHALL define the database file path in a central configuration module
2. WHEN running as a PyInstaller_Executable, THE Application SHALL automatically detect the executable directory
3. THE Application SHALL use the executable directory as the default location for the SQLite_Database file
4. THE Application SHALL allow configuration of upload folder location
5. THE Application SHALL provide configuration for debug mode and port settings

### Requirement 18: Date and Time Handling

**User Story:** As a developer, I want consistent date and time handling, so that temporal data is stored and queried correctly.

#### Acceptance Criteria

1. THE Application SHALL store all dates in ISO_8601 format (YYYY-MM-DD)
2. THE Application SHALL store all timestamps in ISO_8601 format (YYYY-MM-DD HH:MM:SS)
3. WHEN comparing dates, THE Application SHALL use SQLite's date() function for accurate comparisons
4. WHEN creating records, THE Application SHALL automatically set created_on to the current timestamp
5. WHEN updating records, THE Application SHALL automatically set updated_on to the current timestamp

### Requirement 19: Transaction Management

**User Story:** As a developer, I want proper transaction management, so that data remains consistent even when errors occur.

#### Acceptance Criteria

1. WHEN a write operation begins, THE Database_Layer SHALL start a transaction
2. WHEN a write operation succeeds, THE Database_Layer SHALL commit the transaction
3. WHEN a write operation fails, THE Database_Layer SHALL roll back the transaction
4. THE Database_Layer SHALL ensure that partial updates never persist to the database
5. WHEN multiple operations are part of a logical unit, THE Application SHALL execute them within a single transaction

### Requirement 20: Resource Management

**User Story:** As a developer, I want proper resource cleanup, so that the application doesn't leak database connections or file handles.

#### Acceptance Criteria

1. WHEN a database operation completes, THE Database_Layer SHALL close the cursor
2. WHEN a database operation completes, THE Database_Layer SHALL close the connection
3. WHEN an exception occurs during a database operation, THE Database_Layer SHALL still close the cursor and connection
4. THE Application SHALL not maintain persistent database connections between requests
5. THE Application SHALL release all file handles when operations complete
