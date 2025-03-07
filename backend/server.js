const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, "students.json");

app.use(cors());
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Fetch all students
app.get("/students", (req, res) => {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error reading file" });
        }
        res.json(JSON.parse(data));
    });
});

// Add a new student
app.post("/students", (req, res) => {
    const newStudent = req.body;

    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        let students = [];

        if (!err && data) {
            students = JSON.parse(data);
        }

        students.push(newStudent);
        fs.writeFile(DATA_FILE, JSON.stringify(students, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Error writing file" });
            }
            res.json({ message: "Student added successfully", student: newStudent });
        });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
