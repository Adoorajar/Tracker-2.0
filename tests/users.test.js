import { expect } from 'chai';
import server from '../server';
import request from 'supertest';

/* API ENDPOINT: /api/users 

Requirements:
1.  when registering new user with name, valid email and valid password,
    should return the following:
        a. status code of 200
        b. token
*/
const users_test_1_config = {
  body: {
    name: 'fnuserstest1 lnuserstest1',
    email: 'userstest1@userstest1.com',
    password: '123456',
  },
};

/*
2.  when registering user who already exists, should return the following:
        a. status code of 400
        b. error message: 'User already exists'
*/
// Re-use Test 1 config for Test 2
/*
3.  when registering user without name, should return the following:
        a. status code of 400
        b. error message: 'Name is required'
*/
const users_test_3_config = {
  body: {
    email: 'userstest3@userstest3.com',
    password: '123456',
  },
};
/*
4.  when registering user without email, should return the following:
        a. status code of 400
        b. error message: 'Please include a valid email'
*/
const users_test_4_config = {
  body: {
    name: 'fnuserstest4 lnuserstest4',
    password: '123456',
  },
};
/*
5.  when registering user with invalid email, should return the following:
        a. status code of 400
        b. error message: 'Please include a valid email'
*/
const users_test_5_config = {
  body: {
    name: 'fnuserstest5 lnuserstest5',
    email: 'userstest5_userstest5.com',
    password: '123456',
  },
};
/*
6.  when registering user without password, should return the following:
        a. status code of 400
        b. error message: 'Please enter a password of six characters or more'
*/
const users_test_6_config = {
  body: {
    name: 'fnuserstest6 lnuserstest6',
    email: 'userstest6@userstest6.com',
  },
};
/*
7.  when registering user with password less than 6 characters, should return the following:
        a. status code of 400
        b. error message: 'Please enter a password of six characters or more'
*/
const users_test_7_config = {
  body: {
    name: 'fnuserstest7 lnuserstest7',
    email: 'userstest7@userstest7.com',
    password: '12345',
  },
};

// TEST 1 USER CLEANUP:
const User = require('../models/User');
const users_test_1_user_cleanup = async () => {
  const { email } = users_test_1_config.body;
  let user = await User.findOne({ email });

  if (user) {
    console.log('Test 1 user found');
    await User.findOneAndRemove({ _id: user._id });
    console.log('Test 1 user removed from db');
  }
};

describe('hooks', () => {
  before(async () => {
    await users_test_1_user_cleanup();
  });
  after(async () => {
    await users_test_1_user_cleanup();
  });

  // Begin tests
  describe('Users API Tests', () => {
    // Test 1
    it('POST /api/users with valid new user and returns a token', async () => {
      const response = await request(server)
        .post('/api/users')
        .send(users_test_1_config.body)
        .set('Content-Type', 'application/json');
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an.instanceOf(Object);
    });

    // Test 2
    it('POST /api/users with existing user and should fail', async () => {
      const response = await request(server)
        .post('/api/users')
        .send(users_test_1_config.body)
        .set('Content-Type', 'application/json');
      expect(response.status).to.equal(400);
      expect(response.body.errors[0].msg).to.be.equal('User already exists');
    });

    // Test 3
    it('POST /api/users without name and should fail', async () => {
      const response = await request(server)
        .post('/api/users')
        .send(users_test_3_config.body)
        .set('Content-Type', 'application/json');
      expect(response.status).to.equal(400);
      expect(response.body.errors[0].msg).to.be.equal('Name is required');
    });

    // Test 4
    it('POST /api/users without email and should fail', async () => {
      const response = await request(server)
        .post('/api/users')
        .send(users_test_4_config.body)
        .set('Content-Type', 'application/json');
      expect(response.status).to.equal(400);
      expect(response.body.errors[0].msg).to.be.equal(
        'Please include a valid email'
      );
    });

    // Test 5
    it('POST /api/users with invalid email and should fail', async () => {
      const response = await request(server)
        .post('/api/users')
        .send(users_test_5_config.body)
        .set('Content-Type', 'application/json');
      expect(response.status).to.equal(400);
      expect(response.body.errors[0].msg).to.be.equal(
        'Please include a valid email'
      );
    });

    // Test 6
    it('POST /api/users without password and should fail', async () => {
      const response = await request(server)
        .post('/api/users')
        .send(users_test_6_config.body)
        .set('Content-Type', 'application/json');
      expect(response.status).to.equal(400);
      expect(response.body.errors[0].msg).to.be.equal(
        'Please enter a password of six characters or more'
      );
    });

    // Test 7
    it('POST /api/users with password less than 6 characters and should fail', async () => {
      const response = await request(server)
        .post('/api/users')
        .send(users_test_7_config.body)
        .set('Content-Type', 'application/json');
      expect(response.status).to.equal(400);
      expect(response.body.errors[0].msg).to.be.equal(
        'Please enter a password of six characters or more'
      );
    });
  });
});

/* // TEST CLEANUP:
const User = require('../models/User');
const test_1_user_cleanup = async () => {
  const { email } = test_1_config.body;
  let user = await User.findOne({ email });

  if (user) {
    console.log('Test 1 user found');
    await User.findOneAndRemove({ _id: user._id });
    console.log('Test 1 user removed from db');
  }
};

test_1_user_cleanup(); */
