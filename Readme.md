# This is a Backend Project with Javascript

A overview of all screens to be made in the project made with eraser.io
- [Model link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj?origin=share)
----------------------------
<br>

- Important packages used in backend for simplification 

1) mongoose-aggregate-paginate-v2
The mongoose-aggregate-paginate-v2 package is used to add pagination support to Mongoose aggregate queries.

Q. Why Use It?
When dealing with large datasets in MongoDB, mongoose-aggregate-paginate-v2 makes it easier to manage and fetch paginated results from complex aggregation pipelines without having to implement the pagination logic manually.

usage: filename.plugin(mongooseAggregatePaginate);

plugin: The .plugin() method in Mongoose is used to enhance a schema with additional functionality. It adds the ability to perform pagination on aggregation pipelines executed on the videoSchema.

2) bcrypt

bcrypt is a popular password hashing algorithm used to securely store passwords.

Q. How bcrypt Works:

1) Salting: A random string (salt) is generated and combined with the password.
2) Hashing: The salted password is processed through a hashing algorithm multiple times (work factor determines the number of rounds).
3) Output: A final hashed string is produced, which includes the salt, cost factor, and the hash itself. 

Applications: 

User Authentication: Storing hashed passwords in databases for secure login systems.

API Security: Protecting sensitive credentials.

In summary, bcrypt is a trusted tool for hashing passwords securely in applications, providing both protection and adaptability to evolving security needs.

3) bcrypt js

Optimized bcrypt in JavaScript with zero dependencies

bcryptjs is written entirely in JavaScript and does not rely on external dependencies

Use cases:

Secure password storage and verification.

Applications where native dependencies cause installation or runtime issues.

4) JsonWebToken

jsonwebtoken is a Node.js library used to create and verify JSON Web Tokens (JWTs), a compact and secure way to transmit information between parties as a JSON object

Structure of a JWT:

A JWT consists of three parts, separated by dots (.):


1) Header: Contains metadata about the token (e.g., type and signing algorithm).

2) Payload: Contains claims (information like user ID or roles).

3) Signature: Verifies the token’s integrity, ensuring it hasn't been tampered with.

Common Use Cases:

1) Authentication: Used to verify users and manage sessions in a stateless way.

2) Authorization: Securely pass user permissions to APIs.

3) Data Exchange: Safely transmit information between systems.
--------------------------
- Cloudinary: cloud-based service that provides tools for managing, optimizing, and delivering images and videos in web and mobile applications.

1. fs: In Node.js, fs stands for the File System module, which provides a set of functions to interact with the file system, enabling developers to perform operations like reading, writing, deleting, and modifying files and directories.


- Key Features:

a) File Operations: Create, read, write, update, and delete files.

b) Directory Operations: Create, read, delete, and manage directories.

c) Synchronous and Asynchronous APIs: Supports both blocking (synchronous) and non-blocking (asynchronous) methods.

d) Streaming: Allows working with file streams for efficient handling of large files.

- Common Use Cases:
1) Reading and writing files for data processing.
Creating and managing log files.

2) File-based configurations and data storage.

3) Handling file uploads in web applications.