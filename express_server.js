const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const PORT = 8080;
const app = express();


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
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
  user3RandomID: {
    id: "user3RandomID",
    email: "a@b.com",
    password: "123",
  },
  
};
// HELPER FUNCTIONS
const generateRandomString = function () {
  return Math.random().toString(36).substring(2,8);
};

const getUserByEmail = function (email, usersDatabase) {
  for (const userid in usersDatabase) {
    if (email === usersDatabase[userid].email) {
      return usersDatabase[userid].id;
    }
  }
  return null; 
};

const getUserByUserID = function (userIDs, userDatabase) {
  for (const userid in userDatabase) {
    if (userIDs === userid) {
      return true;
    }
    return false;
  }
};

const urlsForUser = function (userIDs, urlDatabase) {
  const userUrl = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === userIDs) {
      userUrl[shortURL] = urlDatabase[shortURL].longURL;
    }
  }
  console.log(userUrl);
  return userUrl;
}

// MIDWARES 
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.listen(PORT, (req, res) => {
  console.log(`The Server is listening on PORT ${PORT}`);
})

app.get('/', (req, res) => {
  if (getUserByUserID(req.cookies.user_id, users)) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
})

app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlsForUser(req.cookies.user_id, urlDatabase),
    user: users[req.cookies.user_id]
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  if (getUserByUserID(req.cookies.user_id, users)) {
    res.redirect('/urls');
  } else {
    const templateVars = {
    user: users[req.cookies.user_id]
    };
    res.render('urls_new', templateVars);
  }
});

// Showing the user their newly created short url 
app.get('/urls/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      userID: urlDatabase[req.params.shortURL].userID,
      user: users[req.cookies.user_id]
  };
  res.render('urls_show', templateVars);
} else {
  res.status(404).send('The short URL does not match with the long URL')
}
});

// Directing to the longURL
app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL];
    if (longURL === undefined) {
      res.status(302).send('The longURL is not defined!');
    } else {
      res.redirect(longURL);
    }
  } else {
    res.status(404).send('The shortURL does not exist!')
  }
});

// REGISTER
app.get('/register', (req, res) => {
  if (getUserByUserID(req.cookies.user_id, users)) {
    res.redirect('/urls');
  } else {
    const templateVars = {
    user: req.cookies.user_id
    };
  res.render('urls_register',templateVars);
  }
});

// LOGIN 
app.get('/login', (req, res) => {
  if (getUserByUserID(req.cookies.user_id, users)) {
    res.redirect('/urls');
  } else {
  const templateVars = {
    user: users[req.cookies.user_id]
    };
    res.render('urls_login', templateVars);
  }
});


// ROUTES FOR POST
app.post('/urls', (req, res) => {
  if (req.cookies.user_id) {
    const newShortURL = generateRandomString();
    urlDatabase[newShortURL] = {
      longURL: req.body.longURL,
      userID: req.cookies.user_id
    };
    res.redirect(`/urls/${newShortURL}`);
  } else {
    res.status(401).send('Please logged in before creating URL');
  }
});

// DELETE
app.post('/urls/:shortURL/delete', (req, res) => {
  const userId = req.cookies.user_id;
  const shortURL = req.params.shortURL;
  if (userId === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    res.redirect('/urls');
  } else {
    res.status(401).send('No authorization to delete!');
  }
});

// EDIT
app.post('/urls/:id', (req, res) => {
  const userId = req.cookies.user_id;
  const shortURL = req.params.shortURL;
  if (userId !== urlDatabase[shortURL].userID) {
    res.status(401).send('No authorization to edit!');
  } else {
    urlDatabase[shortURL].longURL = req.body.newURL;
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
    if (password !== users[userID].password) {
      res.status(403).send("The password is incorrect!");
    } else {
      res.cookie('user_id', userID);
      res.redirect('/urls');
    }
  }
});

// LOGOUT
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
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
      password: inputPassword,
    };
    res.cookie('user_id', user);
    res.redirect('/urls');
  }
});
