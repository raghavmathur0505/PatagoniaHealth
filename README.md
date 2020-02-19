# Patient Management System

## Instruction to run
- The application is publicly available and can be access via the url
- To run the application locally:
  - Pull the code from github. Ref: `git clone repo_url`
  - Install dependencies. Ref: `npm install`
  - Set environment variables for host and port for the application and mongodb connection.
  - Run the application. Ref: `npm run dev`

## Directory
- src (Contains code for backend application)
  - handlers (routes for patient and physician APIs)
  - models (database model files)
  - app.js (entry code)
- public (Contains code for frontend application)
  - css (contains css files used by html files)
  - js (contains controllers)
  - index.html (Welcome and Physician login page)
  - registration.html (Physician registration page)
  - dashboard.html (View, create, update and delete patients)

## Features
Physician
- Registration:
  - Validate firstname, lastname, email and passwords fields during registration
- Login
  - Validate username and password for existing Physicians

Patient
- View Patients
  - See a patients's Firstname, Lastname, email(unique), createdAt, lastUpdatedAt
  - Ability to update patients information
    - Validate name and email during update
  - Ability to delete a patient
- Add Patients
  - Allow only unique patient to be added based on their unique email
    - Validate name and email during create
  - Patients are added by physician and are related in the database. Patients added by 1 physician will not be visible to another physician.

## Backend
- The application is designed in MVC using APIs in NodeJS, Express to interact with NoSql database (MongoDb).
- 2 endpoints exist in the API which can be accessed even outside the application:
  - Physician:
    - GET http://hostname:port/Physician?query=value: Fetches all the Physician resources in database. Use querys to filter the response.
    - GETBYID http://hostname:port/Physician/id: Fetched a single Physician resource based on the unique id
    - PATCH http://hostname:port/Physician/id Updates a single Physician resource
    - DELETE http://hostname:port/Physician/id Permanently deletes a Physician resource
    - PATCH http://hostname:port/Physician/id Updates a single Physician resource
    - POST http://hostname:port/Physician Creates a new Physician
  - Patient:
    - GET http://hostname:port/Patient?query=value: Fetches all the Patient resources in database. Use querys to filter the response.
    - GETBYID http://hostname:port/Patient/id: Fetched a single Patient resource based on the unique id
    - PATCH http://hostname:port/Patient/id Updates a single Patient resource
    - DELETE http://hostname:port/Patient/id Permanently deletes a Patient resource
    - PATCH http://hostname:port/Patient/id Updates a single Patient resource
    - POST http://hostname:port/Patient Creates a new patient

## Frontend
- The web application is designed using MVC framework (AngularJS)
- It makes calls to the backend API to interact with Patients and Physician
- Uses session storage for maintaining user login session between page refreshes
- Uses bootstrap for creating responsive web pages

## Technology:
- The application is developed using MEAN Stack
  - NodeJS (Support backend API logic and interacts with database)
  - Express (Middleware for node application to route http requests)
  - MongoDb (Store data in Document format)
  - AngularJS (Frontend web application)

## Deployment
- The application is deployed using AWS EC2 instance
- The data is deployed using https://mlab.com/ which provides hosting service for MongoDB
