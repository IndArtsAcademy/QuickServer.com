const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Handle form submissions
app.post('/submit-admission', (req, res) => {
    const formData = req.body;

    // Simple validation
    if (!formData.name || !formData['guardian-name'] || !formData['guardian-phone'] || !formData.dob) {
        return res.status(400).send({ message: 'All required fields must be filled.' });
    }

    // Save data to a file (can be replaced with database logic)
    const dataPath = path.join(__dirname, 'data', 'admissions.json');
    const admissionData = JSON.parse(fs.readFileSync(dataPath, 'utf8') || '[]');
    admissionData.push(formData);

    fs.writeFileSync(dataPath, JSON.stringify(admissionData, null, 2));

    console.log('Admission Data Saved:', formData);
    res.status(200).send({ message: 'Admission form submitted successfully!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
