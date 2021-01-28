# Serverless Diary

A simple diary application using AWS Lambda and Serverless framework.

## Functionality of the application

This application will allow creating/removing/updating/fetching of diary items. Each diary item can optionally have an attachment image. Each user only has access to diary items that he/she has created.

## Application structure

### Backend

* The backend is deployed on AWS using serverless framework.
* It's RESTful API which uses the Auth0 authorization provider.

### Frontend

To run the client application, run the following commands:

1. cd to the client folder: `cd client`
2. Install dependencies: `npm install`
3. Run the client application: `npm run start`
4. Access http://localhost:3000 in your browser
5. Uses the Auth0 authentication provider 