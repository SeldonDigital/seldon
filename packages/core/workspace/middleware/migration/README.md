### Migration Best Practices

1. **Always increment the version**: When making breaking changes to the workspace schema, increment `CURRENT_WORKSPACE_VERSION`

2. **Write descriptive migrations**: Include descriptions of what each migration does

3. **Test migrations**: Test your migrations with sample workspaces from previous versions

4. **Write a test**: Add a test file in the migration-tests folder for each migration

5. **Keep migrations simple**: Each migration should do one thing well

6. **Handle errors gracefully**: Use try-catch blocks in migrations

7. **Don't modify existing migrations**: Once a migration is deployed, don't change it. Create a new migration instead

### Example Migrations

See `example.ts` for practical examples of common migration patterns:

- Adding new fields to nodes
- Renaming properties
- Adding new board properties
- Data transformations

### Migration Flow

1. When a `set_workspace` action is dispatched, the migration middleware checks the workspace version
2. If the workspace version is less than `CURRENT_WORKSPACE_VERSION`, it applies all required migrations in sequence
3. Each migration updates the workspace and sets the version to its own version number
4. After all migrations are applied, the final version is set to `CURRENT_WORKSPACE_VERSION`
5. The migrated workspace is passed to the next middleware/reducer

### Error Handling

If a migration fails:

- The error is logged with the migration version and description
- An error is thrown
- The migration process stops
- The original workspace is not modified

This ensures that failed migrations don't corrupt workspace data.

## Usage as Source of Truth

This README serves as the authoritative documentation for the Migration System. When making changes to the migration functionality:

1. **Update this README first** to reflect the intended migration behavior and processing workflow
2. **Implement changes** to match the documented specifications and migration patterns
3. **Update migration tests** to verify the documented behavior
4. **Validate that the migration pipeline** follows the documented workflow from version checking through data transformation
5. **Ensure migration safety** maintains the documented error handling and rollback mechanisms

The migration system is designed to be:
- **Safe**: Failed migrations don't corrupt workspace data
- **Sequential**: Migrations are applied in the documented order
- **Versioned**: Each migration has a specific version number
- **Descriptive**: Each migration includes clear descriptions of what it does
- **Testable**: All migrations have corresponding tests
- **Rollback-Safe**: Maintains data integrity during migration
- **Selective**: Only runs on `set_workspace` actions for performance

### Migration Development Workflow

When creating or modifying migrations:

1. **Increment Version**: Always increment `CURRENT_WORKSPACE_VERSION` for breaking changes
2. **Write Migration**: Create migration with descriptive comments and error handling
3. **Add Tests**: Create test files in the migration-tests folder
4. **Test Migration**: Test with sample workspaces from previous versions
5. **Update Documentation**: Keep this README current with migration changes

### Migration Validation

All migrations must validate against documented patterns:
- **Version Management**: Must follow documented version incrementing strategy
- **Error Handling**: Must implement documented try-catch patterns
- **Data Integrity**: Must maintain documented rollback safety
- **Performance**: Must follow documented selective application patterns

This ensures consistency across the entire migration system and maintains the reliability of workspace data integrity.

For detailed implementation information, see the specific subsystem documentation:
- [Middleware README](../README.md) - Middleware pipeline and processing
- [Core Workspace README](../../README.md) - Workspace state management and structure
- [Core README](../../../README.md) - Core engine and system integration
