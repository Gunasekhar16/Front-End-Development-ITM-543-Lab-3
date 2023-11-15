const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(fileUpload());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const file = req.files.file;
    const filePath = path.join(__dirname, 'uploads', file.name);

    // Check if file already exists
    if (fs.existsSync(filePath)) {
        const override = req.body.override === 'true';

        if (!override) {
            return res.status(400).send('File already exists. Choose a different name or enable override.');
        }
    }

    // Save the file
    file.mv(filePath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.send('File uploaded!');
    });
});

app.get('/files', (req, res) => {
    const files = fs.readdirSync(path.join(__dirname, 'uploads'));
    res.json(files);
});

app.delete('/files/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, 'uploads', fileName);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.send('File deleted!');
    } else {
        res.status(404).send('File not found.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
