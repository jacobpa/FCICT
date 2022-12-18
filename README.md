# FCICT
## Franklin County Inmate and COVID-19 Tracker

### What is this?
This is a web application to display the number of COVID-19 cases and the number of county jail inmates
in Franklin County, Ohio. It utilizes the similarly named library [FCICS](https://github.com/jacobpa/FCICS)
to fetch the data it displays.

### How can I use it?
#### Docker
Included in this repository is a Docker image that you can build and use to run the production
version of this application on your local machine. It builds the project, and exposes the server on
port `3000`.

To build the image, run the following command in the project directory:
```
docker build -t fcict .
```

To run the image, you must provide the local port to map to, and provide the SQLite database as a
volume:
```
LOCAL_PORT=3000
DB_PATH=/path/to/fcics.db
docker run -v $DB_PATH:/fcict/fcics.db -p $LOCAL_PORT:3000 --name fcict fcict
```

#### Locally
You'll need to have Node.js, and SQLite3 installed in the environment in which you plan to run it on.
Then, you can:

```
yarn install
yarn dev # Run the development server
yarn build && yarn start # Run the production server
yarn fetch # Populate the database, which will appear at the project root. 
```

### What does this use?
* Svelte + Sapper
* Chart.js
* SQLite3
  * Support for other databases may be added later, but probably not

## License
```
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>
```