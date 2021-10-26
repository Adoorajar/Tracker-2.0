import { expect } from 'chai';
import server from '../server';
import request from 'supertest';

// API ENDPOINT: /api/auth

/*
Requirements:
POST api/auth tests:
1.  when POST without email, should return the following:
        a. status code of 400
        b. error message: 'Please include a valid email'
*/
const auth_test_1_config = {
  body: {
    password: '123456',
  },
};
/*
2.  when POST with invalid email, should return the following:
        a. status code of 400
        b. error message: 'Please include a valid email'
*/
const auth_test_2_config = {
  body: {
    email: 'authtest2-authtest2.com',
    password: '123456',
  },
};
/*
3.  when POST without password, should return the following:
        a. status code of 400
        b. error message: 'Password is required'
*/
const auth_test_3_config = {
  body: {
    email: 'authtest3@authtest3.com',
  },
};
/*
4.  when POST with incorrect password, should return the following:
        a. status code of 400
        b. error message: 'Invalid credentials'
*/
// Register user for test 4, then clean up at end of tests
const auth_test_4_config = {
  body: {
    name: 'fnauthtest4 lnauthtest4',
    email: 'authtest4@authtest4.com',
    password: 'authtest4password',
  },
  body_incorrect_password: {
    email: 'authtest4@authtest4.com',
    password: 'incorrectpassword',
  },
};
/*
5.  when POST with user that doesn't exist, should return the following:
        a. status code of 400
        b. error message: 'Invalid credentials'
*/
const auth_test_5_config = {
  body: {
    email: 'authtest5@authtest5.com',
    password: 'authtest5password',
  },
};
/*
6.  When POST with valid email and password of existing user, should return token
*/
// User Test 4 user for this test
/*
GET api/auth tests:
7.  When GET with valid token of existing user, should return user
*/
// Register user and use token for test 7
const auth_test_7_config = {
  body: {
    name: 'fnauthtest7 lnauthtest7',
    email: 'authtest7@authtest7.com',
    password: 'authtest7pw',
  },
};
/*
8.  When GET with invalid token, should return:
    a. status code 401
    b. Error message 'Token is not valid'
*/
const auth_test_8_config = {
  body: {
    token: 'werds',
  },
};
/*
9.  When GET with valid token that doesn't belong to any existing users, should return:
    a. status code 500
    b. Error message 'Server Error'
*/
// Register user, store token, then delete user from db
const auth_test_9_config = {
  body: {
    name: 'fnauthtest9 lnauthtest9',
    email: 'authtest9@authtest9.com',
    password: 'authtest9pw',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjE3NzMxMTE1ZTcxNjhkOTA4OWZjYTQyIn0sImlhdCI6MTYzNTIwMTI5NywiZXhwIjoxNjM1NTYxMjk3fQ.VyjBA6cliaVMFOyKYO8r1W09gwZmUaIQENWM4db3GBk',
  },
};
/*
10.  When GET without token, should return:
    a. status code 401
    b. Error message 'No token, authorization denied'
*/

// TEST SETUP and CLEANUP UTILITY
const delete_user = async (user_info, msg) => {
  const User = require('../models/User');
  const { email } = user_info.body;
  let user = await User.findOne({ email });

  if (user) {
    await User.findOneAndRemove({ _id: user._id });
    console.log(msg);
  }
};

describe('hooks', () => {
  before(async () => {
    // Register user for test 4
    const auth_test_4_user = await request(server)
      .post('/api/users')
      .send(auth_test_4_config.body)
      .set('Content-Type', 'application/json');
  });
  after(async () => {
    // Test 4 cleanup - delete user from db
    delete_user(auth_test_4_config, 'Auth test 4 user deleted from db');

    // Test 7 cleanup - delete user from db
    delete_user(auth_test_7_config, 'Auth test 7 user deleted from db');
  });

  // Begin tests
  describe('Auth API Tests', () => {
    // Test 1
    it('POST /api/auth without email', async () => {
      const response = await request(server)
        .post('/api/auth')
        .send(auth_test_1_config.body)
        .set('Content-Type', 'application/json');
      expect(response.status).to.equal(400);
      expect(response.body.errors[0].msg).to.be.equal(
        'Please include a valid email'
      );
    });

    // Test 2
    it('POST /api/auth with invalid email', async () => {
      const response = await request(server)
        .post('/api/auth')
        .send(auth_test_2_config.body)
        .set('Content-Type', 'application/json');
      expect(response.status).to.equal(400);
      expect(response.body.errors[0].msg).to.be.equal(
        'Please include a valid email'
      );
    });

    // Test 3
    it('POST /api/auth without password', async () => {
      const response = await request(server)
        .post('/api/auth')
        .send(auth_test_3_config.body)
        .set('Content-Type', 'application/json');
      expect(response.status).to.equal(400);
      expect(response.body.errors[0].msg).to.be.equal('Password is required');
    });

    // Test 4
    it('POST /api/auth with incorrect password', async () => {
      const response = await request(server)
        .post('/api/auth')
        .send(auth_test_4_config.body_incorrect_password)
        .set('Content-Type', 'application/json');
      expect(response.status).to.equal(400);
      expect(response.body.errors[0].msg).to.be.equal('Invalid credentials');
    });

    // Test 5
    it('POST /api/auth with user that does not exist', async () => {
      const response = await request(server)
        .post('/api/auth')
        .send(auth_test_5_config.body)
        .set('Content-Type', 'application/json');
      expect(response.status).to.equal(400);
      expect(response.body.errors[0].msg).to.be.equal('Invalid credentials');
    });

    // Test 6
    it('POST /api/auth with valid email and password of existing user', async () => {
      const response = await request(server)
        .post('/api/auth')
        .send(auth_test_4_config.body)
        .set('Content-Type', 'application/json');
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an.instanceOf(Object);
    });

    // Test 7
    it('GET /api/auth with valid user token', async () => {
      // Register user and store token for test 7
      const auth_test_7_user_reg_response = await request(server)
        .post('/api/users')
        .send(auth_test_7_config.body)
        .set('Content-Type', 'application/json');

      // Run test 7
      const response = await request(server)
        .get('/api/auth')
        .set('x-auth-token', auth_test_7_user_reg_response.body.token);
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an.instanceof(Object);
    });

    // Test 8
    it('GET /api/auth with invalid token', async () => {
      const response = await request(server)
        .get('/api/auth')
        .set('x-auth-token', auth_test_8_config.body.token);
      expect(response.status).to.equal(401);
      expect(response.body.msg).to.be.equal('Token is not valid');
    });

    // Test 9
    it('GET /api/auth with valid token that does not belong to any existing users', async () => {
      const response = await request(server)
        .get('/api/auth')
        .set('x-auth-token', auth_test_9_config.body.token);
      expect(response.status).to.equal(500);
      expect(response.text).to.be.equal('Server Error');
    });

    // Test 10
    it('GET /api/auth without token', async () => {
      const response = await request(server).get('/api/auth');
      expect(response.status).to.equal(401);
      expect(response.body.msg).to.be.equal('No token, authorization denied');
    });
  });
});
