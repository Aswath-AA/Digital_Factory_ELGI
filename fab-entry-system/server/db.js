const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",  // Change this if needed
    password: "Gogreen#2004",  // Change this to your MySQL Workbench password
    database: "fab_entry"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to MySQL database.");
});

module.exports = db;
