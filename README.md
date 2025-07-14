1. Install MySQL on New System <br>
<hr>
2. Configure .env File <br>
DB_HOST=localhost <br>
DB_USER=root <br> 
DB_PASSWORD=your_password_here <br>
DB_NAME=org_tree <br>
<hr>
Install Node.js & Dependencies <br>
 In terminal, go to backend/ folder and in terminal run the commands: npm install express cors mysql2 multer xlsx dotenv <br>
 <hr>
4. Start the Backend Server <br> 
<hr> 
5. Done! App Will:  <br>
Automatically create employees table if not present  <br>
Automatically insert and load default Excel from /backend/default/Employee_details.xlsx  <br>
Display the organization tree  <br>
<hr>
 Make sure your browser allows HTTP requests to localhost from a file. If it blocks, consider using a local server:   <br>
bash  ->  npx serve .   <br>
<hr>
