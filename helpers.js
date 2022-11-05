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
  }
  return false;
};

const urlsForUser = function (userIDs, urlDatabase) {
  const userUrl = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === userIDs) {
      userUrl[shortURL] = urlDatabase[shortURL].longURL;
    } else if ( userIDs === '') {
      return null;
    }
  }
  return userUrl;
};


module.exports = {
  generateRandomString,
  getUserByEmail,
  getUserByUserID,
  urlsForUser
};