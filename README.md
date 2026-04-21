# Conservation Drone Lab

Conservation Drone Lab is a browser-based teaching app that helps students learn JavaScript concepts by programming a simulated drone through story-driven conservation missions.

Students type one drone command per line, click `Run Program`, and watch the drone animate across the canvas. The activity connects coding syntax with visible movement, sequencing, debugging, and realistic field survey planning.

## Features

- static web app with no build step
- four field-role difficulty paths: Field Trainee, Field Ecologist, Research Lead, and Senior Scientist
- conservation storyline campaigns for each level
- browser-based student and teacher login system
- JavaScript-style command editor
- role-based coding requirements that introduce `if` statements and `for` loops
- animated drone flight on an HTML canvas
- validation for incorrect commands and missing values
- mission survey points and landing goals for students to complete
- colour-based soil, water, pollen, bark, and ash land sample collection missions using `takeSample();`
- animal photo missions using `takePhoto();`
- role progress stars and field-role badges for completed mission groups
- reset and example program buttons for classroom use
- field-role visual themes and layouts
- visual no-fly zones such as nest buffers, quiet zones, and fragile habitat to encourage problem solving
- teacher dashboard showing completed and pending missions for each student
- teacher tools for deleting student accounts and changing student passwords

## Supported Commands

- `takeOff();`
- `land();`
- `moveUp(80);`
- `moveDown(80);`
- `moveLeft(80);`
- `moveRight(80);`
- `rotateLeft(90);`
- `rotateRight(90);`
- `wait(1);`
- `takeSample();`
- `takePhoto();`
- `if (droneIsAirborne) { ... }`
- `if (sensingColor("grey")) { ... }`
- `for (let i = 0; i < 3; i++) { ... }`

## Files

- `index.html` contains the page structure
- `styles.css` contains the visual design and responsive layout
- `app.js` contains the command parser, animation system, and canvas rendering

## Run Locally

1. Open `index.html` in a browser.
2. Choose `Field Trainee`, `Field Ecologist`, `Research Lead`, or `Senior Scientist`.
3. Pick a mission from that storyline.
4. Type drone commands into the editor.
5. Click `Run Program` to watch the drone move.

## Accounts

- Students can register and sign in to save mission completion.
- Students register with a student name, email, and password.
- Teachers sign in through the dedicated teacher login.
- Teachers only see the dashboard view and can manage student accounts from there.
- Account data is stored in browser local storage for this prototype.
- Default teacher login: `mg@buckleyparkco.vic.edu.au` / `password123`

## Teaching Ideas

- Ask students to compare how missions change across Field Trainee, Field Ecologist, Research Lead, and Senior Scientist.
- Challenge students to reach every survey point and still land back on the pad.
- Have students explain how the story context changes the code they write.
- Challenge students to avoid habitat buffers and no-fly zones.
- Have students debug broken code samples with missing semicolons or invalid commands.
- Extend the command set with loops or functions as a next lesson.
