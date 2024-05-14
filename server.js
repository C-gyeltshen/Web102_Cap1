const http = require('http');
const { writeFileSync, readFileSync } = require('fs');

let nextId = 0;

// Read the last ID from the file if it exists
try {
    const storeFile = readFileSync('./localDB.json');
    const jsonData = JSON.parse(storeFile);
    const lastEntry = jsonData.row_contents[jsonData.row_contents.length - 1];
    if (lastEntry) {
        nextId = lastEntry.id + 1;
    }
} catch (error) {
    console.error('Error reading file or parsing JSON:', error);
}

// Creating a local server to receive data from
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url == '/resource') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const data = JSON.parse(body);
            const storeFile = readFileSync('./localDB.json');
            const jsonData = JSON.parse(storeFile);
            
            // Assigning a unique ID to the data
            const newData = {
                id: nextId++,
                data
            };

            jsonData.row_contents.push(newData);
            writeFileSync('./localDB.json', JSON.stringify(jsonData));
            res.end('ok');
        });
    } else if (req.method === 'GET' && req.url === '/record') {
        try {
            const storeFile = readFileSync('./localDB.json', 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(storeFile);
        } catch (error) {
            console.error('Error reading database:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error.' }));
        }
    } else if (req.method === 'GET' && req.url.startsWith('/resource/')) {
        const id = parseInt(req.url.substring(('/resource/').length));
        
        try {
            const storeFile = readFileSync('./localDB.json', 'utf8');
            const jsonData = JSON.parse(storeFile);
            
            const resource = jsonData.row_contents.find(entry => entry.id === id);

            if (resource) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(resource));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Resource not found.' }));
            }
        } catch (error) {
            console.error('Error retrieving resource:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error.' }));
        }
    } else if (req.method === 'PATCH' && req.url.startsWith('/resource/')) {
        const id = parseInt(req.url.substring(('/resource/').length));
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const storeFile = readFileSync('./localDB.json', 'utf8');
                const jsonData = JSON.parse(storeFile);
                
                const index = jsonData.row_contents.findIndex(entry => entry.id === id);

                if (index!== -1) {
                    // Partially update the existing resource with new data
                    const newData = JSON.parse(body);
                    Object.assign(jsonData.row_contents[index].data, newData);
                    writeFileSync('./localDB.json', JSON.stringify(jsonData));
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Resource updated successfully.' }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Resource not found.' }));
                }
            } catch (error) {
                console.error('Error updating resource:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error.' }));
            }
        });
    } else if (req.method === 'DELETE' && req.url.startsWith('/resource/')) {
        const id = parseInt(req.url.substring(('/resource/').length));

        try {
            const storeFile = readFileSync('./localDB.json', 'utf8');
            const jsonData = JSON.parse(storeFile);
            
            const index = jsonData.row_contents.findIndex(entry => entry.id === id);

            if (index!== -1) {
                
                // Remove the resource from the data
                jsonData.row_contents.splice(index, 1);
                writeFileSync('./localDB.json', JSON.stringify(jsonData));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Resource deleted successfully.' }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Resource not found.' }));
            }
        } catch (error) {
            console.error('Error deleting resource:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error.' }));
        }
    } else if (req.method === 'PUT' && req.url.startsWith('/resource/')) {
        const id = parseInt(req.url.substring(('/resource/').length));
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const storeFile = readFileSync('./localDB.json', 'utf8');
                const jsonData = JSON.parse(storeFile);
                
                const index = jsonData.row_contents.findIndex(entry => entry.id === id);

                if (index!== -1) {

                    // Update the existing record with new data
                    jsonData.row_contents[index].data = JSON.parse(body);
                    writeFileSync('./localDB.json', JSON.stringify(jsonData));
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Record updated successfully.' }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Record not found.' }));
                }
            } catch (error) {
                console.error('Error updating record:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error.' }));
            }
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            data: 'Hello Chimi is listening, GO ON',
        }));
    }
});

server.listen(8000);
