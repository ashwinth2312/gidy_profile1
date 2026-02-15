Profile Builder Application

Project Overview : 

--> This project is a Profile Builder web application developed as part of the Gidy Technical Assessment.


--> The application allows users to create, manage, and view a professional profile through a clean and user-friendly interface.


--> Users can add personal details, education, projects, skills, and upload a profile picture.


--> The application follows a full-stack MERN-style architecture with a separate frontend and backend

Live Application : 

--> Frontend (Vercel): https://gidyprofile1.vercel.app/


--> Backend API (Render): https://gidy-profile1.onrender.com/api/profile


Key Features : 


--> Create and manage a professional profile


--> Add / edit personal details, education, projects, and skills


--> Upload profile picture with validation


--> Responsive UI for desktop and mobile


--> Secure backend API integration


--> Cloud-hosted MongoDB database



Innovations Implemented : 


1. Dark / Light Theme Toggle

   
  --> A theme switcher is implemented to allow users to toggle between dark mode and light mode.

  
  --> This improves accessibility and user comfort, especially for mobile and low-light usage.

   
2. Profile Picture Upload

 
  --> Users can upload a profile picture, which is stored securely on the server.

  
  --> Basic validations are applied (file type and size) to ensure safe uploads.

  
   
Why these innovations?


Both features enhance user experience and reflect real-world application requirements such as personalization and usability.


Validation Handling :


--> Required field validation for profile inputs


--> Input length and format checks


--> File validation for profile picture upload


--> Error handling on both frontend and backend


Application Flow :


1) User lands on the main profile page

 
2) Profile data is displayed from the backend

 
3) Clicking Edit / Manage opens a popup/modal

 
4) User can add or update profile information


5) Data is saved using API calls to the backend

 
6) Updated profile is reflected immediately


Technology Stack :


--> Front-end :


        *) React (Vite)
        *) JavaScript (ES6+)
        *) CSS (custom styling)
        *) Context API (Theme management)
        *) Axios (API calls)
--> Back-end :


        *) Node.js
        *) Express.js
        *) MongoDB (MongoDB Atlas)
        *) Mongoose

Deployment : 

    --> Front-end: Vercel 
    --> Back-end: Render 
    --> Database: MongoDB Atlas 

Project Structure :
    
    GIDY-PROFILE-PROJECT
    │
    ├── client/                         
    │   ├── public/                     
    │   ├── src/
    │   │   ├── assets/                 
    │   │   ├── components/             
    │   │   ├── hooks/                  
    │   │   ├── styles/                 
    │   │   ├── App.jsx                 
    │   │   ├── App.css                 
    │   │   ├── index.css               
    │   │   ├── main.jsx                
    │   │   └── ThemeContext.jsx        
    │   │
    │   ├── .env.local                 
    │   ├── index.html                  
    │   ├── package.json                
    │   ├── vite.config.js              
    │                   
    │
    ├── server/                         
    │   ├── src/
    │   │   ├── config/                 
    │   │   ├── models/                
    │   │   ├── routes/                 
    │   │   └── index.js               
    │   
    │── uploads/                                       
    │── .gitignore                
    │── package-lock.json 
    ├── package.json           
    └── README.md                         


API Overview :

--> The backend of this application is built using Node.js + Express, following a simple REST-style API design.


--> All profile-related data is managed through structured API endpoints and stored in MongoDB Atlas.


--> The APIs are designed around update-based operations (PUT) instead of multiple POST routes, keeping profile data consistent and easy to manage.


Base URL :

    --> Local: http://localhost:5000
    --> Production: <Render backend URL>


1) Profile API :

 
   *) Get Profile Details :
       Fetches the complete profile including personal details, education, skills, and projects.
   
           --> GET/api/

   *) Response includes:
         i) Profile information
        ii) Education list
       iii) Skills list
        iV) Projects list
   
2) Update Profile Details :
   Updates main profile data such as name, email, phone, summary, and links.
   
           --> PUT /api/profile
   Used for:
         *) Editing profile details
         *) Updating summary and contact information
   
3) Education API :
    Education records are managed using PUT and DELETE operations.
     *) ADD EDUCATION
   
                 --> PUT/api/profile/education
   
     *) DELETE EDUCATION
   
                 --> DELETE/api/profile/education/:educationId
   
4) PROJECT API :
   
   The Project API is used to manage project-related information in the user profile.
   *) ADD PROJECT
   
                 --> PUT/api/profile/projects
   
   *) DELETE PROJECT
   
                 --> DELETE/api/profile/projects/:projectId
5) SKILL API :
   The Skill API is used to manage the skills section of the user profile.
   *) ADD SKILL
   
                 --> PUT/api/profile/skills
   *) DELETE SKILL
   
                 --> DELETE/api/profile/skills/:skillId
   
Setup Instructions (Local) :


1. Clone Repository :

        --> git clone <repository-url>

2. Install Dependencies :

        1) Front-end :
        --> cd client
        --> npm install
        --> npm run dev
           
        2) Back-end :
        --> cd server
        --> npm install
        --> npm run dev



