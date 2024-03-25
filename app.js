const express = require('express')
const app = express()

// Enable JSON body parsing middleware
app.use(express.json());
const cors = require('cors');
const port = 3000

app.use(cors());

const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database, or create it if it doesn't exist
const db = new sqlite3.Database('./mydb.sqlite3', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Database connected');
    
    // Create a new table if it doesn't exist
    db.run('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, price INTEGER)', (err) => {
      if (err) {
        console.log('Error creating table', err.message);
      } else {
        console.log('Table is ready');
      }
    });
  }
});

app.get('/', async (req, res) => {
    db.all("SELECT * FROM `products`",[],(err,rows) =>{
        if(err){
            console.log("Operation Failed")
            res.status(500).send('Error fetching data from the database');
        }else{
            res.send(rows)
        }
    })
  });
  

app.post('/add', (req, res) => {
    const { name, description, price } = req.body;

    // SQL statement to insert data
    const sql = `INSERT INTO products (name, description,price) VALUES (?, ?, ?)`;
    
    // Insert data into the SQLite database
    db.run(sql, [name, description, price], (err) => {
      if (err) {
        return console.error('Error inserting data into database', err.message);
      }
      // If successful, send a response back to the client
      res.send("Data added successfully");
    });
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})