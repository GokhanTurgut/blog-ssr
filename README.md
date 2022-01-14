# gusto-Blogs

![Project example picture](https://i.ibb.co/FX3q8YJ/gusto-Blogs-image.png)

Second assignment project for Gusto & RemoteTeam Node.js Bootcamp.

### [LIVE DEMO](https://gusto-blogs.herokuapp.com/)

---

## Project Information

Technologies that has been used to create this project are NodeJS, Express and MongoDB. This project uses server side rendering with the help of EJS as template engine.

User authentication and authorization has been implemented with Json Web Tokens and session data. After logging in session id and JWT token are kept in cookies and validated during each request that require permission.

Posts can be viewed by every user but adding, deleting and editing posts require logging in. Markdown can be used to write posts and it will be sanitized and converted to HTML for displaying.

## Getting Started

### Prerequisites

For running this project locally you will need a MongoDB cloud database access url which can be acquired after signing in and creating a database [here](https://www.mongodb.com/).

Required environment variables are:
```
PORT= 'Port of your choice, when empty defaults to 5000'
DATABASE_URL= 'MongoDB database url'
PRIVATE_KEY=  'Private key for JWT token'
SESSION_SECRET= 'Session secret key'
```

### Installation

```
git clone git@github.com:GokhanTurgut/blog-ssr.git
cd blog-ssr
npm install
npm start
```