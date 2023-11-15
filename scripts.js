document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');
    const fileList = document.getElementById('fileList');

    // Fetch and display the list of files
    fetch('/files')
        .then(response => response.json())
        .then(files => {
            files.forEach(file => {
                const li = document.createElement('li');
                li.innerHTML = `${file} <button onclick="deleteFile('${file}')">Delete</button>`;
                fileList.appendChild(li);
            });
        });

    // Handle file upload
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(uploadForm);
        const override = uploadForm.elements.override.checked;

        fetch('/upload', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        })
        .then(response => response.text())
        .then(message => {
            alert(message);
            location.reload();
        });
    });
});

// Function to delete a file
function deleteFile(fileName) {
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
        fetch(`/files/${fileName}`, { method: 'DELETE' })
            .then(response => response.text())
            .then(message => {
                alert(message);
                location.reload();
            });
    }
}
