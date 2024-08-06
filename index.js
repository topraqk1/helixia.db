const fs = require('fs');
const errors = require('./Error.js');

class HelixiaDB {
  constructor(filePath = 'database.json') {
    this.filePath = filePath;
    this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(data);
      } else {
        this.data = {};
        this.saveData();
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw errors.INVALID_JSON;
      }
      throw error;
    }
  }
  
  saveData() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  /**
   * Create a backup of the database file.
   * @param {string} [backupPath] - Path to save the backup file. Defaults to `<original-file>.bak`.
   */
  createBackup(backupPath) {
    if (!backupPath) {
      backupPath = `${this.filePath}.bak`;
    }
    fs.copyFileSync(this.filePath, backupPath);
  }

  /**
   * Restore the database from a backup file.
   * @param {string} backupPath - Path to the backup file.
   * @throws {DatabaseError} If the backup file does not exist or is invalid.
   */
  restoreBackup(backupPath) {
    if (!fs.existsSync(backupPath)) {
      throw new DatabaseError('Backup file not found.');
    }
    fs.copyFileSync(backupPath, this.filePath);
    this.loadData();
  }

  /**
   * Add or update data in the database.
   * @param {string} key - The key for the data.
   * @param {*} value - The value to be stored. Cannot be null or undefined.
   * @throws {DatabaseError} If the value is null or undefined.
   */
  set(key, value) {
    if (value === null || value === undefined) {
      throw errors.INVALID_VALUE;
    }
    this.data[key] = value;
    this.saveData();
  }

  /**
   * Retrieve data from the database.
   * @param {string} key - The key for the data.
   * @returns {*} The value associated with the key, or null if the key does not exist.
   */
  get(key) {
    return this.data[key] || null;
  }

  /**
   * Remove a key from the database.
   * @param {string} key - The key to be removed from the database.
   */
  remove(key) {
    delete this.data[key];
    this.saveData();
  }

  /**
   * Delete a value from an array in the database.
   * @param {string} key - The key for the array.
   * @param {*} value - The value to be deleted from the array.
   */
  delete(key, value) {
    if (!Array.isArray(this.data[key])) {
      throw errors.ARRAY_NOT_FOUND;
    }
    this.data[key] = this.data[key].filter(item => item !== value);
    this.saveData();
  }

  /**
   * Delete a key from an object in the database.
   * @param {string} key - The key for the object.
   * @param {string} subKey - The key to be deleted from the object.
   * @throws {DatabaseError} If the key is not an object.
   */
  deleteKey(key, subKey) {
    if (typeof this.data[key] !== 'object' || this.data[key] === null) {
      throw errors.OBJECT_NOT_FOUND;
    }
    delete this.data[key][subKey];
    this.saveData();
  }

  /**
   * Remove all entries matching a value from the database.
   * @param {*} value - The value to be removed from all keys.
   */
  deleteEach(value) {
    Object.keys(this.data).forEach(key => {
      if (Array.isArray(this.data[key])) {
        this.data[key] = this.data[key].filter(item => item !== value);
      } else if (this.data[key] === value) {
        delete this.data[key];
      }
    });
    this.saveData();
  }

  /**
   * Check if a key exists in the database.
   * @param {string} key - The key to check for existence.
   * @returns {boolean} True if the key exists, otherwise false.
   */
  has(key) {
    return key in this.data;
  }

  /**
   * Fetch data from the database (same as get).
   * @param {string} key - The key for the data.
   * @returns {*} The value associated with the key, or null if the key does not exist.
   */
  fetch(key) {
    return this.get(key);
  }

  /**
   * Retrieve all data from the database.
   * @returns {Object} All data in the database.
   */
  all() {
    return this.data;
  }

  /**
   * Clear all data in the database.
   */
  clear() {
    this.data = {};
    this.saveData();
  }

  /**
   * Delete the JSON file from the filesystem.
   */
  destroy() {
    fs.unlinkSync(this.filePath);
  }

  /**
   * Fetch a value from an object in the database.
   * @param {string} key - The key for the object.
   * @param {string} subKey - The key to fetch from the object.
   * @returns {*} The value associated with the subKey, or null if the subKey does not exist.
   * @throws {DatabaseError} If the key is not an object.
   */
  fetchObject(key, subKey) {
    if (typeof this.data[key] !== 'object' || this.data[key] === null) {
      throw errors.OBJECT_NOT_FOUND;
    }
    return this.data[key][subKey] || null;
  }

  /**
   * Fetch a value from an array in the database by index.
   * @param {string} key - The key for the array.
   * @param {number} index - The index of the value in the array.
   * @returns {*} The value at the specified index, or null if the index is out of bounds.
   * @throws {DatabaseError} If the key is not an array.
   */
  fetchArray(key, index) {
    if (!Array.isArray(this.data[key])) {
      throw errors.ARRAY_NOT_FOUND;
    }
    return this.data[key][index] || null;
  }

  /**
   * Perform a mathematical operation on a numeric value in the database.
   * @param {string} key - The key for the numeric value.
   * @param {string} operator - The operator to use ('+', '-', '*', '/').
   * @param {number} value - The value to be used in the operation.
   * @returns {number} The result of the operation.
   * @throws {DatabaseError} If the key is not a number or an invalid operator is provided.
   */
  math(key, operator, value) {
    if (typeof this.data[key] !== 'number') {
      throw new DatabaseError('The value associated with the key is not a number.');
    }
    if (!['+', '-', '*', '/'].includes(operator)) {
      throw new DatabaseError('Invalid operator.');
    }
    switch (operator) {
      case '+':
        this.data[key] += value;
        break;
      case '-':
        this.data[key] -= value;
        break;
      case '*':
        this.data[key] *= value;
        break;
      case '/':
        this.data[key] /= value;
        break;
    }
    this.saveData();
    return this.data[key];
  }
}

module.exports = { HelixiaDB };
