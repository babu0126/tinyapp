const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: 'http://www.lighthouselabs.ca'};
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

 app.get("/u/:id", (req, res) => {S
  res.redirect(longURL);
});

app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id] = req.body.newURL
  
  res.redirect('/urls')
});

//DELETE
app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {}