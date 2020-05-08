# MOVIEPEDIA BACKEND 

That Restful API developed with Node.JS and Express

## Dependencies

*  Express Generator Setup
```jsx
npm install -g express-generator
express .
express <APP FOLDER NAME>

```

*  Port Settings
```jsx
bin/www.js
default port: 3000
edit port: 8080
```

* Localhost Cors bug fix => Access-Control-Allow-Origin...
```jsx
npm install cors --s
```

## How to Install
Clone this folder and install dependencies.

```jsx
mkdir moviepedia_backend
cd moviepedia_backend
git init
git clone https://github.com/armaganbayraktar01/moviepedia_backend.git
npm install
```

## Enviroments variables
Create a file named ".env" in the root directory and fill its contents as follows.

```jsx
DB_USERNAME = DB USER USERNAME
DB_PASS = DB USER PASSWORD
DB_HOST = xxxxxx
DB_NAME = xxxxxx
API_SECRET_KEY: JWT TOKEN SECRET KEY
```

## Available Scripts

```jsx
npm start
```

```jsx
npm dev
```

```jsx
npm stop
```

```jsx
npm test
```

## Endpoints






