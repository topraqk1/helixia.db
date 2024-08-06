const fs = require('fs');
const color = require('color-console.js');
const errors = require('./Error.js');

class HelixiaDB {
  constructor(filePath = 'database.json') {
    this.filePath = filePath;
  }
  
  loadData() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(data);
      } else {
        this.saveData({});
        return {};
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error(color.red(errors.INVALID_JSON.message));
      } else {
        console.error(color.red(error.message));
      }
      return {};
    }
  }

  saveData(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error(color.red(`Failed to save data: ${error.message}`));
    }
  }

  /**
   * Creates a backup of the database file.
   * @param {string} [backupPath] - Path to save the backup file. Defaults to `<original-file>.bak`.
   */
  createBackup(backupPath) {
    try {
      if (!backupPath) {
        backupPath = `${this.filePath}.bak`;
      }
      fs.copyFileSync(this.filePath, backupPath);
    } catch (error) {
      console.error(color.red(`Failed to create backup: ${error.message}`));
    }
  }

  /**
   * Restores the database from a backup file.
   * @param {string} backupPath - Path to the backup file.
   * @throws {Error} If the backup file does not exist.
   */
  restoreBackup(backupPath) {
    try {
      if (!fs.existsSync(backupPath)) {
        throw new Error('Backup file not found.');
      }
      fs.copyFileSync(backupPath, this.filePath);
      this.loadData();
    } catch (error) {
      console.error(color.red(`Failed to restore backup: ${error.message}`));
    }
  }

  /**
   * Adds or updates data in the database.
   * @param {string} key - The key for the data.
   * @param {*} value - The value to be stored. Cannot be null or undefined.
   * @throws {DatabaseError} If the value is null or undefined.
   */
  set(key, value) {
    try {
      if (value === null || value === undefined) {
        throw errors.INVALID_VALUE;
      }
      const data = this.loadData();
      data[key] = value;
      this.saveData(data);
    } catch (error) {
      console.error(color.red(error.message));
    }
  }

  /**
   * Retrieves data from the database.
   * @param {string} key - The key for the data.
   * @returns {*} The value associated with the key, or null if the key does not exist.
   */
  get(key) {
    try {
      const data = this.loadData();
      return data[key] || null;
    } catch (error) {
      console.error(color.red(`Failed to retrieve data: ${error.message}`));
      return null;
    }
  }

  /**
   * Removes a key from the database.
   * @param {string} key - The key to be removed from the database.
   */
  remove(key) {
    try {
      const data = this.loadData();
      delete data[key];
      this.saveData(data);
    } catch (error) {
      console.error(color.red(`Failed to remove key: ${error.message}`));
    }
  }

  /**
   * Deletes a value from an array in the database.
   * @param {string} key - The key for the array.
   * @param {*} value - The value to be deleted from the array.
   * @throws {DatabaseError} If the key is not an array.
   */
  delete(key, value) {
    try {
      const data = this.loadData();
      if (!Array.isArray(data[key])) {
        throw errors.ARRAY_NOT_FOUND;
      }
      data[key] = data[key].filter(item => item !== value);
      this.saveData(data);
    } catch (error) {
      console.error(color.red(error.message));
    }
  }

  /**
   * Deletes a key from an object in the database.
   * @param {string} key - The key for the object.
   * @param {string} subKey - The key to be deleted from the object.
   * @throws {DatabaseError} If the key is not an object.
   */
  deleteKey(key, subKey) {
    try {
      const data = this.loadData();
      if (typeof data[key] !== 'object' || data[key] === null) {
        throw errors.OBJECT_NOT_FOUND;
      }
      delete data[key][subKey];
      this.saveData(data);
    } catch (error) {
      console.error(color.red(error.message));
    }
  }

  /**
   * Removes all entries matching a value from the database.
   * @param {*} value - The value to be removed from all keys.
   */
  deleteEach(value) {
    try {
      const data = this.loadData();
      Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
          data[key] = data[key].filter(item => item !== value);
        } else if (data[key] === value) {
          delete data[key];
        }
      });
      this.saveData(data);
    } catch (error) {
      console.error(color.red(`Failed to delete each: ${error.message}`));
    }
  }

  /**
   * Checks if a key exists in the database.
   * @param {string} key - The key to check for existence.
   * @returns {boolean} True if the key exists, otherwise false.
   */
  has(key) {
    try {
      const data = this.loadData();
      return key in data;
    } catch (error) {
      console.error(color.red(`Failed to check key existence: ${error.message}`));
      return false;
    }
  }

  /**
   * Fetches data from the database (same as get).
   * @param {string} key - The key for the data.
   * @returns {*} The value associated with the key, or null if the key does not exist.
   */
  fetch(key) {
    return this.get(key);
  }

  /**
   * Retrieves all data from the database.
   * @returns {Object} All data in the database.
   */
  all() {
    try {
      return this.loadData();
    } catch (error) {
      console.error(color.red(`Failed to retrieve all data: ${error.message}`));
      return {};
    }
  }

  /**
   * Clears all data in the database.
   */
  clear() {
    try {
      this.saveData({});
    } catch (error) {
      console.error(color.red(`Failed to clear data: ${error.message}`));
    }
  }

  /**
   * Deletes the JSON file from the filesystem.
   */
  destroy() {
    try {
      fs.unlinkSync(this.filePath);
    } catch (error) {
      console.error(color.red(`Failed to destroy file: ${error.message}`));
    }
  }

  /**
   * Fetches a value from an object in the database.
   * @param {string} key - The key for the object.
   * @param {string} subKey - The key to fetch from the object.
   * @returns {*} The value associated with the subKey, or null if the subKey does not exist.
   * @throws {DatabaseError} If the key is not an object.
   */
  fetchObject(key, subKey) {
    try {
      const data = this.loadData();
      if (typeof data[key] !== 'object' || data[key] === null) {
        throw errors.OBJECT_NOT_FOUND;
      }
      return data[key][subKey] || null;
    } catch (error) {
      console.error(color.red(error.message));
      return null;
    }
  }

  /**
   * Fetches a value from an array in the database by index.
   * @param {string} key - The key for the array.
   * @param {number} index - The index of the value in the array.
   * @returns {*} The value at the specified index, or null if the index is out of bounds.
   * @throws {DatabaseError} If the key is not an array.
   */
  fetchArray(key, index) {
    try {
      const data = this.loadData();
      if (!Array.isArray(data[key])) {
        throw errors.ARRAY_NOT_FOUND;
      }
      return data[key][index] || null;
    } catch (error) {
      console.error(color.red(error.message));
      return null;
    }
  }

/**
 * Performs a mathematical operation on a numeric value in the database.
 * @param {string} key - The key for the numeric value.
 * @param {string} operator - The operator to use ('+', '-', '*', '/').
 * @param {number} value - The value to be used in the operation.
 * @returns {number} The result of the operation.
 * @throws {DatabaseError} If the key is not a number or an invalid operator is provided.
 */
math(key, operator, value) {
  try {
    const data = this.loadData();
    if (typeof data[key] !== 'number') {
      throw new DatabaseError('The value associated with the key is not a number.');
    }
    if (!['+', '-', '*', '/'].includes(operator)) {
      throw new DatabaseError('Invalid operator.');
    }
    switch (operator) {
      case '+':
        data[key] += value;
        break;
      case '-':
        data[key] -= value;
        break;
      case '*':
        data[key] *= value;
        break;
      case '/':
        if (value === 0) {
          throw new DatabaseError('Division by zero is not allowed.');
        }
        data[key] /= value;
        break;
    }
    this.saveData(data);
    return data[key];
  } catch (error) {
    console.error(color.red(error.message));
    return null;
  }
}
