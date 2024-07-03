# Simple Web Scraper

### Tech-stack
- Backend: NodeJs - TypeScript
- Frontend: ReactJs - TypeScript
- Database: Postgres
- Node v.18

![Main Screenshot](./assets/main-screenshot.png)

## SourceCode Structure
```
|-- backend 
|-- frontend
|-- assets   // ReadMe resource files
|-- deploy
|   |-- db-scripts
|   |-- docker-compose.yml
|   |-- .env
|   |-- setup.sh
```

## Setup And Run
[Watch the video](./assets/running-demo.mov)
1. Goto folder `deploy`, open .env file to edit database creation parameters. Then open Terminal at that folder and run following command
```
sh setup.sh
```
2. Goto Docker and check if the all 3 instances started successfully or not. If yes, then you can start using it at
```
http:\\localhost:3001
```
3. Port config. You can change the port of Backend and Frontend images in the file `docker-compose.yml`

## Account for login
This account is hard-coded in backend repository, not database
```
username: admin
password: MyPass
```
## Testing Web URLs
There are some cool Web URLs for testing
```
https://www.pexels.com/search/videos/
https://www.scienceofpeople.com/
https://coucousuzette.com/en/collections/kids
```

--------------------------------
## TODO Stuff
#### For Backend
1. Implement Authentication, real user login
2. Using JWT token instead of Basic Authentication
3. Generate thumbnail image for video
4. Improve performance
   
#### For Frontend
1. Improve preview dialog 
2. Apply thumbnail image for video

 
