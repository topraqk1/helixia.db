class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = "DatabaseError";
  }
}

module.exports = {
  FILE_NOT_FOUND: new DatabaseError("The database file could not be found."),
  INVALID_JSON: new DatabaseError("The database file contains invalid JSON."),
  INVALID_VALUE: new DatabaseError("The value provided cannot be null or undefined."),
  KEY_NOT_FOUND: new DatabaseError("The requested key does not exist in the database."),
  OBJECT_NOT_FOUND: new DatabaseError("The requested key is not an object."),
  ARRAY_NOT_FOUND: new DatabaseError("The requested key is not an array."),
};
