import { expect } from 'chai';
import server from '../server';
import request from 'supertest';

// API ENDPOINT: /api/projects

/*
Requirements:
GET api/projects 
1.  when GET api/projects with valid token of authenticated user, should return: 
        a. status code of 200
        b. array of all existing projects
*/
/*
2.  When GET api/projects without token, should return:
    a. status code 401
    b. Error message 'No token, authorization denied'
*/
/*
3.  When GET api/projects with invalid token, should return:
    a. status code 401
    b. Error message 'Token is not valid'
*/
/*
GET api/projects/:id 
4.  when GET api/projects/:id with valid token of authenticated user
    and valid project id, should return: 
        a. status code of 200
        b. json object containing the project
*/
/*
5.  When GET api/projects/:id without token, should return:
    a. status code 401
    b. Error message 'No token, authorization denied'
*/
/*
6.  When GET api/projects/:id with invalid token, should return:
    a. status code 401
    b. Error message 'Token is not valid'
*/
