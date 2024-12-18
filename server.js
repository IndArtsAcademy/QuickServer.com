const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Path to the JSON file
const DATA_FILE = './students.json';

// Helper function to read the student data
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
};

// Helper function to save student data
const saveData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// Routes

// 1. Add a new student
app.post('/students', (req, res) => {
    const students = readData();
    const newStudent = { id: Date.now(), ...req.body };
    students.push(newStudent);
    saveData(students);
    res.status(201).json({ message: 'Student added successfully', student: newStudent });
});

// 2. Get all students
app.get('/students', (req, res) => {
    const students = readData();
    res.json(students);
});

// 3. Get a student by ID
app.get('/students/:id', (req, res) => {
    const students = readData();
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
});

// 4. Update a student by ID
app.put('/students/:id', (req, res) => {
    const students = readData();
    const studentIndex = students.findIndex(s => s.id === parseInt(req.params.id));
    if (studentIndex === -1) return res.status(404).json({ message: 'Student not found' });
    students[studentIndex] = { ...students[studentIndex], ...req.body };
    saveData(students);
    res.json({ message: 'Student updated successfully', student: students[studentIndex] });
});

// 5. Delete a student by ID
app.delete('/students/:id', (req, res) => {
    const students = readData();
    const updatedStudents = students.filter(s => s.id !== parseInt(req.params.id));
    if (students.length === updatedStudents.length) return res.status(404).json({ message: 'Student not found' });
    saveData(updatedStudents);
    res.json({ message: 'Student deleted successfully' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
