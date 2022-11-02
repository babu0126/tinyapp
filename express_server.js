const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {};

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');


// HOMEPAGE -> Redirect to /urls
app.get("/", (req, res) => {
  res.redirect('/urls')
});

app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase,
  username: req.cookies.userName};
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
  const templateVars = { id: req.params.id, longURL: 'http://www.lighthouselabs.ca', username: req.cookies.userName};
  console.log(templateVars);
  res.render("urls_show", templateVars);
});


// Temporary endpoint to visually view the current urlDatabase
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
// Temporary endpoint to visually view the current users
app.get("/urls", (req, res) => {
  res.json(users);
})



// EDIT
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
});

//REGISTER
app.get('/register', (req, res) => {
  const templateVars = {username: req.cookies.userName
  };
  res.render('register', templateVars)
});

app.post('/register', (req, res) => {
  const inputEmail = req.body.email;
  const inputPass = req.body.password;
});

//LOGIN
app.get('/login', (req, res) => {
  res.render('login');
});
app.post('/login', (req, res) => {
  console.log(req.body);
  if (req.body.username) {
    res.cookie('userName', req.body.username)
    res.redirect('/urls')
  }
});
//LOGOUT
app.post('/logout', (req, res) => {
  res.clearCookie('userName');
  res.redirect('/urls')
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {}