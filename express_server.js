const express = require('express');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const PORT = 8080;
const app = express();
const { generateRandomString, getUserByEmail, getUserByUserID, urlsForUser } = require('./helpers');

// DATABASE for URLs
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};
// DATABASE for Users
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "a@a.com",
    password: bcrypt.hashSync("123", 10)
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "a@b.com",
    password: bcrypt.hashSync("123", 10)
  },
  user3RandomID: {
    id: "user3RandomID",
    email: "a@c.com",
    password: bcrypt.hashSync("123", 10)
  },
  
};

// MIDWARES 
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(cookieSession({
  name: 'session',
  keys: ['lighthouse'],
}));


/******************************************************************************/

app.get('/', (req, res) => {
  if (getUserByUserID(req.session.user_id, users)) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
})

// URLS_INDEX
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlsForUser(req.session.user_id, urlDatabase),
    user: users[req.session.user_id]
  };
  res.render('urls_index', templateVars);
});

// URLS_NEW
app.get('/urls/new', (req, res) => {
  if (!getUserByUserID(req.session.user_id, users)) {
    res.redirect('/urls');
  } else {
    const templateVars = {
      user: users[req.session.user_id]
    };
    res.render('urls_new', templateVars);
  }
});

// URLS_SHOW
app.get('/urls/:shortURL', (req, res) => {
  const userId = req.session.user_id;
  let templateVars  = {};
  if (!userId) {
    templateVars = null;
    res.status(400).send("Please logged in to access!");
  } else {
    const userURLs = urlsForUser(userId, urlDatabase);
    const shortURL = req.params.shortURL;
    if (userURLs[shortURL]) {
      const longURL = urlDatabase[shortURL].longURL;
      templateVars.user = users[userId];
      templateVars.longURL = longURL;
      templateVars.shortURL = shortURL;
    } else {
      templateVars.user = users[userId];
      templateVars.shortURL = null;
      res.status(304).send("The short URL does not match!");
    } 
  }
  res.render("urls_show", templateVars);
});

// Directing to the longURL
app.get("/u/:shortURL", (req, res) => {
  const shorturl = req.params.shortURL;
  if (urlDatabase[shorturl]) {
    const longurl = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longurl);
  } else {
    res.status(404).send('The shortURL does not exist!');
  }
});

// URSL_REGISTER
app.get('/register', (req, res) => {
  if (getUserByUserID(req.session.user_id, users)) {
    res.redirect('/urls');
  } else {
    const templateVars = {
      user: req.session.user_id
    };
    res.render('urls_register',templateVars);
  }
});

// URLS_LOGIN 
app.get('/login', (req, res) => {
  if (getUserByUserID(req.session.user_id, users)) {
    res.redirect('/urls');
  } else {
    const templateVars = {
      user: users[req.session.user_id]
    };
    res.render('urls_login', templateVars);
  }
});

/******************************************************************************/

app.post('/urls', (req, res) => {
  if (req.session.user_id) {
    const newShortURL = generateRandomString();
    urlDatabase[newShortURL] = {
      longURL: req.body.longURL,
      userID: req.session.user_id
    };
    res.redirect(`/urls/${newShortURL}`);
  } else {
    res.status(401).send('Please logged in before creating URL');
  }
});

// DELETE
app.post('/urls/:shortURL/delete', (req, res) => {
  const userId = req.session.user_id;
  const shortURL = req.params.shortURL;
  if (userId === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    res.redirect('/urls');
  } else {
    res.status(401).send('No authorization to delete!');
  }
});

// EDIT
app.post('/urls/:shortURL', (req, res) => {
  const userId = req.session.user_id;
  const short = req.params.shortURL;
  if (userId !== urlDatabase[short].userID) {
    res.status(401).send('No authorization to edit!');
  } else {
    urlDatabase[short].longURL = req.body.newURL;
    res.redirect('/urls');
  }
});

// LOGIN
app.post('/login', (req, res) => {
  const inputEmail = req.body.email;
  const password = req.body.password;
  if (getUserByEmail(inputEmail, users) === null) {
    res.status(403).send("There is no account associated with the e-mail");
  } else  {
    const userID = getUserByEmail(inputEmail, users);
    if (bcrypt.compareSync(password, users[userID].password)) {
      req.session.user_id = userID;
      res.redirect('/urls');
    } else {
      res.status(403).send("The password is incorrect!");
    }
  }
});

// LOGOUT
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

// REGISTER
app.post('/register', (req, res) => {
  const inputEmail = req.body.email;
  const inputPassword = req.body.password;
  if (!inputEmail || !inputPassword) {
    res.status(400).send("Please enter valid e-mail and password");
  } else if (getUserByEmail(inputEmail, users) !== null) {
    res.status(400).send("Email is in used!");
  } else {
    const user = generateRandomString();
    users[user] = {
      id: user,
      email: inputEmail,
      password: bcrypt.hashSync(inputPassword, 10),
    };
    req.session.user_id = user;
    res.redirect('/urls');
  }
});

app.listen(PORT, (req, res) => {
  console.log(`The Server is listening on PORT ${PORT}`);
})