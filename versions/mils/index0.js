import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3005 || 3006;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "password",
    port: 5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function checkVisisted() {
    const results = await db.query("SELECT country_code FROM visited_countries");
    const countries = [];
    results.rows.forEach(country => {
        countries.push(country.country_code);
    });
    console.log(results.rows);
    return countries;
}

app.get("/", async (req, res) => {
    //Write your code here.
    try {
        const countries = await checkVisisted();
        res.render("index.ejs", { countries: countries, total: countries.length });
        // db.end();
    } catch (err) {
        console.error("Error occurred while retrieving data", err);
        res.status(500).send("An error occurred while retrieving data.");
    }
});

app.post("/add", async (req, res) => {
    try {

    const countryName = req.body.country;

    const result = await db.query("SELECT country_code FROM countries WHERE country_name = $1",[countryName]);
    if(result.rows.length !==0)
    {
      const  countryCode = result.rows[0].country_code;
      await  db.query("insert into visited_countries (country_code) VALUES ($1)",[countryCode]);
    }
    else
      alert("Country not found!");
    res.redirect('/');

} catch (err) {
        console.error("Error occurred while retrieving data", err);
        res.status(500).send("An error occurred while posting the data.");
    }
})


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


