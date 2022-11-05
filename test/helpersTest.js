const { assert } = require('chai');

const {
  generateRandomString,
  getUserByEmail,
  getUserByUserID,
  urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const testUrlDatabase = {
  "aegbdf": {
    longURL: "http://www.google.com",
    userID: "user1RandomID"
  },
  "opelg3": {
    longURL: "http://www.yahoo.com",
    userID: "user2RandomID"
  },
};

describe('generateRandomString', function(){
  it('should return a string with six random characters', function() {
    const randomStringLength = generateRandomString().length;
    const expectedLength = 6;
    assert.equal(randomStringLength, expectedLength);
  });
  it('should return a random string each time', function() {
    const randomString1 = generateRandomString();
    const randomString2 = generateRandomString ();
    assert.notEqual(randomString1, randomString2);
  })
});

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user, expectedUserID);
  });
  it('should return undefined if no matched email is found', function() {
    const user = getUserByEmail("abc@example.com", testUsers);
    const expectedOutput = null;
    assert.equal(user, expectedOutput);
  })
});

describe('getUserByUserID', function() {
  it('should return true if userID existed', function() {
    const actualOutput = getUserByUserID('user2RandomID', testUsers);
    const expectedOutput = true;
    assert.equal(actualOutput, expectedOutput);
  });
});

describe('urlsForUser', function() {
  it('should return urls object if userID is correct', function() {
    const actualObj = urlsForUser('user2RandomID', testUrlDatabase);
    const expectedOutput = { opelg3: 'http://www.yahoo.com' };
    assert.deepEqual(actualObj, expectedOutput);
  });
  it('should return null if entry is empty', function() {
    const actualObj = urlsForUser('', testUrlDatabase);
    assert.isNull(actualObj);
  });
});

