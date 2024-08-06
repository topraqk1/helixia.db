# **🔹 helixia.db 1.0.0**

HelixiaDB 0 here with new features to make managing your JSON-based database easier and more efficient!

## **🔧 What does it do?**

HelixiaDB provides a simple and high-performance solution for managing JSON files as databases. It’s designed to be user-friendly and effective for various data management tasks.

## 🚀 Getting Started

* Install the package with npm:

```bash
npm install helixia.db
```

* Initialize your database:

```javascript
const { HelixiaDB } = require('helixia.db');
const db = new HelixiaDB(/* file.json */);

// If no file is specified, HelixiaDB will create a 'database.json' file by default.
```

## ✨ Example Usage

Here are some examples to get you started:

```javascript
const { HelixiaDB } = require('helixia.db');
const db = new HelixiaDB(/* file.json */);

// Set / Push Functions Examples

const object1 = { key: true, key2: "true" };
db.set('Object', object1); // Object: { key: true, key2: "true" }

const array1 = ['element', 'element2'];
db.set('Array', array1); // Array: ['element', 'element2']

db.push('Array', 'element3'); // Array: ['element', 'element2', 'element3']

// Object & Array Fetch

db.fetchObject('Object', 'key'); // key: true

db.fetchArray('Array', 1); // element2

// Fetch / Get Functions

db.fetch('data'); // Fetches the value of 'data'

db.get('data'); // Same as fetch(), retrieves the value of 'data'

db.all(); // Fetches all data in the database

// Remove / Delete Functions

db.remove('data'); // Removes 'data' from the database

db.delete('Array', 'element3'); // Array: ['element', 'element2']

db.deleteKey('Object', 'key'); // Object: { key2: "true" }

db.deleteEach('data'); // Deletes all occurrences of 'data'

// Clear / Destroy Functions

db.clear(); // Clears all data from the database

db.destroy(); // Deletes the database file and clears all data

// Boolean Functions

db.has('data'); // Returns true if 'data' exists, otherwise false

// Math Functions

db.math('counter', '+', 5); // Adds 5 to 'counter'

db.math('counter', '-', 3); // Subtracts 3 from 'counter'
```

## 🔢 Math Function

Perform mathematical operations on numeric values:

```javascript
const { HelixiaDB } = require('helixia.db');
const db = new HelixiaDB(/* file.json */);

db.set('counter', 15);

// Math Operation

const newCounter = db.math('counter', '-', 10); // Result: 5

db.set('counter', newCounter); // Updates 'counter' to 5
```

## 📂 Multiple Files

Manage multiple files with ease:

```javascript
const { HelixiaDB } = require('helixia.db');

const botDB = new HelixiaDB('bot-config.json');
const serverDB = new HelixiaDB('servers-config.json');
const userDB = new HelixiaDB('users.json');

serverDB.push('servers', '800060636041314375'); // servers-config.json

botDB.set('prefix', '#'); // bot-config.json

userDB.set('whitelist_747430301654974546', true); // users.json
```

## 💾 Data Backup

Backup and restore your data effortlessly:

* Set a backup file:

```javascript
const { HelixiaDB } = require('helixia.db');
const db = new HelixiaDB();

db.createBackup('backup.json'); // Creates a backup file 'backup.json'
```

* Load from a backup:

```javascript
const { HelixiaDB } = require('helixia.db');
const db = new HelixiaDB();

db.restoreBackup('backup.json'); // Restores data from 'backup.json'
```
