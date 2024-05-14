This repository contains a simple Node.js server that provides CRUD (Create, Read, Update, Delete) operations for a resource stored locally. The server listens on port 8000 by default.

### Usage

1. **Clone the Repository:**

    git clone https://github.com/C-gyeltshen/Web102_cap1.git

2. **Start the Server:**

    node server.js

### Endpoints

- **POST /resource**: Create a new resource.
- **GET /record**: Retrieve all records.
- **GET /resource/{id}**: Retrieve a specific resource by ID.
- **PATCH /resource/{id}**: Partially update a resource by ID.
- **DELETE /resource/{id}**: Delete a resource by ID.
- **PUT /resource/{id}**: Update a resource by ID.

### How it Works

- The server utilizes Node.js's built-in `http` module to create a local server.
- Data is stored locally in a JSON file named `localDB.json`.
- When the server starts, it reads the last ID from the file to determine the next available ID for new entries.
- Requests to create, retrieve, update, or delete resources are handled according to RESTful principles.
- Each resource is assigned a unique ID upon creation.
- Modifications to the data are made directly to the JSON file.


### Testing with Postman

1. **POST /resource**: 
- Set the request method to POST.
- Set the request URL to `http://localhost:8000/resource`.
- In the request body, provide the data you want to store in JSON format.
- Send the request.

2. **GET /record**:
- Set the request method to GET.
- Set the request URL to `http://localhost:8000/record`.
- Send the request to retrieve all records.

3. **GET /resource/{id}**:
- Set the request method to GET.
- Set the request URL to `http://localhost:8000/resource/{id}` where `{id}` is the ID of the resource you want to retrieve.
- Send the request.

4. **PATCH /resource/{id}**:
- Set the request method to PATCH.
- Set the request URL to `http://localhost:8000/resource/{id}` where `{id}` is the ID of the resource you want to update.
- In the request body, provide the data you want to update in JSON format.
- Send the request.

5. **DELETE /resource/{id}**:
- Set the request method to DELETE.
- Set the request URL to `http://localhost:8000/resource/{id}` where `{id}` is the ID of the resource you want to delete.
- Send the request.

6. **PUT /resource/{id}**:
- Set the request method to PUT.
- Set the request URL to `http://localhost:8000/resource/{id}` where `{id}` is the ID of the resource you want to update.
- In the request body, provide the data you want to replace the existing data with in JSON format.
- Send the request.

### Note
- Make sure to adjust the request URLs with appropriate IDs as per your data.

- example : GET /http://localhost:8000/resource/3  for retriving the data from id:3

- Error handling is implemented for various scenarios such as file reading errors, resource not found, etc.