declare module "helixia.db" {
  export class Database {
    /**
     * @param {string} [file='database.json'] - Path to the JSON file.
     */
    constructor(file?: string);

    /**
     * Create a backup of the database file.
     * @param {string} [backupPath] - Path to save the backup file. Defaults to `<original-file>.bak`.
     */
    public createBackup(backupPath?: string): void;

    /**
     * Restore the database from a backup file.
     * @param {string} backupPath - Path to the backup file.
     * @throws {Error} If the backup file does not exist.
     */
    public restoreBackup(backupPath: string): void;

    /**
     * Add or update data in the database.
     * @param {string} key - The key for the data.
     * @param {*} value - The value to be stored. Cannot be null or undefined.
     * @throws {Error} If the value is null or undefined.
     */
    public set(key: string, value: any): void;

    /**
     * Retrieve data from the database.
     * @param {string} key - The key for the data.
     * @returns {*} The value associated with the key, or null if the key does not exist.
     */
    public get(key: string): any;

    /**
     * Remove a key from the database.
     * @param {string} key - The key to be removed from the database.
     */
    public remove(key: string): void;

    /**
     * Delete a value from an array in the database.
     * @param {string} key - The key for the array.
     * @param {*} value - The value to be deleted from the array.
     * @throws {Error} If the key is not an array.
     */
    public delete(key: string, value: any): void;

    /**
     * Delete a key from an object in the database.
     * @param {string} key - The key for the object.
     * @param {string} subKey - The key to be deleted from the object.
     * @throws {Error} If the key is not an object.
     */
    public deleteKey(key: string, subKey: string): void;

    /**
     * Remove all entries matching a value from the database.
     * @param {*} value - The value to be removed from all keys.
     */
    public deleteEach(value: any): void;

    /**
     * Check if a key exists in the database.
     * @param {string} key - The key to check for existence.
     * @returns {boolean} True if the key exists, otherwise false.
     */
    public has(key: string): boolean;

    /**
     * Fetch data from the database (same as get).
     * @param {string} key - The key for the data.
     * @returns {*} The value associated with the key, or null if the key does not exist.
     */
    public fetch(key: string): any;

    /**
     * Retrieve all data from the database.
     * @returns {Object} All data in the database.
     */
    public all(): Record<string, any>;

    /**
     * Clear all data in the database.
     */
    public clear(): void;

    /**
     * Delete the JSON file from the filesystem.
     */
    public destroy(): void;

    /**
     * Fetch a value from an object in the database.
     * @param {string} key - The key for the object.
     * @param {string} subKey - The key to fetch from the object.
     * @returns {*} The value associated with the subKey, or null if the subKey does not exist.
     * @throws {Error} If the key is not an object.
     */
    public fetchObject(key: string, subKey: string): any;

    /**
     * Fetch a value from an array in the database by index.
     * @param {string} key - The key for the array.
     * @param {number} index - The index of the value in the array.
     * @returns {*} The value at the specified index, or null if the index is out of bounds.
     * @throws {Error} If the key is not an array.
     */
    public fetchArray(key: string, index: number): any;

    /**
     * Perform a mathematical operation on a numeric value in the database.
     * @param {string} key - The key for the numeric value.
     * @param {string} operator - The operator to use ('+', '-', '*', '/').
     * @param {number} value - The value to be used in the operation.
     * @returns {number} The result of the operation.
     * @throws {Error} If the key is not a number or an invalid operator is provided.
     */
    public math(key: string, operator: '+' | '-' | '*' | '/', value: number): number;
  }
}
