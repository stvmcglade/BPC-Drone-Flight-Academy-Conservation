const canvas = document.querySelector("#simCanvas");
const ctx = canvas.getContext("2d");
const codeEditor = document.querySelector("#codeEditor");
const runButton = document.querySelector("#runButton");
const resetButton = document.querySelector("#resetButton");
const exampleButton = document.querySelector("#exampleButton");
const prevMissionButton = document.querySelector("#prevMissionButton");
const nextMissionButton = document.querySelector("#nextMissionButton");
const pathButtons = [...document.querySelectorAll(".path-button")];
const feedbackText = document.querySelector("#feedbackText");
const feedbackBadge = document.querySelector("#feedbackBadge");
const commandCount = document.querySelector("#commandCount");
const commandPreview = document.querySelector("#commandPreview");
const positionReadout = document.querySelector("#positionReadout");
const altitudeReadout = document.querySelector("#altitudeReadout");
const headingReadout = document.querySelector("#headingReadout");
const checkpointList = document.querySelector("#checkpointList");
const missionText = document.querySelector("#missionText");
const missionState = document.querySelector("#missionState");
const storyText = document.querySelector("#storyText");
const themeBadge = document.querySelector("#themeBadge");
const missionIndexBadge = document.querySelector("#missionIndexBadge");
const missionGoalBadge = document.querySelector("#missionGoalBadge");
const hudThemeReadout = document.querySelector("#hudThemeReadout");
const syntaxNote = document.querySelector("#syntaxNote");
const rankRequirementNote = document.querySelector("#rankRequirementNote");
const appShell = document.querySelector("#appShell");
const missionPanel = document.querySelector("#missionPanel");
const commandsPanel = document.querySelector("#commandsPanel");
const tipsPanel = document.querySelector("#tipsPanel");
const entryOverlay = document.querySelector("#entryOverlay");
const mainColumn = document.querySelector("#mainColumn");
const accountRoleBadge = document.querySelector("#accountRoleBadge");
const accountStatusText = document.querySelector("#accountStatusText");
const teacherAccountPanel = document.querySelector("#teacherAccountPanel");
const teacherPasswordInput = document.querySelector("#teacherPasswordInput");
const teacherPasswordButton = document.querySelector("#teacherPasswordButton");
const studentNameInput = document.querySelector("#studentNameInput");
const studentNameLabel = document.querySelector("#studentNameLabel");
const authEmail = document.querySelector("#authEmail");
const authPassword = document.querySelector("#authPassword");
const authSubmitButton = document.querySelector("#authSubmitButton");
const showLoginButton = document.querySelector("#showLoginButton");
const showRegisterButton = document.querySelector("#showRegisterButton");
const selectStudentButton = document.querySelector("#selectStudentButton");
const selectTeacherButton = document.querySelector("#selectTeacherButton");
const logoutButton = document.querySelector("#logoutButton");
const authFeedbackText = document.querySelector("#authFeedbackText");
const studentProgressPanel = document.querySelector("#studentProgressPanel");
const studentProgressBadge = document.querySelector("#studentProgressBadge");
const studentMissionSelect = document.querySelector("#studentMissionSelect");
const studentProgressList = document.querySelector("#studentProgressList");
const roleProgressPanel = document.querySelector("#roleProgressPanel");
const rankCertificatesPanel = document.querySelector("#rankCertificatesPanel");
const certificatePanel = document.querySelector("#certificatePanel");
const certificateStudentName = document.querySelector("#certificateStudentName");
const certificateDateText = document.querySelector("#certificateDateText");
const printCertificateButton = document.querySelector("#printCertificateButton");
const teacherPanel = document.querySelector("#teacherPanel");
const teacherSummaryBadge = document.querySelector("#teacherSummaryBadge");
const teacherStudentSelect = document.querySelector("#teacherStudentSelect");
const teacherDashboard = document.querySelector("#teacherDashboard");

const ACCOUNT_STORAGE_KEY = "drone-code-lab-accounts";
const SESSION_STORAGE_KEY = "drone-code-lab-session";
const DEFAULT_TEACHER_EMAIL = "mg@buckleyparkco.vic.edu.au";
const DEFAULT_TEACHER_PASSWORD = "password123";

const COMMANDS = new Set([
  "takeOff", "land", "moveUp", "moveDown", "moveLeft", "moveRight", "rotateLeft", "rotateRight", "wait", "takeSample", "takeLandSample", "takePhoto",
]);

const CAMPAIGNS = {
  cadet: {
    label: "Cadet",
    title: "Harbour Training Wing",
    droneColor: "#59d7ff",
    rotorColor: "#adf76f",
    sky: ["#153953", "#1d4d6e", "#163448", "#10263a"],
    missions: [
      {
        title: "Mission 1: First Lift",
        objective: "Take off, reach the first two beacons, then land back on the pad.",
        story: "Instructor Vega opens the hangar doors and asks you to prove the drone can follow a basic route.",
        goalLabel: "Beacon Warmup",
        launchPad: { x: 90, y: 458, width: 132, height: 58 },
        checkpoints: [
          { id: "n1-a", name: "Blue Beacon", x: 320, y: 355, radius: 22 },
          { id: "n1-b", name: "Bridge Beacon", x: 500, y: 265, radius: 22 },
        ],
        noFlyZones: [{ x: 620, y: 200, width: 120, height: 220, label: "Crane" }],
        decorations: [
          { type: "cloud", x: 170, y: 100, size: 0.9 },
          { type: "cloud", x: 710, y: 120, size: 1.1 },
          { type: "hangar", x: 745, y: 414, width: 145, height: 92 },
        ],
        example: `takeOff();
moveRight(140);
moveUp(110);
moveRight(180);
moveUp(90);
moveDown(180);
moveLeft(320);
land();`,
      },
      {
        title: "Mission 2: Dock Sweep",
        objective: "Sweep across three markers while steering around the stacked cargo zone.",
        story: "A delivery barge is arriving, so the drone must scan the harbour path without crossing the cargo stack.",
        goalLabel: "Dock Scan",
        launchPad: { x: 110, y: 430, width: 120, height: 54 },
        checkpoints: [
          { id: "n2-a", name: "Dock North", x: 250, y: 210, radius: 22 },
          { id: "n2-b", name: "Dock East", x: 520, y: 185, radius: 22 },
          { id: "n2-c", name: "Dock South", x: 640, y: 400, radius: 22 },
        ],
        noFlyZones: [
          { x: 320, y: 250, width: 150, height: 210, label: "Cargo" },
          { x: 720, y: 125, width: 110, height: 150, label: "Tower" },
        ],
        decorations: [
          { type: "cloud", x: 140, y: 126, size: 0.8 },
          { type: "cloud", x: 835, y: 90, size: 0.9 },
          { type: "ship", x: 720, y: 465, width: 150, height: 34 },
        ],
        example: `takeOff();
moveUp(210);
moveRight(140);
moveRight(240);
moveDown(210);
moveRight(120);
wait(1);
moveLeft(500);
land();`,
      },
      {
        title: "Mission 3: Signal Run",
        objective: "Collect four harbour signal points before returning to base.",
        story: "The lighthouse relay is being calibrated and the cadet drone must touch each signal buoy.",
        goalLabel: "Signal Net",
        launchPad: { x: 92, y: 444, width: 126, height: 56 },
        checkpoints: [
          { id: "n3-a", name: "Signal West", x: 230, y: 390, radius: 22 },
          { id: "n3-b", name: "Signal North", x: 360, y: 210, radius: 22 },
          { id: "n3-c", name: "Signal East", x: 610, y: 210, radius: 22 },
          { id: "n3-d", name: "Signal South", x: 770, y: 380, radius: 22 },
        ],
        noFlyZones: [
          { x: 300, y: 275, width: 120, height: 165, label: "Dock Crane" },
          { x: 660, y: 110, width: 105, height: 155, label: "Mast" },
        ],
        decorations: [
          { type: "cloud", x: 170, y: 90, size: 0.9 },
          { type: "ship", x: 700, y: 470, width: 160, height: 30 },
        ],
        example: `takeOff();
moveRight(138);
moveUp(54);
moveRight(130);
moveUp(180);
moveRight(250);
moveRight(160);
moveDown(170);
moveLeft(678);
moveDown(54);
land();`,
      },
      {
        title: "Mission 4: Graduation Run",
        objective: "Finish the full harbour route, hit every beacon, and return for a clean landing.",
        story: "The cadet badge is one flight away. Vega wants a full mission flown without drifting into restricted airspace.",
        goalLabel: "Final Circuit",
        launchPad: { x: 90, y: 445, width: 130, height: 58 },
        checkpoints: [
          { id: "n3-a", name: "Beacon One", x: 250, y: 360, radius: 22 },
          { id: "n3-b", name: "Beacon Two", x: 450, y: 170, radius: 22 },
          { id: "n3-c", name: "Beacon Three", x: 690, y: 260, radius: 22 },
          { id: "n3-d", name: "Beacon Four", x: 760, y: 430, radius: 22 },
        ],
        noFlyZones: [
          { x: 325, y: 235, width: 110, height: 210, label: "Crane" },
          { x: 560, y: 115, width: 110, height: 170, label: "Signal Mast" },
          { x: 820, y: 315, width: 90, height: 170, label: "Fuel Stack" },
        ],
        decorations: [
          { type: "cloud", x: 190, y: 100, size: 0.9 },
          { type: "cloud", x: 560, y: 78, size: 0.7 },
          { type: "cloud", x: 800, y: 126, size: 1.05 },
        ],
        example: `takeOff();
moveRight(160);
moveUp(95);
moveRight(200);
moveUp(190);
moveRight(240);
moveDown(90);
moveDown(170);
moveLeft(670);
land();`,
      },
    ],
  },
  second_officer: {
    label: "Second Officer",
    title: "Canyon Rescue Unit",
    droneColor: "#9fe7ff",
    rotorColor: "#e0ff7d",
    sky: ["#24384d", "#37556d", "#2c3f43", "#1b2c34"],
    missions: [
      {
        title: "Mission 1: Ridge Supply Drop",
        objective: "Fly from the canyon entrance to the field clinic, land on the grey rock patch to take a sample, then continue safely.",
        story: "Medic drones are needed at the ridge clinic before sunset, and command also wants a sample from the grey rock shelf.",
        goalLabel: "Clinic Route",
        sampleRequirements: [{ color: "grey", label: "Grey Rock Sample" }],
        launchPad: { x: 70, y: 420, width: 120, height: 54 },
        checkpoints: [
          { id: "c1-a", name: "Scout Post", x: 220, y: 305, radius: 22 },
          { id: "c1-b", name: "Clinic Roof", x: 610, y: 185, radius: 22 },
          { id: "c1-c", name: "Landing Marker", x: 810, y: 330, radius: 22 },
        ],
        noFlyZones: [
          { x: 250, y: 85, width: 120, height: 250, label: "Cliff A" },
          { x: 470, y: 250, width: 145, height: 220, label: "Cliff B" },
          { x: 710, y: 90, width: 110, height: 150, label: "Cliff C" },
        ],
        decorations: [
          { type: "mountain", x: 160, y: 470, width: 210, height: 120 },
          { type: "mountain", x: 625, y: 495, width: 250, height: 145 },
        ],
        example: `takeOff();
moveRight(90);
moveUp(95);
if (sensingColor("grey")) {
land();
takeSample();
takeOff();
moveRight(170);
moveUp(120);
moveRight(200);
moveDown(145);
moveLeft(460);
}
land();`,
      },
      {
        title: "Mission 2: Flood Survey",
        objective: "Map four flood markers, land on the blue patch to take a water sample, then lift off and finish the route.",
        story: "Storm water is rising through the lower canyon, and the rescue team needs a blue-channel water sample before the drone returns.",
        goalLabel: "Survey Sweep",
        sampleRequirements: [{ color: "blue", label: "Blue Water Sample" }],
        launchPad: { x: 130, y: 455, width: 126, height: 56 },
        checkpoints: [
          { id: "c2-a", name: "Marker A", x: 300, y: 390, radius: 22 },
          { id: "c2-b", name: "Marker B", x: 460, y: 220, radius: 22 },
          { id: "c2-c", name: "Marker C", x: 690, y: 210, radius: 22 },
          { id: "c2-d", name: "Marker D", x: 800, y: 390, radius: 22 },
        ],
        noFlyZones: [
          { x: 355, y: 265, width: 95, height: 205, label: "Rock Spire" },
          { x: 565, y: 115, width: 105, height: 210, label: "Rock Spire" },
        ],
        decorations: [
          { type: "river", x: 0, y: 470, width: 960, height: 90 },
          { type: "mountain", x: 90, y: 470, width: 160, height: 100 },
        ],
        example: `takeOff();
if (droneIsAirborne) {
moveRight(100);
moveUp(93);
moveUp(170);
moveRight(110);
moveRight(60);
land();
takeSample();
takeOff();
moveUp(120);
moveRight(167);
moveDown(110);
moveRight(110);
moveDown(180);
wait(1);
moveDown(93);
moveLeft(607);
}
land();`,
      },
      {
        title: "Mission 3: Rope Bridge Search",
        objective: "Scan the bridge route, land on the gold patch for a dust sample, then keep flying to the last checkpoint.",
        story: "A search team is moving below the canyon rim and wants both images and a gold dust sample from the bridge shelf.",
        goalLabel: "Bridge Search",
        sampleRequirements: [{ color: "gold", label: "Gold Dust Sample" }],
        launchPad: { x: 90, y: 430, width: 120, height: 54 },
        checkpoints: [
          { id: "c3-a", name: "West Ridge", x: 220, y: 350, radius: 22 },
          { id: "c3-b", name: "Bridge Span", x: 410, y: 205, radius: 22 },
          { id: "c3-c", name: "East Ridge", x: 640, y: 195, radius: 22 },
          { id: "c3-d", name: "Supply Camp", x: 790, y: 350, radius: 22 },
        ],
        noFlyZones: [
          { x: 280, y: 160, width: 95, height: 205, label: "Stone Pillar" },
          { x: 520, y: 250, width: 105, height: 180, label: "Ridge Wall" },
          { x: 720, y: 120, width: 100, height: 145, label: "Watch Cliff" },
        ],
        decorations: [
          { type: "mountain", x: 120, y: 500, width: 210, height: 130 },
          { type: "mountain", x: 650, y: 500, width: 210, height: 130 },
        ],
        example: `takeOff();
if (droneIsAirborne) {
moveRight(70);
moveUp(107);
moveUp(210);
moveRight(190);
moveDown(65);
moveRight(230);
moveDown(145);
moveRight(150);
land();
takeSample();
takeOff();
moveDown(107);
moveLeft(640);
}
land();`,
      },
      {
        title: "Mission 4: Night Rescue",
        objective: "Complete the canyon route in the dark, land on the grey patch for a rescue-site sample, and bring the drone home.",
        story: "A hiker beacon has started flashing after dark, and the team needs a grey rock sample from the rescue site too.",
        goalLabel: "Rescue Corridor",
        sampleRequirements: [{ color: "grey", label: "Rescue Site Sample" }],
        launchPad: { x: 90, y: 430, width: 120, height: 54 },
        checkpoints: [
          { id: "c3-a", name: "Beacon West", x: 245, y: 330, radius: 22 },
          { id: "c3-b", name: "Beacon North", x: 390, y: 165, radius: 22 },
          { id: "c3-c", name: "Beacon East", x: 640, y: 160, radius: 22 },
          { id: "c3-d", name: "Beacon South", x: 770, y: 345, radius: 22 },
        ],
        noFlyZones: [
          { x: 250, y: 105, width: 82, height: 170, label: "Pillar" },
          { x: 465, y: 205, width: 105, height: 215, label: "Rock Wall" },
          { x: 725, y: 125, width: 100, height: 150, label: "Cliff Edge" },
        ],
        decorations: [
          { type: "stars", density: 16 },
          { type: "mountain", x: 150, y: 500, width: 240, height: 130 },
          { type: "mountain", x: 660, y: 500, width: 240, height: 130 },
        ],
        example: `takeOff();
if (droneIsAirborne) {
moveRight(95);
moveUp(100);
land();
takeSample();
takeOff();
moveUp(270);
moveRight(145);
moveDown(78);
moveRight(250);
moveDown(180);
moveRight(130);
moveDown(112);
moveLeft(620);
}
land();`,
      },
    ],
  },
  first_officer: {
    label: "First Officer",
    title: "Skyport Relay Division",
    droneColor: "#b8efff",
    rotorColor: "#ffe880",
    sky: ["#2d3950", "#4b5f7f", "#544231", "#2b2731"],
    missions: [
      {
        title: "Mission 1: Relay Alignment",
        objective: "Touch three relay beacons, take a runway photo, land for a soil check, collect the blue relay sample, then return before the runway window closes.",
        story: "Skyport control needs a relay alignment check before the commuter drones launch, plus a photo of the runway marker, a land sample, and a blue relay sample from the runway edge.",
        goalLabel: "Relay Check",
        sampleRequirements: [{ color: "blue", label: "Blue Relay Sample", x: 547, y: 267, radius: 46 }],
        landSampleRequirements: [{ color: "brown", label: "Runway Soil Sample", x: 547, y: 267, radius: 46 }],
        photoRequirements: [{ label: "Runway Marker Photo", x: 547, y: 267, radius: 58 }],
        launchPad: { x: 90, y: 446, width: 124, height: 54 },
        checkpoints: [
          { id: "f1-a", name: "West Relay", x: 235, y: 330, radius: 22 },
          { id: "f1-b", name: "North Relay", x: 470, y: 160, radius: 22 },
          { id: "f1-c", name: "East Relay", x: 760, y: 315, radius: 22 },
        ],
        noFlyZones: [
          { x: 300, y: 220, width: 115, height: 200, label: "Tower Array" },
          { x: 610, y: 110, width: 105, height: 165, label: "Runway Mast" },
        ],
        decorations: [
          { type: "cloud", x: 200, y: 95, size: 0.85 },
          { type: "platform", x: 760, y: 468, width: 130, height: 26 },
        ],
        example: `takeOff();
moveRight(395);
moveUp(206);
takePhoto();
land();
takeSample();
takeLandSample();
takeOff();
for (let i = 0; i < 1; i++) {
wait(1);
}
moveRight(275);
moveDown(155);
moveLeft(670);
moveDown(51);
land();`,
      },
      {
        title: "Mission 2: Runway Window",
        objective: "Visit four runway sensors, take a photo of the sensor bridge, land on the grey patch for a surface sample, then keep the route moving.",
        story: "The runway sensors are drifting and first officers must clear the route in sequence while collecting a grey surface sample and photographing the bridge alignment.",
        goalLabel: "Sensor Weave",
        sampleRequirements: [{ color: "grey", label: "Grey Surface Sample", x: 452, y: 233, radius: 46 }],
        photoRequirements: [{ label: "Sensor Bridge Photo", x: 452, y: 233, radius: 58 }],
        launchPad: { x: 110, y: 445, width: 124, height: 56 },
        checkpoints: [
          { id: "f2-a", name: "Sensor A", x: 250, y: 390, radius: 22 },
          { id: "f2-b", name: "Sensor B", x: 390, y: 205, radius: 22 },
          { id: "f2-c", name: "Sensor C", x: 620, y: 205, radius: 22 },
          { id: "f2-d", name: "Sensor D", x: 820, y: 360, radius: 22 },
        ],
        noFlyZones: [
          { x: 280, y: 250, width: 90, height: 170, label: "Tower Shadow" },
          { x: 500, y: 120, width: 100, height: 180, label: "Tower Shadow" },
          { x: 710, y: 250, width: 95, height: 150, label: "Radar Column" },
        ],
        decorations: [
          { type: "cloud", x: 760, y: 110, size: 0.9 },
          { type: "hangar", x: 760, y: 420, width: 120, height: 86 },
        ],
        example: `takeOff();
for (let i = 0; i < 1; i++) {
wait(1);
}
moveRight(140);
moveUp(55);
moveRight(140);
moveUp(185);
takePhoto();
land();
takeSample();
takeOff();
moveRight(230);
moveRight(200);
moveDown(155);
moveLeft(710);
moveDown(70);
land();`,
      },
      {
        title: "Mission 3: Thermal Climb",
        objective: "Climb through the thermal corridor, photograph the heat shimmer, land for a tarmac sample, collect the gold heat sample, then return.",
        story: "Hot air over the tarmac is distorting readings and the route must be checked mid-climb, including a photo of the heat shimmer, a land sample, and a gold thermal sample.",
        goalLabel: "Thermal Corridor",
        sampleRequirements: [{ color: "gold", label: "Gold Heat Sample", x: 303, y: 328, radius: 46 }],
        landSampleRequirements: [{ color: "brown", label: "Tarmac Land Sample", x: 303, y: 328, radius: 46 }],
        photoRequirements: [{ label: "Heat Shimmer Photo", x: 303, y: 328, radius: 58 }],
        launchPad: { x: 85, y: 440, width: 125, height: 55 },
        checkpoints: [
          { id: "f3-a", name: "Node West", x: 240, y: 300, radius: 22 },
          { id: "f3-b", name: "Node Mid", x: 430, y: 145, radius: 22 },
          { id: "f3-c", name: "Node East", x: 675, y: 165, radius: 22 },
          { id: "f3-d", name: "Node South", x: 815, y: 345, radius: 22 },
        ],
        noFlyZones: [
          { x: 315, y: 170, width: 85, height: 205, label: "Hot Column" },
          { x: 540, y: 255, width: 115, height: 175, label: "Fuel Tower" },
          { x: 760, y: 125, width: 90, height: 145, label: "Signal Frame" },
        ],
        decorations: [
          { type: "cloud", x: 155, y: 85, size: 0.8 },
          { type: "cloud", x: 540, y: 78, size: 0.75 },
          { type: "platform", x: 735, y: 470, width: 145, height: 26 },
        ],
        example: `takeOff();
for (let i = 0; i < 1; i++) {
wait(1);
}
moveRight(155);
moveUp(140);
takePhoto();
land();
takeSample();
takeLandSample();
takeOff();
moveRight(190);
moveUp(155);
moveRight(245);
moveDown(20);
moveRight(140);
moveDown(180);
moveLeft(730);
moveDown(95);
land();`,
      },
      {
        title: "Mission 4: First Officer Trial",
        objective: "Complete the full skyport route, photograph the relay pillar, collect a blue sample mid-mission, and prove you are ready for command.",
        story: "Skyport control gives one final relay mission before promoting the student to captain training, and it includes a relay photo plus a blue sample pickup.",
        goalLabel: "Trial Flight",
        sampleRequirements: [{ color: "blue", label: "Blue Trial Sample", x: 623, y: 173, radius: 46 }],
        photoRequirements: [{ label: "Relay Pillar Photo", x: 623, y: 173, radius: 58 }],
        launchPad: { x: 92, y: 438, width: 126, height: 56 },
        checkpoints: [
          { id: "f4-a", name: "Point One", x: 210, y: 370, radius: 22 },
          { id: "f4-b", name: "Point Two", x: 365, y: 210, radius: 22 },
          { id: "f4-c", name: "Point Three", x: 560, y: 145, radius: 22 },
          { id: "f4-d", name: "Point Four", x: 740, y: 235, radius: 22 },
          { id: "f4-e", name: "Point Five", x: 835, y: 390, radius: 22 },
        ],
        noFlyZones: [
          { x: 250, y: 250, width: 85, height: 160, label: "Dock Tower" },
          { x: 455, y: 120, width: 90, height: 170, label: "Relay Pillar" },
          { x: 650, y: 270, width: 95, height: 120, label: "Radar Core" },
        ],
        decorations: [
          { type: "cloud", x: 205, y: 90, size: 0.85 },
          { type: "hangar", x: 760, y: 416, width: 130, height: 88 },
        ],
        example: `takeOff();
for (let i = 0; i < 1; i++) {
wait(1);
}
moveRight(118);
moveUp(68);
moveRight(155);
moveUp(160);
moveRight(195);
moveUp(65);
takePhoto();
land();
takeSample();
takeOff();
moveRight(180);
moveDown(90);
moveRight(95);
moveDown(155);
moveLeft(743);
moveDown(48);
land();`,
      },
    ],
  },
  captain: {
    label: "Captain",
    title: "Storm Frontier Command",
    droneColor: "#ffd7a8",
    rotorColor: "#ffef7b",
    sky: ["#311f43", "#56305e", "#442335", "#251628"],
    missions: [
      {
        title: "Mission 1: Storm Wall Entry",
        objective: "Cross the frontier gates, take a storm-front photo, land on the grey patch for a storm dust sample, then finish the tracker run and land at command.",
        story: "Lightning cells are moving in, and command needs live readings, a storm-front photo, and a grey storm dust sample before the route closes.",
        goalLabel: "Storm Trackers",
        sampleRequirements: [{ color: "grey", label: "Grey Storm Sample", x: 276, y: 383, radius: 46 }],
        photoRequirements: [{ label: "Storm Front Photo", x: 276, y: 383, radius: 58 }],
        launchPad: { x: 80, y: 445, width: 122, height: 56 },
        checkpoints: [
          { id: "e1-a", name: "Tracker One", x: 245, y: 230, radius: 22 },
          { id: "e1-b", name: "Tracker Two", x: 520, y: 180, radius: 22 },
          { id: "e1-c", name: "Tracker Three", x: 780, y: 320, radius: 22 },
        ],
        noFlyZones: [
          { x: 230, y: 300, width: 105, height: 180, label: "Storm Core" },
          { x: 470, y: 255, width: 135, height: 220, label: "Tower Field" },
          { x: 700, y: 95, width: 95, height: 150, label: "Lightning Mast" },
        ],
        decorations: [
          { type: "lightning", x: 180, y: 120 },
          { type: "lightning", x: 760, y: 100 },
          { type: "platform", x: 760, y: 455, width: 120, height: 28 },
        ],
        example: `takeOff();
moveRight(135);
moveUp(90);
takePhoto();
if (sensingColor("grey")) {
land();
takeSample();
takeOff();
for (let i = 0; i < 1; i++) {
wait(1);
}
moveUp(125);
moveRight(315);
moveUp(50);
moveRight(260);
moveDown(140);
moveLeft(710);
moveDown(125);
}
land();`,
      },
      {
        title: "Mission 2: Radio Maze",
        objective: "Navigate through a dense radio corridor, photograph the relay core, land for a ground sample, take the blue relay sample, then keep flying through the maze.",
        story: "A broken relay node is bouncing distress packets, and command wants a relay-core photo, a ground sample, and a blue relay sample while the drone is inside the maze.",
        goalLabel: "Relay Hover",
        sampleRequirements: [{ color: "blue", label: "Blue Relay Sample", x: 608, y: 268, radius: 46 }],
        landSampleRequirements: [{ color: "brown", label: "Relay Ground Sample", x: 608, y: 268, radius: 46 }],
        photoRequirements: [{ label: "Relay Core Photo", x: 608, y: 268, radius: 58 }],
        launchPad: { x: 115, y: 440, width: 125, height: 56 },
        checkpoints: [
          { id: "e2-a", name: "Relay West", x: 270, y: 365, radius: 22 },
          { id: "e2-b", name: "Relay North", x: 420, y: 165, radius: 22 },
          { id: "e2-c", name: "Relay Core", x: 630, y: 165, radius: 22 },
          { id: "e2-d", name: "Relay East", x: 825, y: 300, radius: 22 },
        ],
        noFlyZones: [
          { x: 305, y: 235, width: 90, height: 205, label: "Array A" },
          { x: 510, y: 95, width: 90, height: 215, label: "Array B" },
          { x: 695, y: 255, width: 95, height: 185, label: "Array C" },
        ],
        decorations: [
          { type: "stars", density: 22 },
          { type: "lightning", x: 560, y: 90 },
        ],
        example: `takeOff();
moveRight(430);
moveUp(200);
takePhoto();
if (sensingColor("blue")) {
land();
takeSample();
takeLandSample();
takeOff();
for (let i = 0; i < 1; i++) {
wait(1);
}
moveRight(210);
wait(1);
moveRight(195);
moveDown(135);
moveLeft(710);
moveDown(140);
}
land();`,
      },
      {
        title: "Mission 3: Thunder Corridor",
        objective: "Cross five command nodes, take a thunder-cell photo, land to collect a land reading, collect charged dust, then return alive.",
        story: "The weather wall is shifting and the captain must stitch together a route through the safest gap while photographing the thunder cell and collecting land and storm samples.",
        goalLabel: "Thunder Route",
        sampleRequirements: [{ color: "gold", label: "Gold Storm Sample", x: 422, y: 188, radius: 46 }],
        landSampleRequirements: [{ color: "brown", label: "Thunder Land Sample", x: 422, y: 188, radius: 46 }],
        photoRequirements: [{ label: "Thunder Cell Photo", x: 422, y: 188, radius: 58 }],
        launchPad: { x: 82, y: 440, width: 124, height: 56 },
        checkpoints: [
          { id: "e3-a", name: "Node West", x: 205, y: 350, radius: 22 },
          { id: "e3-b", name: "Node North", x: 360, y: 160, radius: 22 },
          { id: "e3-c", name: "Node Mid", x: 560, y: 140, radius: 22 },
          { id: "e3-d", name: "Node East", x: 740, y: 240, radius: 22 },
          { id: "e3-e", name: "Node South", x: 860, y: 390, radius: 22 },
        ],
        noFlyZones: [
          { x: 245, y: 200, width: 85, height: 205, label: "Cell A" },
          { x: 445, y: 100, width: 90, height: 175, label: "Cell B" },
          { x: 640, y: 225, width: 90, height: 160, label: "Cell C" },
          { x: 810, y: 145, width: 70, height: 140, label: "Cell D" },
        ],
        decorations: [
          { type: "stars", density: 28 },
          { type: "lightning", x: 220, y: 95 },
          { type: "lightning", x: 590, y: 100 },
        ],
        example: `takeOff();
if (droneIsAirborne) {
for (let i = 0; i < 1; i++) {
wait(1);
}
moveRight(123);
moveUp(90);
moveRight(155);
moveUp(190);
takePhoto();
land();
takeSample();
takeLandSample();
takeOff();
moveRight(200);
moveRight(180);
moveDown(100);
moveRight(120);
moveDown(150);
moveLeft(778);
moveDown(50);
}
land();`,
      },
      {
        title: "Mission 4: Command Finale",
        objective: "Complete the full captain route, capture a final object photo, collect a blue sample and land sample mid-mission, scan all frontier nodes, and finish with a precise landing.",
        story: "This is the final frontier exam. The storm front is closing and command only gets one clean run, including a final photo, a blue sample pickup, and a land sample.",
        goalLabel: "Frontier Final",
        sampleRequirements: [{ color: "blue", label: "Blue Frontier Sample", x: 466, y: 178, radius: 46 }],
        landSampleRequirements: [{ color: "brown", label: "Frontier Land Sample", x: 466, y: 178, radius: 46 }],
        photoRequirements: [{ label: "Frontier Object Photo", x: 466, y: 178, radius: 58 }],
        launchPad: { x: 80, y: 438, width: 122, height: 56 },
        checkpoints: [
          { id: "e3-a", name: "Node One", x: 220, y: 330, radius: 22 },
          { id: "e3-b", name: "Node Two", x: 405, y: 150, radius: 22 },
          { id: "e3-c", name: "Node Three", x: 610, y: 150, radius: 22 },
          { id: "e3-d", name: "Node Four", x: 760, y: 255, radius: 22 },
          { id: "e3-e", name: "Node Five", x: 850, y: 395, radius: 22 },
        ],
        noFlyZones: [
          { x: 240, y: 195, width: 90, height: 220, label: "Core A" },
          { x: 445, y: 85, width: 85, height: 180, label: "Core B" },
          { x: 635, y: 220, width: 90, height: 165, label: "Core C" },
          { x: 805, y: 170, width: 80, height: 130, label: "Core D" },
        ],
        decorations: [
          { type: "stars", density: 30 },
          { type: "lightning", x: 175, y: 90 },
          { type: "lightning", x: 470, y: 125 },
          { type: "lightning", x: 820, y: 85 },
        ],
        example: `takeOff();
if (droneIsAirborne) {
for (let i = 0; i < 1; i++) {
wait(1);
}
moveRight(140);
moveUp(108);
moveRight(185);
moveUp(180);
takePhoto();
land();
takeSample();
takeLandSample();
takeOff();
moveRight(205);
moveRight(150);
moveDown(105);
moveRight(90);
moveDown(140);
moveLeft(770);
moveDown(108);
}
land();`,
      },
    ],
  },
};

const state = {
  levelKey: "cadet",
  missionIndex: 0,
  drone: null,
  animationQueue: [],
  currentStep: null,
  lastTime: 0,
  playing: false,
  visitedCheckpoints: new Set(),
  collectedSamples: new Set(),
  collectedLandSamples: new Set(),
  capturedPhotos: new Set(),
  trail: [],
  currentMissionSuccess: false,
  accounts: {},
  currentUserEmail: "",
  authMode: "login",
  authKind: "student",
  selectedTeacherStudentEmail: "",
  selectedStudentMissionKey: "",
  audio: {
    context: null,
    humOscillator: null,
    humGain: null,
  },
  certificateLogo: null,
  certificateLogoPromise: null,
};

function getCampaign() {
  return CAMPAIGNS[state.levelKey];
}

function getCurrentAccount() {
  return state.currentUserEmail ? state.accounts[state.currentUserEmail] ?? null : null;
}

function isStudentUser() {
  return getCurrentAccount()?.role === "student";
}

function isTeacherUser() {
  return getCurrentAccount()?.role === "teacher";
}

function getMissionKey(levelKey = state.levelKey, missionIndex = state.missionIndex) {
  return `${levelKey}:${missionIndex}`;
}

function getAllMissionEntries() {
  return Object.entries(CAMPAIGNS).flatMap(([levelKey, campaign]) =>
    campaign.missions.map((mission, missionIndex) => ({
      missionKey: getMissionKey(levelKey, missionIndex),
      levelKey,
      levelLabel: campaign.label,
      missionIndex,
      missionTitle: mission.title,
    }))
  );
}

function findNextIncompleteMissionForCurrentStudent() {
  const account = getCurrentAccount();
  if (!account || account.role !== "student") {
    return { levelKey: "cadet", missionIndex: 0 };
  }
  const progress = ensureAccountProgress(account);
  const nextMission = getAllMissionEntries().find((entry) => !progress[entry.missionKey]?.completed);
  if (!nextMission) {
    const finalCampaignKey = Object.keys(CAMPAIGNS)[Object.keys(CAMPAIGNS).length - 1];
    const finalMissionIndex = CAMPAIGNS[finalCampaignKey].missions.length - 1;
    return { levelKey: finalCampaignKey, missionIndex: finalMissionIndex };
  }
  return { levelKey: nextMission.levelKey, missionIndex: nextMission.missionIndex };
}

function getMissionEntryFromKey(missionKey) {
  return getAllMissionEntries().find((entry) => entry.missionKey === missionKey) ?? null;
}

function getStudentUnlockedMissionKeys() {
  const missions = getAllMissionEntries();
  return new Set(missions.map((entry) => entry.missionKey));
}

function getStudentCompletionSummary(account = getCurrentAccount()) {
  const missions = getAllMissionEntries();
  if (!account || account.role !== "student") {
    return { missions, completedCount: 0, allComplete: false, latestCompletedAt: "" };
  }
  const progress = ensureAccountProgress(account);
  const completedEntries = missions.filter((entry) => progress[entry.missionKey]?.completed);
  const completedDates = completedEntries
    .map((entry) => progress[entry.missionKey]?.completedAt)
    .filter(Boolean)
    .sort();
  return {
    missions,
    completedCount: completedEntries.length,
    allComplete: completedEntries.length === missions.length && missions.length > 0,
    latestCompletedAt: completedDates[completedDates.length - 1] ?? "",
  };
}

function getCompletedRankCertificates(account = getCurrentAccount()) {
  if (!account || account.role !== "student") {
    return [];
  }
  const progress = ensureAccountProgress(account);
  return Object.entries(CAMPAIGNS).flatMap(([levelKey, campaign]) => {
    const missionKeys = campaign.missions.map((_mission, missionIndex) => getMissionKey(levelKey, missionIndex));
    const complete = missionKeys.every((missionKey) => progress[missionKey]?.completed);
    if (!complete) {
      return [];
    }
    const completedDates = missionKeys
      .map((missionKey) => progress[missionKey]?.completedAt)
      .filter(Boolean)
      .sort();
    return [{
      levelKey,
      levelLabel: campaign.label,
      awardedAt: completedDates[completedDates.length - 1] ?? "",
    }];
  });
}

function formatCertificateDate(value) {
  const date = value ? new Date(value) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  return safeDate.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ensureAccountProgress(account) {
  account.progress ??= {};
  return account.progress;
}

function getMission() {
  return getCampaign().missions[state.missionIndex];
}

function getInitialDrone() {
  const pad = getMission().launchPad;
  return {
    x: pad.x + pad.width / 2,
    y: pad.y + pad.height / 2,
    altitude: 0,
    heading: 0,
    airborne: false,
    sampleFlashMs: 0,
    photoFlashMs: 0,
    sampledTargets: new Set(),
    landSampledTargets: new Set(),
    photoTargets: new Set(),
  };
}

function loadAccounts() {
  try {
    state.accounts = JSON.parse(window.localStorage.getItem(ACCOUNT_STORAGE_KEY) ?? "{}");
  } catch (_error) {
    state.accounts = {};
  }
  state.accounts[DEFAULT_TEACHER_EMAIL] = {
    ...(state.accounts[DEFAULT_TEACHER_EMAIL] ?? {}),
    email: DEFAULT_TEACHER_EMAIL,
    password: DEFAULT_TEACHER_PASSWORD,
    role: "teacher",
    progress: state.accounts[DEFAULT_TEACHER_EMAIL]?.progress ?? {},
  };
  saveAccounts();
}

function saveAccounts() {
  window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(state.accounts));
}

function loadSession() {
  const savedEmail = window.localStorage.getItem(SESSION_STORAGE_KEY) ?? "";
  state.currentUserEmail = state.accounts[savedEmail] ? savedEmail : "";
}

function saveSession() {
  if (state.currentUserEmail) {
    window.localStorage.setItem(SESSION_STORAGE_KEY, state.currentUserEmail);
    return;
  }
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

function setAuthMode(mode) {
  state.authMode = mode;
  showLoginButton.classList.toggle("active", mode === "login");
  showRegisterButton.classList.toggle("active", mode === "register");
  authSubmitButton.textContent = mode === "login" ? "Sign In" : "Create Account";
  if (mode === "register") {
    state.authKind = "student";
  }
  refreshAuthControls();
}

function setAuthKind(kind) {
  state.authKind = kind;
  if (kind === "teacher") {
    state.authMode = "login";
  }
  refreshAuthControls();
}

function refreshAuthControls() {
  const registerMode = state.authMode === "register";
  const teacherKind = state.authKind === "teacher";
  showLoginButton.classList.toggle("active", !registerMode);
  showRegisterButton.classList.toggle("active", registerMode);
  selectStudentButton.classList.toggle("active", !teacherKind);
  selectTeacherButton.classList.toggle("active", teacherKind);
  showRegisterButton.disabled = teacherKind;
  studentNameInput.classList.toggle("hidden", !registerMode);
  studentNameLabel.classList.toggle("hidden", !registerMode);
  authSubmitButton.textContent = registerMode ? "Create Student Account" : "Sign In";
  authFeedbackText.textContent = registerMode
    ? "Create a student account with a student name, email, and password."
    : teacherKind
      ? `Teacher login: ${DEFAULT_TEACHER_EMAIL}`
      : "Use a saved student account to continue your missions.";
}

function refreshAuthUi() {
  const account = getCurrentAccount();
  const signedIn = Boolean(account);
  const teacherMode = isTeacherUser();
  const studentMode = isStudentUser();
  entryOverlay.classList.toggle("hidden", signedIn);
  appShell.classList.toggle("teacher-mode", teacherMode);
  appShell.classList.toggle("student-layout", studentMode);
  mainColumn.classList.toggle("hidden", teacherMode);
  missionPanel.classList.toggle("hidden", teacherMode);
  commandsPanel.classList.toggle("hidden", teacherMode);
  tipsPanel.classList.toggle("hidden", teacherMode);
  accountRoleBadge.textContent = signedIn ? (account.role === "teacher" ? "Teacher" : "Student") : "Signed out";
  accountRoleBadge.className = `chip ${signedIn ? "chip-good" : "chip-calm"}`;
  accountStatusText.textContent = !signedIn
    ? "Sign in as a student to save mission progress, or as a teacher to view class completion data."
    : account.role === "teacher"
      ? "Teacher dashboard is now available below."
      : `${account.name ?? account.email} is signed in. Mission completion will save automatically to this student account.`;
  logoutButton.classList.toggle("hidden", !signedIn);
  teacherAccountPanel.classList.toggle("hidden", !teacherMode);
  teacherPanel.classList.toggle("hidden", !isTeacherUser());
  studentProgressPanel.classList.toggle("hidden", !isStudentUser());
  renderStudentProgress();
  renderTeacherDashboard();
}

function refreshStudentWorkspace() {
  if (!isStudentUser()) {
    return;
  }
  appShell.classList.remove("teacher-mode");
  appShell.classList.add("student-layout");
  mainColumn.classList.remove("hidden");
  missionPanel.classList.remove("hidden");
  commandsPanel.classList.remove("hidden");
  tipsPanel.classList.remove("hidden");
  const nextMission = findNextIncompleteMissionForCurrentStudent();
  state.levelKey = nextMission.levelKey;
  state.missionIndex = nextMission.missionIndex;
  state.selectedStudentMissionKey = getMissionKey(nextMission.levelKey, nextMission.missionIndex);
  setTheme();
  loadMissionEditor();
  renderCommandPreview([]);
  resetDrone();
  renderMissionPanel();
  updateHud();
  drawScene(performance.now());
  requestAnimationFrame(() => {
    drawScene(performance.now());
  });
}

function resetSimulatorForAuthSwitch() {
  state.playing = false;
  state.animationQueue = [];
  state.currentStep = null;
  state.lastTime = 0;
  state.visitedCheckpoints = new Set();
  state.collectedSamples = new Set();
  state.collectedLandSamples = new Set();
  state.capturedPhotos = new Set();
  state.currentMissionSuccess = false;
  stopDroneHum();
  if (state.drone) {
    state.drone.sampleFlashMs = 0;
    state.drone.photoFlashMs = 0;
  }
}

function switchStudentMissionByKey(missionKey) {
  const missionEntry = getMissionEntryFromKey(missionKey);
  if (!missionEntry || !isStudentUser()) {
    return;
  }
  state.selectedStudentMissionKey = missionEntry.missionKey;
  state.levelKey = missionEntry.levelKey;
  state.missionIndex = missionEntry.missionIndex;
  setTheme();
  loadMissionEditor();
  renderCommandPreview([]);
  resetDrone();
  renderMissionPanel();
  updateHud();
  drawScene(performance.now());
  requestAnimationFrame(() => {
    drawScene(performance.now());
  });
  renderStudentProgress();
}

function handleAuthSubmit() {
  const email = authEmail.value.trim().toLowerCase();
  const password = authPassword.value.trim();
  const studentName = studentNameInput.value.trim();
  if (!email || !password) {
    authFeedbackText.textContent = "Enter both email and password.";
    return;
  }

  if (state.authMode === "register") {
    if (!studentName) {
      authFeedbackText.textContent = "Enter the student name before registering.";
      return;
    }
    if (state.accounts[email]) {
      authFeedbackText.textContent = "That email already has an account.";
      return;
    }
    state.accounts[email] = { email, password, role: "student", name: studentName, progress: {} };
    state.currentUserEmail = email;
    saveAccounts();
    saveSession();
    refreshAuthUi();
    refreshStudentWorkspace();
    authFeedbackText.textContent = "Account created and signed in.";
    return;
  }

  const account = state.accounts[email];
  if (!account || account.password !== password) {
    authFeedbackText.textContent = "Incorrect email or password.";
    return;
  }
  if (state.authKind === "teacher" && account.role !== "teacher") {
    authFeedbackText.textContent = "Use the teacher login for a teacher account.";
    return;
  }
  if (state.authKind === "student" && account.role !== "student") {
    authFeedbackText.textContent = "Use the student login for a student account.";
    return;
  }

  resetSimulatorForAuthSwitch();
  state.currentUserEmail = email;
  saveSession();
  refreshAuthUi();
  if (account.role === "student") {
    refreshStudentWorkspace();
  } else {
    resetDrone();
    drawScene(performance.now());
  }
  authFeedbackText.textContent = "Signed in successfully.";
}

function logoutCurrentUser() {
  resetSimulatorForAuthSwitch();
  state.currentUserEmail = "";
  state.authMode = "login";
  state.authKind = "student";
  saveSession();
  setAuthMode("login");
  setAuthKind("student");
  refreshAuthUi();
  authFeedbackText.textContent = "Signed out.";
}

function renderStudentProgress() {
  if (!isStudentUser()) {
    studentMissionSelect.innerHTML = "";
    studentProgressList.innerHTML = "";
    roleProgressPanel.innerHTML = "";
    rankCertificatesPanel.innerHTML = "";
    rankCertificatesPanel.classList.add("hidden");
    studentProgressBadge.textContent = "0 complete";
    certificatePanel.classList.add("hidden");
    return;
  }
  const account = getCurrentAccount();
  const progress = ensureAccountProgress(account);
  const summary = getStudentCompletionSummary(account);
  const rankCertificates = getCompletedRankCertificates(account);
  const missions = summary.missions;
  const completedCount = summary.completedCount;
  studentProgressBadge.textContent = `${completedCount} complete`;
  studentProgressBadge.className = `chip ${completedCount ? "chip-good" : "chip-calm"}`;
  roleProgressPanel.innerHTML = Object.entries(CAMPAIGNS).map(([levelKey, campaign]) => {
    const missionStars = campaign.missions.map((mission, missionIndex) => {
      const missionKey = getMissionKey(levelKey, missionIndex);
      const complete = Boolean(progress[missionKey]?.completed);
      return `<span class="mission-star ${complete ? "filled" : ""}" title="${mission.title}">${complete ? "★" : "☆"}</span>`;
    }).join("");
    const levelComplete = campaign.missions.every((mission, missionIndex) => progress[getMissionKey(levelKey, missionIndex)]?.completed);
    return `<div class="role-progress-row ${levelComplete ? "complete" : ""}">
      <div>
        <strong>${campaign.label}</strong>
        <div class="mission-stars">${missionStars}</div>
      </div>
      <span class="role-badge ${levelComplete ? "earned" : ""}">${levelComplete ? `${campaign.label} Badge` : "Badge locked"}</span>
    </div>`;
  }).join("");
  rankCertificatesPanel.classList.toggle("hidden", !rankCertificates.length);
  rankCertificatesPanel.innerHTML = rankCertificates.map((certificate) => `
    <div class="rank-certificate-card">
      <div>
        <strong>${certificate.levelLabel} Certificate</strong>
        <div>${certificate.awardedAt ? `Awarded on ${formatCertificateDate(certificate.awardedAt)}` : "Rank complete"}</div>
      </div>
      <button type="button" class="secondary-button rank-certificate-button" data-level-key="${certificate.levelKey}">Download PDF</button>
    </div>
  `).join("");
  if (!missions.some((entry) => entry.missionKey === state.selectedStudentMissionKey)) {
    state.selectedStudentMissionKey = missions[0]?.missionKey ?? "";
  }

  studentMissionSelect.innerHTML = missions.map((entry) => `
    <option
      value="${entry.missionKey}"
      ${entry.missionKey === state.selectedStudentMissionKey ? "selected" : ""}
    >
      ${entry.levelLabel} - ${entry.missionTitle}
    </option>
  `).join("");

  const selectedMission = missions.find((entry) => entry.missionKey === state.selectedStudentMissionKey) ?? missions[0];
  if (!selectedMission) {
    studentProgressList.innerHTML = "";
    return;
  }

  const complete = Boolean(progress[selectedMission.missionKey]?.completed);
  const completedAt = progress[selectedMission.missionKey]?.completedAt;
  const savedCode = progress[selectedMission.missionKey]?.code;
  const completeMessage = `Completed${completedAt ? ` on ${new Date(completedAt).toLocaleDateString()}` : ""}${savedCode ? ". Saved code will load in the editor." : ""}`;
  studentProgressList.innerHTML = `<div class="checkpoint-item ${complete ? "complete" : ""}"><div><strong>${selectedMission.levelLabel} - ${selectedMission.missionTitle}</strong><div>${complete ? completeMessage : "Ready to attempt"}</div></div><span class="chip ${complete ? "chip-good" : "chip-calm"}">${complete ? "Done" : "Available"}</span></div>`;

  certificatePanel.classList.toggle("hidden", !summary.allComplete);
  if (summary.allComplete) {
    certificateStudentName.textContent = account.name ?? account.email;
    certificateDateText.textContent = summary.latestCompletedAt
      ? `Awarded on ${formatCertificateDate(summary.latestCompletedAt)}`
      : "Awarded for completing all missions";
  }
}

function renderTeacherDashboard() {
  if (!isTeacherUser()) {
    teacherDashboard.innerHTML = "";
    teacherSummaryBadge.textContent = "0 students";
    teacherStudentSelect.innerHTML = "";
    return;
  }
  const students = Object.values(state.accounts).filter((account) => account.role === "student");
  teacherSummaryBadge.textContent = `${students.length} students`;
  teacherSummaryBadge.className = `chip ${students.length ? "chip-good" : "chip-calm"}`;
  if (!students.length) {
    teacherStudentSelect.innerHTML = `<option value="">No students available</option>`;
    teacherDashboard.innerHTML = `<div class="teacher-student-card"><strong>No student accounts yet</strong><span>Student progress will appear here after they register and complete missions.</span></div>`;
    return;
  }

  if (!students.some((student) => student.email === state.selectedTeacherStudentEmail)) {
    state.selectedTeacherStudentEmail = students[0].email;
  }

  teacherStudentSelect.innerHTML = students.map((student) => `
    <option value="${student.email}" ${student.email === state.selectedTeacherStudentEmail ? "selected" : ""}>
      ${student.name ?? student.email}
    </option>
  `).join("");

  const student = students.find((entry) => entry.email === state.selectedTeacherStudentEmail) ?? students[0];
  const missions = getAllMissionEntries();
  const progress = ensureAccountProgress(student);
  const completedCount = missions.filter((entry) => progress[entry.missionKey]?.completed).length;
  const missionGraphRows = missions.map((entry) => {
    const completionCount = students.filter((studentAccount) => {
      const studentProgress = ensureAccountProgress(studentAccount);
      return Boolean(studentProgress[entry.missionKey]?.completed);
    }).length;
    const completionPercent = students.length ? (completionCount / students.length) * 100 : 0;
    return `
      <div class="teacher-graph-row">
        <div class="teacher-graph-header">
          <span>${entry.levelLabel} - Mission ${entry.missionIndex + 1}</span>
          <span>${completionCount}/${students.length}</span>
        </div>
        <div class="teacher-graph-track">
          <div class="teacher-graph-bar" style="width: ${completionPercent}%;"></div>
        </div>
      </div>`;
  }).join("");
  const missionRows = missions.map((entry) => {
    const complete = Boolean(progress[entry.missionKey]?.completed);
    return `<div class="teacher-mission-row"><span>${entry.levelLabel} - Mission ${entry.missionIndex + 1}</span><span>${complete ? "Complete" : "Pending"}</span></div>`;
  }).join("");
  teacherDashboard.innerHTML = `
    <div class="teacher-student-card">
      <strong>${student.name ?? student.email}</strong>
      <div class="teacher-summary-lines">
        <span>${student.email}</span>
        <span>${completedCount} / ${missions.length} missions complete</span>
      </div>
      ${missionRows}
      <div class="teacher-account-actions">
        <label class="field-label" for="reset-${sanitizeId(student.email)}">New Password</label>
        <input id="reset-${sanitizeId(student.email)}" data-email="${student.email}" class="teacher-password-input" type="text" placeholder="Enter new password">
        <div class="teacher-action-row">
          <button type="button" class="secondary-button teacher-reset-button" data-email="${student.email}">Change Password</button>
          <button type="button" class="danger-button teacher-delete-button" data-email="${student.email}">Delete User</button>
        </div>
      </div>
      <div class="teacher-graph-card">
        <strong>Mission Completion Graph</strong>
        <div class="teacher-summary-lines">
          <span>Bar graph showing how many students have completed each mission.</span>
        </div>
        <div class="teacher-graph">
          ${missionGraphRows}
        </div>
      </div>
    </div>`;

  teacherDashboard.querySelectorAll(".teacher-reset-button").forEach((button) => {
    button.addEventListener("click", () => changeStudentPassword(button.dataset.email));
  });
  teacherDashboard.querySelectorAll(".teacher-delete-button").forEach((button) => {
    button.addEventListener("click", () => deleteStudentAccount(button.dataset.email));
  });
}

function sanitizeId(value) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function changeTeacherPassword() {
  if (!isTeacherUser()) {
    return;
  }
  const teacherAccount = getCurrentAccount();
  if (!teacherAccount) {
    return;
  }
  const nextPassword = teacherPasswordInput?.value.trim() ?? "";
  if (!nextPassword) {
    authFeedbackText.textContent = "Enter a new teacher password before changing it.";
    return;
  }
  teacherAccount.password = nextPassword;
  saveAccounts();
  authFeedbackText.textContent = "Teacher password updated.";
  if (teacherPasswordInput) {
    teacherPasswordInput.value = "";
  }
  renderTeacherDashboard();
}

function changeStudentPassword(email) {
  if (!isTeacherUser() || !email || !state.accounts[email] || state.accounts[email].role !== "student") {
    return;
  }
  const input = teacherDashboard.querySelector(`#reset-${sanitizeId(email)}`);
  const nextPassword = input?.value.trim() ?? "";
  if (!nextPassword) {
    authFeedbackText.textContent = "Enter a new password before changing it.";
    return;
  }
  state.accounts[email].password = nextPassword;
  saveAccounts();
  authFeedbackText.textContent = `Password updated for ${email}.`;
  if (input) {
    input.value = "";
  }
  renderTeacherDashboard();
}

function deleteStudentAccount(email) {
  if (!isTeacherUser() || !email || !state.accounts[email] || state.accounts[email].role !== "student") {
    return;
  }
  delete state.accounts[email];
  if (state.selectedTeacherStudentEmail === email) {
    state.selectedTeacherStudentEmail = "";
  }
  saveAccounts();
  authFeedbackText.textContent = `Deleted student account ${email}.`;
  renderTeacherDashboard();
}

function recordMissionCompletion() {
  if (!isStudentUser()) {
    return;
  }
  const account = getCurrentAccount();
  const progress = ensureAccountProgress(account);
  progress[getMissionKey()] = {
    completed: true,
    completedAt: new Date().toISOString(),
    levelKey: state.levelKey,
    missionIndex: state.missionIndex,
    code: codeEditor.value,
  };
  saveAccounts();
  renderStudentProgress();
  renderTeacherDashboard();
}

function setTheme() {
  const campaign = getCampaign();
  document.body.dataset.theme = state.levelKey;
  themeBadge.textContent = campaign.label;
  hudThemeReadout.textContent = campaign.label;
  pathButtons.forEach((button) => button.classList.toggle("active", button.dataset.level === state.levelKey));
  syntaxNote.textContent = "The editor accepts one command per line. Distances are in pixels, rotations are in degrees, and blocks use { and }.";
  rankRequirementNote.textContent = getRankRequirementText();
}

function getRankRequirementText() {
  if (state.levelKey === "second_officer") {
    return "If statements are optional here. You can use colour sensing such as if (sensingColor(\"grey\")) { ... } when it helps your plan.";
  }
  if (state.levelKey === "first_officer") {
    return "Loops are optional here. They can help repeat moves, such as for (let i = 0; i < 3; i++) { ... }.";
  }
  if (state.levelKey === "captain") {
    return "If statements and loops are both available if you want them, but Captain missions can still be solved without either one.";
  }
  return "Direct commands work for every mission. If statements and loops are optional tools you can use at any rank.";
}

function getMissionColorZones() {
  if (getMission().colorZones) {
    return getMission().colorZones;
  }
  return [
    { color: "grey", label: "Grey Rock", x: 215, y: 330, width: 120, height: 85, fill: "rgba(170, 180, 191, 0.32)", stroke: "#b8c1ca" },
    { color: "blue", label: "Blue Tile", x: 485, y: 155, width: 120, height: 85, fill: "rgba(89, 215, 255, 0.24)", stroke: "#72dfff" },
    { color: "gold", label: "Gold Tile", x: 735, y: 345, width: 120, height: 85, fill: "rgba(255, 215, 140, 0.24)", stroke: "#ffd78c" },
  ];
}

function isExampleAvailableForMission() {
  return state.missionIndex === 0;
}

function refreshExampleButton() {
  const exampleAvailable = isExampleAvailableForMission();
  exampleButton.classList.toggle("hidden", !exampleAvailable);
  exampleButton.disabled = !exampleAvailable;
}

function getSavedMissionCode() {
  if (!isStudentUser()) {
    return "";
  }
  const account = getCurrentAccount();
  const progress = ensureAccountProgress(account);
  return progress[getMissionKey()]?.code ?? "";
}

function loadMissionEditor(exampleOverride) {
  if (exampleOverride !== undefined) {
    codeEditor.value = exampleOverride;
    refreshExampleButton();
    return;
  }
  const savedCode = getSavedMissionCode();
  codeEditor.value = savedCode || (isExampleAvailableForMission() ? getMission().example : "");
  refreshExampleButton();
}

async function loadCertificateLogo() {
  if (state.certificateLogo?.complete && state.certificateLogo.naturalWidth > 0) {
    return state.certificateLogo;
  }
  if (!state.certificateLogoPromise) {
    state.certificateLogoPromise = new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        state.certificateLogo = image;
        resolve(image);
      };
      image.onerror = () => {
        state.certificateLogoPromise = null;
        reject(new Error("The Buckley Park College logo could not be loaded."));
      };
      image.src = "BPC-logo-WordMarkWHITEcond.png";
    });
  }
  return state.certificateLogoPromise;
}

function buildRankCertificateCanvas(studentName, levelLabel, awardDate, logoImage) {
  const certificateCanvas = document.createElement("canvas");
  certificateCanvas.width = 1600;
  certificateCanvas.height = 1131;
  const certificateContext = certificateCanvas.getContext("2d");

  certificateContext.fillStyle = "#f7f1e4";
  certificateContext.fillRect(0, 0, certificateCanvas.width, certificateCanvas.height);

  certificateContext.fillStyle = "#163d66";
  certificateContext.fillRect(70, 70, certificateCanvas.width - 140, 190);
  certificateContext.fillStyle = "#245b90";
  certificateContext.fillRect(70, 244, certificateCanvas.width - 140, 16);

  certificateContext.strokeStyle = "#163d66";
  certificateContext.lineWidth = 8;
  certificateContext.strokeRect(52, 52, certificateCanvas.width - 104, certificateCanvas.height - 104);
  certificateContext.strokeStyle = "#c8a95d";
  certificateContext.lineWidth = 3;
  certificateContext.strokeRect(82, 82, certificateCanvas.width - 164, certificateCanvas.height - 164);

  if (logoImage?.naturalWidth) {
    const logoWidth = 620;
    const logoHeight = (logoImage.naturalHeight / logoImage.naturalWidth) * logoWidth;
    certificateContext.drawImage(
      logoImage,
      (certificateCanvas.width - logoWidth) / 2,
      100,
      logoWidth,
      logoHeight
    );
  } else {
    certificateContext.fillStyle = "#ffffff";
    certificateContext.font = "700 52px 'Space Grotesk', sans-serif";
    certificateContext.textAlign = "center";
    certificateContext.fillText("Buckley Park College", certificateCanvas.width / 2, 165);
  }

  certificateContext.fillStyle = "#163d66";
  certificateContext.textAlign = "center";
  certificateContext.font = "700 70px 'Space Grotesk', sans-serif";
  certificateContext.fillText("Certificate of Rank Achievement", certificateCanvas.width / 2, 385);

  certificateContext.fillStyle = "#8b6a2a";
  certificateContext.font = "600 28px 'Chakra Petch', sans-serif";
  certificateContext.fillText("Presented to", certificateCanvas.width / 2, 470);

  certificateContext.fillStyle = "#112b45";
  certificateContext.font = "700 84px 'Space Grotesk', sans-serif";
  certificateContext.fillText(studentName, certificateCanvas.width / 2, 575);

  certificateContext.strokeStyle = "#c8a95d";
  certificateContext.lineWidth = 4;
  certificateContext.beginPath();
  certificateContext.moveTo(330, 612);
  certificateContext.lineTo(certificateCanvas.width - 330, 612);
  certificateContext.stroke();

  certificateContext.fillStyle = "#31485e";
  certificateContext.font = "500 34px 'Space Grotesk', sans-serif";
  certificateContext.fillText("for successfully completing the rank of", certificateCanvas.width / 2, 700);

  certificateContext.fillStyle = "#1c5c92";
  certificateContext.font = "700 64px 'Chakra Petch', sans-serif";
  certificateContext.fillText(levelLabel, certificateCanvas.width / 2, 790);

  certificateContext.fillStyle = "#31485e";
  certificateContext.font = "600 28px 'Space Grotesk', sans-serif";
  certificateContext.fillText(`Awarded on ${awardDate}`, certificateCanvas.width / 2, 875);

  certificateContext.fillStyle = "#163d66";
  certificateContext.fillRect(245, 934, 1110, 2);
  certificateContext.font = "700 24px 'Space Grotesk', sans-serif";
  certificateContext.fillText("Buckley Park College Flight School", certificateCanvas.width / 2, 980);
  certificateContext.font = "500 24px 'Space Grotesk', sans-serif";
  certificateContext.fillText("Drone Programming Mission Certificate", certificateCanvas.width / 2, 1022);

  return certificateCanvas;
}

function encodePdfBytes(text) {
  return new TextEncoder().encode(text);
}

function joinPdfBytes(parts) {
  const totalLength = parts.reduce((sum, part) => sum + part.length, 0);
  const joined = new Uint8Array(totalLength);
  let offset = 0;
  parts.forEach((part) => {
    joined.set(part, offset);
    offset += part.length;
  });
  return joined;
}

function dataUrlToUint8Array(dataUrl) {
  const base64Payload = dataUrl.split(",")[1] ?? "";
  const binary = window.atob(base64Payload);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function buildImagePdf(jpegBytes, imageWidth, imageHeight) {
  const pageWidth = 841.89;
  const pageHeight = 595.28;
  const contentStream = encodePdfBytes(`q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Im0 Do\nQ`);
  const objects = [
    encodePdfBytes("<< /Type /Catalog /Pages 2 0 R >>"),
    encodePdfBytes("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"),
    encodePdfBytes(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`),
    joinPdfBytes([
      encodePdfBytes(`<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`),
      jpegBytes,
      encodePdfBytes("\nendstream"),
    ]),
    joinPdfBytes([
      encodePdfBytes(`<< /Length ${contentStream.length} >>\nstream\n`),
      contentStream,
      encodePdfBytes("\nendstream"),
    ]),
  ];

  const header = encodePdfBytes("%PDF-1.4\n%Codex\n");
  const offsets = [0];
  const parts = [header];
  let currentOffset = header.length;

  objects.forEach((objectBytes, index) => {
    const objectNumber = index + 1;
    const wrappedObject = joinPdfBytes([
      encodePdfBytes(`${objectNumber} 0 obj\n`),
      objectBytes,
      encodePdfBytes("\nendobj\n"),
    ]);
    offsets[objectNumber] = currentOffset;
    parts.push(wrappedObject);
    currentOffset += wrappedObject.length;
  });

  const xrefOffset = currentOffset;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index <= objects.length; index += 1) {
    xref += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  xref += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  parts.push(encodePdfBytes(xref));

  return new Blob(parts, { type: "application/pdf" });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function downloadRankCertificate(levelKey) {
  if (!isStudentUser()) {
    return;
  }
  const account = getCurrentAccount();
  const rankCertificate = getCompletedRankCertificates(account).find((certificate) => certificate.levelKey === levelKey);
  if (!rankCertificate) {
    updateFeedback("Complete the full rank before downloading its certificate.", "Not Ready", "chip-warn");
    return;
  }
  const studentName = account.name ?? account.email;
  const awardDate = formatCertificateDate(rankCertificate.awardedAt);
  const logoImage = await loadCertificateLogo().catch(() => null);
  const certificateCanvas = buildRankCertificateCanvas(studentName, rankCertificate.levelLabel, awardDate, logoImage);
  const jpegUrl = certificateCanvas.toDataURL("image/jpeg", 0.94);
  const jpegBytes = dataUrlToUint8Array(jpegUrl);
  const pdfBlob = buildImagePdf(jpegBytes, certificateCanvas.width, certificateCanvas.height);
  const safeName = studentName.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "") || "student";
  const safeRank = rankCertificate.levelLabel.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
  downloadBlob(pdfBlob, `${safeName}-${safeRank}-certificate.pdf`);
  updateFeedback(`${rankCertificate.levelLabel} certificate downloaded as PDF.`, "Certificate", "chip-good");
}

function updateFeedback(message, badgeText, badgeClass) {
  feedbackText.textContent = message;
  feedbackBadge.textContent = badgeText;
  feedbackBadge.className = `chip ${badgeClass}`;
}

function getAudioContext() {
  if (!state.audio.context) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    state.audio.context = new AudioContextClass();
  }
  if (state.audio.context.state === "suspended") {
    state.audio.context.resume();
  }
  return state.audio.context;
}

function playSuccessTone(kind = "objective") {
  const audioContext = getAudioContext();
  if (!audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;
  const frequency = kind === "mission" ? 880 : kind === "photo" ? 760 : 620;
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.35, now + 0.16);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(kind === "mission" ? 0.11 : 0.075, now + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.38);
}

function startDroneHum() {
  const audioContext = getAudioContext();
  if (!audioContext || state.audio.humOscillator) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;
  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(72, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.006, now + 0.35);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(now);
  state.audio.humOscillator = oscillator;
  state.audio.humGain = gain;
}

function stopDroneHum() {
  if (!state.audio.humOscillator || !state.audio.context) return;
  const now = state.audio.context.currentTime;
  state.audio.humGain.gain.cancelScheduledValues(now);
  state.audio.humGain.gain.setValueAtTime(state.audio.humGain.gain.value, now);
  state.audio.humGain.gain.linearRampToValueAtTime(0.0001, now + 0.25);
  state.audio.humOscillator.stop(now + 0.28);
  state.audio.humOscillator = null;
  state.audio.humGain = null;
}

function updateHud() {
  positionReadout.textContent = `x: ${Math.round(state.drone.x)}, y: ${Math.round(state.drone.y)}`;
  altitudeReadout.textContent = `${state.drone.altitude.toFixed(1)} m`;
  headingReadout.textContent = `${normalizeDegrees(state.drone.heading)} deg`;
}

function renderMissionPanel() {
  const campaign = getCampaign();
  const mission = getMission();
  const allVisited = mission.checkpoints.every((checkpoint) => state.visitedCheckpoints.has(checkpoint.id));
  const sampleRequirements = mission.sampleRequirements ?? [];
  const landSampleRequirements = mission.landSampleRequirements ?? [];
  const photoRequirements = mission.photoRequirements ?? [];
  const allSamplesComplete = sampleRequirements.every((sample) => state.collectedSamples.has(sample.label));
  const allLandSamplesComplete = landSampleRequirements.every((sample) => state.collectedLandSamples.has(sample.label));
  const allPhotosComplete = photoRequirements.every((photo) => state.capturedPhotos.has(photo.label));
  storyText.textContent = `${campaign.title}: ${mission.story}`;
  missionText.textContent = mission.objective;
  missionIndexBadge.textContent = `Mission ${state.missionIndex + 1} of ${campaign.missions.length}`;
  missionGoalBadge.textContent = mission.goalLabel;
  prevMissionButton.disabled = state.missionIndex === 0;
  nextMissionButton.disabled = state.missionIndex === campaign.missions.length - 1;
  const checkpointHtml = mission.checkpoints.map((checkpoint) => {
    const complete = state.visitedCheckpoints.has(checkpoint.id);
    return `<div class="checkpoint-item ${complete ? "complete" : ""}"><div><strong>${checkpoint.name}</strong><div>${complete ? "Reached by drone" : "Pending objective"}</div></div><span class="chip ${complete ? "chip-good" : "chip-calm"}">${complete ? "Done" : "Pending"}</span></div>`;
  }).join("");
  const sampleHtml = sampleRequirements.map((sample) => {
    const complete = state.collectedSamples.has(sample.label);
    return `<div class="checkpoint-item ${complete ? "complete" : ""}"><div><strong>${sample.label}</strong><div>${complete ? `Collected from ${sample.color} patch` : `Land on the ${sample.color} patch and use takeSample();`}</div></div><span class="chip ${complete ? "chip-good" : "chip-calm"}">${complete ? "Sampled" : "Pending"}</span></div>`;
  }).join("");
  const landSampleHtml = landSampleRequirements.map((sample) => {
    const complete = state.collectedLandSamples.has(sample.label);
    return `<div class="checkpoint-item ${complete ? "complete" : ""}"><div><strong>${sample.label}</strong><div>${complete ? `Land sample collected from ${sample.color} patch` : `Land on the ${sample.color} patch and use takeLandSample();`}</div></div><span class="chip ${complete ? "chip-good" : "chip-calm"}">${complete ? "Sampled" : "Pending"}</span></div>`;
  }).join("");
  const photoHtml = photoRequirements.map((photo) => {
    const complete = state.capturedPhotos.has(photo.label);
    return `<div class="checkpoint-item ${complete ? "complete" : ""}"><div><strong>${photo.label}</strong><div>${complete ? "Photo captured" : "Hover near the camera target and use takePhoto();"}</div></div><span class="chip ${complete ? "chip-good" : "chip-calm"}">${complete ? "Photo" : "Pending"}</span></div>`;
  }).join("");
  checkpointList.innerHTML = checkpointHtml + sampleHtml + landSampleHtml + photoHtml;

  if (state.playing) {
    missionState.textContent = "Flying";
    missionState.className = "chip chip-warn";
  } else if (state.currentMissionSuccess && allVisited && allSamplesComplete && allLandSamplesComplete && allPhotosComplete) {
    missionState.textContent = "Complete";
    missionState.className = "chip chip-good";
  } else {
    missionState.textContent = "Waiting";
    missionState.className = "chip chip-calm";
  }
}

function renderCommandPreview(commands) {
  if (!commandCount || !commandPreview) {
    return;
  }
  commandCount.textContent = `${commands.length} command${commands.length === 1 ? "" : "s"}`;
  commandPreview.innerHTML = commands.map((command, index) => `<li>${index + 1}. ${command.name}(${command.value ?? ""})</li>`).join("");
}

function resetDrone() {
  state.drone = getInitialDrone();
  state.animationQueue = [];
  state.currentStep = null;
  state.lastTime = 0;
  state.playing = false;
  state.visitedCheckpoints = new Set();
  state.collectedSamples = new Set();
  state.collectedLandSamples = new Set();
  state.capturedPhotos = new Set();
  state.trail = [{ x: state.drone.x, y: state.drone.y }];
  state.currentMissionSuccess = false;
  stopDroneHum();
  updateHud();
  renderMissionPanel();
  updateFeedback("Drone reset. Run the mission program when you're ready.", "Ready", "chip-calm");
}

function applyLevel(levelKey) {
  state.levelKey = levelKey;
  state.missionIndex = 0;
  state.selectedStudentMissionKey = getMissionKey(state.levelKey, state.missionIndex);
  setTheme();
  loadMissionEditor();
  renderCommandPreview([]);
  resetDrone();
}

function loadMission(index) {
  const nextIndex = clamp(index, 0, getCampaign().missions.length - 1);
  state.missionIndex = nextIndex;
  state.selectedStudentMissionKey = getMissionKey(state.levelKey, state.missionIndex);
  loadMissionEditor();
  renderCommandPreview([]);
  resetDrone();
}

function parseProgram(source) {
  const lines = source.split(/\r?\n/);
  const parsed = parseBlock(lines, 0, false);
  const commands = expandNodes(parsed.nodes, getInitialDrone());
  if (!commands.length) throw new Error("Add at least one command before running the mission.");
  return { commands, meta: parsed.meta };
}

function parseBlock(lines, startIndex, stopOnBrace) {
  const nodes = [];
  const meta = { usedIf: false, usedLoop: false };
  let index = startIndex;

  while (index < lines.length) {
    const rawLine = lines[index].trim();
    if (!rawLine || rawLine.startsWith("//")) {
      index += 1;
      continue;
    }

    if (rawLine === "}") {
      if (!stopOnBrace) {
        throw new Error(`Line ${index + 1}: unexpected closing brace.`);
      }
      return { nodes, meta, nextIndex: index + 1 };
    }

    const ifMatch = rawLine.match(/^if\s*\((.+)\)\s*\{\s*$/);
    if (ifMatch) {
      const inner = parseBlock(lines, index + 1, true);
      nodes.push({ type: "if", condition: ifMatch[1].trim(), body: inner.nodes, line: index + 1 });
      meta.usedIf = true;
      meta.usedIf ||= inner.meta.usedIf;
      meta.usedLoop ||= inner.meta.usedLoop;
      index = inner.nextIndex;
      continue;
    }

    const loopMatch = rawLine.match(/^for\s*\(\s*let\s+([a-zA-Z_$][\w$]*)\s*=\s*0\s*;\s*\1\s*<\s*(\d+)\s*;\s*\1\+\+\s*\)\s*\{\s*$/);
    if (loopMatch) {
      const repetitions = Number(loopMatch[2]);
      if (!Number.isFinite(repetitions) || repetitions <= 0 || repetitions > 12) {
        throw new Error(`Line ${index + 1}: loop counts must be between 1 and 12.`);
      }
      const inner = parseBlock(lines, index + 1, true);
      nodes.push({ type: "loop", count: repetitions, body: inner.nodes, line: index + 1 });
      meta.usedLoop = true;
      meta.usedIf ||= inner.meta.usedIf;
      meta.usedLoop ||= inner.meta.usedLoop;
      index = inner.nextIndex;
      continue;
    }

    nodes.push(parseCommandLine(rawLine, index + 1));
    index += 1;
  }

  if (stopOnBrace) {
    throw new Error("A control block is missing its closing brace.");
  }

  return { nodes, meta, nextIndex: index };
}

function parseCommandLine(rawLine, lineNumber) {
  const match = rawLine.match(/^([a-zA-Z][a-zA-Z0-9]*)\s*\(([^)]*)\)\s*;\s*$/);
  if (!match) throw new Error(`Line ${lineNumber}: use commandName(value); with a semicolon at the end.`);
  const [, name, rawArg] = match;
  if (!COMMANDS.has(name)) throw new Error(`Line ${lineNumber}: "${name}" is not a supported command.`);
  const trimmedArg = rawArg.trim();
  const needsValue = !["takeOff", "land", "takeSample", "takeLandSample", "takePhoto"].includes(name);
  if (!needsValue && trimmedArg) throw new Error(`Line ${lineNumber}: ${name}() does not take a value.`);
  if (needsValue && !trimmedArg) throw new Error(`Line ${lineNumber}: ${name} needs a positive number.`);
  let value = null;
  if (needsValue) {
    value = Number(trimmedArg);
    if (!Number.isFinite(value) || value <= 0) throw new Error(`Line ${lineNumber}: ${name} needs a positive number.`);
  }
  return { type: "command", name, value, line: lineNumber };
}

function expandNodes(nodes, previewDrone) {
  const commands = [];
  for (const node of nodes) {
    if (node.type === "command") {
      validateCommandAgainstState(node, previewDrone);
      commands.push({ name: node.name, value: node.value, line: node.line });
      continue;
    }
    if (node.type === "if") {
      if (evaluateCondition(node.condition, previewDrone, node.line)) {
        commands.push(...expandNodes(node.body, previewDrone));
      }
      continue;
    }
    if (node.type === "loop") {
      for (let index = 0; index < node.count; index += 1) {
        commands.push(...expandNodes(node.body, previewDrone));
      }
    }
  }
  return commands;
}

function evaluateCondition(condition, previewDrone, line) {
  if (condition === "true") return true;
  if (condition === "false") return false;
  if (condition === "droneIsAirborne") return previewDrone.airborne;
  if (condition === "!droneIsAirborne") return !previewDrone.airborne;
  const sensingMatch = condition.match(/^sensingColor\(\s*["']([a-zA-Z]+)["']\s*\)$/);
  if (sensingMatch) {
    return getSensedColor(previewDrone.x, previewDrone.y) === sensingMatch[1].toLowerCase();
  }
  const headingMatch = condition.match(/^headingIs\((\d+)\)$/);
  if (headingMatch) {
    return normalizeDegrees(previewDrone.heading) === normalizeDegrees(Number(headingMatch[1]));
  }
  throw new Error(`Line ${line}: supported conditions are true, false, droneIsAirborne, !droneIsAirborne, headingIs(90), and sensingColor("grey").`);
}

function getSensedColor(x, y) {
  const zone = getMissionColorZones().find((candidate) =>
    x > candidate.x &&
    x < candidate.x + candidate.width &&
    y > candidate.y &&
    y < candidate.y + candidate.height
  );
  if (zone) return zone.color.toLowerCase();
  const positionedTarget = [
    ...(getMission().sampleRequirements ?? []),
    ...(getMission().landSampleRequirements ?? []),
  ].find((target) => {
    if (typeof target.x !== "number" || typeof target.y !== "number") return false;
    return Math.hypot(x - target.x, y - target.y) <= (target.radius ?? 46);
  });
  return positionedTarget ? positionedTarget.color.toLowerCase() : "";
}

function getSampleTargetAtPosition(x, y) {
  const positionedTarget = (getMission().sampleRequirements ?? []).find((sample) => {
    if (typeof sample.x !== "number" || typeof sample.y !== "number") return false;
    return Math.hypot(x - sample.x, y - sample.y) <= (sample.radius ?? 46);
  });
  if (positionedTarget) return positionedTarget;
  const sensedColor = getSensedColor(x, y);
  if (!sensedColor) return null;
  return (getMission().sampleRequirements ?? []).find((sample) => sample.color.toLowerCase() === sensedColor) ?? null;
}

function getLandSampleTargetAtPosition(x, y) {
  const positionedTarget = (getMission().landSampleRequirements ?? []).find((sample) => {
    if (typeof sample.x !== "number" || typeof sample.y !== "number") return false;
    return Math.hypot(x - sample.x, y - sample.y) <= (sample.radius ?? 46);
  });
  if (positionedTarget) return positionedTarget;
  const sensedColor = getSensedColor(x, y);
  if (!sensedColor) return null;
  return (getMission().landSampleRequirements ?? []).find((sample) => sample.color.toLowerCase() === sensedColor) ?? null;
}

function getPhotoTargetAtPosition(x, y) {
  return (getMission().photoRequirements ?? []).find((target) => {
    const radius = target.radius ?? 44;
    return Math.hypot(x - target.x, y - target.y) <= radius;
  }) ?? null;
}

function validateMissionCommandRequirements(commands) {
  const mission = getMission();
  const commandNames = new Set(commands.map((command) => command.name));
  const missingCommands = [];
  if ((mission.sampleRequirements ?? []).length && !commandNames.has("takeSample")) {
    missingCommands.push("takeSample();");
  }
  if ((mission.landSampleRequirements ?? []).length && !commandNames.has("takeLandSample")) {
    missingCommands.push("takeLandSample();");
  }
  if ((mission.photoRequirements ?? []).length && !commandNames.has("takePhoto")) {
    missingCommands.push("takePhoto();");
  }
  if (missingCommands.length) {
    throw new Error(`This mission requires ${missingCommands.join(", ")} in your code before it can be completed.`);
  }
}

function validateCommandAgainstState(command, previewDrone) {
  if (command.name === "takeOff") {
    if (previewDrone.airborne) throw new Error(`Line ${command.line}: the drone is already airborne.`);
    previewDrone.airborne = true;
    previewDrone.altitude = 24;
    return;
  }
  if (command.name === "land") {
    if (!previewDrone.airborne) throw new Error(`Line ${command.line}: take off before landing.`);
    previewDrone.airborne = false;
    previewDrone.altitude = 0;
    return;
  }
  if (command.name === "takeSample") {
    if (previewDrone.airborne) throw new Error(`Line ${command.line}: land on a colour patch before taking a sample.`);
    const sampleTarget = getSampleTargetAtPosition(previewDrone.x, previewDrone.y);
    if (!sampleTarget) throw new Error(`Line ${command.line}: takeSample() only works when landed on a required colour patch.`);
    previewDrone.sampledTargets.add(sampleTarget.label);
    return;
  }
  if (command.name === "takeLandSample") {
    if (previewDrone.airborne) throw new Error(`Line ${command.line}: land on a required land patch before taking a land sample.`);
    const landSampleTarget = getLandSampleTargetAtPosition(previewDrone.x, previewDrone.y);
    if (!landSampleTarget) throw new Error(`Line ${command.line}: takeLandSample() only works when landed on a required land sample patch.`);
    previewDrone.landSampledTargets.add(landSampleTarget.label);
    return;
  }
  if (command.name === "takePhoto") {
    if (!previewDrone.airborne) throw new Error(`Line ${command.line}: takePhoto() works while the drone is hovering near a photo target.`);
    const photoTarget = getPhotoTargetAtPosition(previewDrone.x, previewDrone.y);
    if (!photoTarget) throw new Error(`Line ${command.line}: takePhoto() only works near a required photo target.`);
    previewDrone.photoTargets.add(photoTarget.label);
    return;
  }
  if (!previewDrone.airborne) throw new Error(`Line ${command.line}: the drone must take off before it can move.`);
  if (["moveUp", "moveDown", "moveLeft", "moveRight"].includes(command.name)) {
    const next = getNextPosition(previewDrone, command);
    ensureSafePosition(next.x, next.y, command.line);
    previewDrone.x = next.x;
    previewDrone.y = next.y;
    return;
  }
  if (["rotateLeft", "rotateRight"].includes(command.name)) {
    previewDrone.heading = normalizeDegrees(previewDrone.heading + (command.name === "rotateRight" ? command.value : -command.value));
  }
}

function buildAnimationQueue(commands) {
  const previewDrone = getInitialDrone();
  const queue = [];
  for (const command of commands) {
    if (command.name === "takeOff") {
      if (previewDrone.airborne) throw new Error(`Line ${command.line}: the drone is already airborne.`);
      previewDrone.airborne = true;
      previewDrone.altitude = 24;
      queue.push({ type: "altitude", targetAltitude: 24, duration: 1000, label: "Taking off" });
      continue;
    }
    if (command.name === "land") {
      if (!previewDrone.airborne) throw new Error(`Line ${command.line}: take off before landing.`);
      previewDrone.airborne = false;
      previewDrone.altitude = 0;
      queue.push({ type: "altitude", targetAltitude: 0, duration: 1000, label: "Landing" });
      continue;
    }
    if (command.name === "takeSample") {
      if (previewDrone.airborne) throw new Error(`Line ${command.line}: land on a colour patch before taking a sample.`);
      const sampleTarget = getSampleTargetAtPosition(previewDrone.x, previewDrone.y);
      if (!sampleTarget) throw new Error(`Line ${command.line}: takeSample() only works when landed on a required colour patch.`);
      previewDrone.sampledTargets.add(sampleTarget.label);
      queue.push({ type: "sample", sampleLabel: sampleTarget.label, color: sampleTarget.color, duration: 700, label: `Taking ${sampleTarget.color} sample` });
      continue;
    }
    if (command.name === "takeLandSample") {
      if (previewDrone.airborne) throw new Error(`Line ${command.line}: land on a required land patch before taking a land sample.`);
      const landSampleTarget = getLandSampleTargetAtPosition(previewDrone.x, previewDrone.y);
      if (!landSampleTarget) throw new Error(`Line ${command.line}: takeLandSample() only works when landed on a required land sample patch.`);
      previewDrone.landSampledTargets.add(landSampleTarget.label);
      queue.push({ type: "landSample", sampleLabel: landSampleTarget.label, color: landSampleTarget.color, duration: 800, label: `Taking ${landSampleTarget.color} land sample` });
      continue;
    }
    if (command.name === "takePhoto") {
      if (!previewDrone.airborne) throw new Error(`Line ${command.line}: takePhoto() works while the drone is hovering near a photo target.`);
      const photoTarget = getPhotoTargetAtPosition(previewDrone.x, previewDrone.y);
      if (!photoTarget) throw new Error(`Line ${command.line}: takePhoto() only works near a required photo target.`);
      previewDrone.photoTargets.add(photoTarget.label);
      queue.push({ type: "photo", photoLabel: photoTarget.label, duration: 550, label: `Taking photo of ${photoTarget.label}` });
      continue;
    }
    if (!previewDrone.airborne) throw new Error(`Line ${command.line}: the drone must take off before it can move.`);
    if (["moveUp", "moveDown", "moveLeft", "moveRight"].includes(command.name)) {
      const next = getNextPosition(previewDrone, command);
      ensureSafePosition(next.x, next.y, command.line);
      previewDrone.x = next.x;
      previewDrone.y = next.y;
      queue.push({ type: "move", targetX: next.x, targetY: next.y, duration: Math.max(700, command.value * 6), label: `${command.name}(${command.value})` });
      continue;
    }
    if (["rotateLeft", "rotateRight"].includes(command.name)) {
      previewDrone.heading = normalizeDegrees(previewDrone.heading + (command.name === "rotateRight" ? command.value : -command.value));
      queue.push({ type: "rotate", targetHeading: previewDrone.heading, duration: 650, label: `${command.name}(${command.value})` });
      continue;
    }
    queue.push({ type: "wait", duration: command.value * 1000, label: `Hovering for ${command.value} second${command.value === 1 ? "" : "s"}` });
  }
  return queue;
}

function getNextPosition(drone, command) {
  const next = { x: drone.x, y: drone.y };
  if (command.name === "moveUp") next.y -= command.value;
  if (command.name === "moveDown") next.y += command.value;
  if (command.name === "moveLeft") next.x -= command.value;
  if (command.name === "moveRight") next.x += command.value;
  return next;
}

function ensureSafePosition(x, y, line) {
  const margin = 30;
  if (x < margin || x > canvas.width - margin || y < margin || y > canvas.height - margin) {
    throw new Error(`Line ${line}: that move exits the mission flight area.`);
  }
}

function startProgram() {
  if (!isStudentUser()) {
    updateFeedback("Sign in with a student account to run missions and save progress.", "Login Required", "chip-bad");
    return;
  }
  try {
    const parsedProgram = parseProgram(codeEditor.value);
    validateMissionCommandRequirements(parsedProgram.commands);
    state.animationQueue = buildAnimationQueue(parsedProgram.commands);
    state.drone = getInitialDrone();
    state.currentStep = null;
    state.lastTime = 0;
    state.playing = true;
    state.visitedCheckpoints = new Set();
    state.collectedSamples = new Set();
    state.collectedLandSamples = new Set();
    state.capturedPhotos = new Set();
    state.trail = [{ x: state.drone.x, y: state.drone.y }];
    state.currentMissionSuccess = false;
    renderCommandPreview(parsedProgram.commands);
    updateHud();
    renderMissionPanel();
    updateFeedback("Program accepted. The mission simulation is running.", "Running", "chip-warn");
    startDroneHum();
  } catch (error) {
    state.playing = false;
    state.animationQueue = [];
    state.currentStep = null;
    state.currentMissionSuccess = false;
    stopDroneHum();
    renderMissionPanel();
    updateFeedback(error.message, "Error", "chip-bad");
  }
}

function stepAnimation(timestamp) {
  if (!state.lastTime) state.lastTime = timestamp;
  const delta = timestamp - state.lastTime;
  state.lastTime = timestamp;

  if (state.drone?.sampleFlashMs > 0) {
    state.drone.sampleFlashMs = Math.max(0, state.drone.sampleFlashMs - delta);
  }
  if (state.drone?.photoFlashMs > 0) {
    state.drone.photoFlashMs = Math.max(0, state.drone.photoFlashMs - delta);
  }

  if (state.playing) {
    if (!state.currentStep && state.animationQueue.length) {
      const nextStep = state.animationQueue.shift();
      if (nextStep.type === "altitude" && nextStep.targetAltitude > 0) {
        state.drone.airborne = true;
      }
      state.currentStep = { ...nextStep, elapsed: 0, startX: state.drone.x, startY: state.drone.y, startAltitude: state.drone.altitude, startHeading: state.drone.heading };
      updateFeedback(`Executing: ${nextStep.label}`, "Running", "chip-warn");
    }

    if (state.currentStep) {
      state.currentStep.elapsed += delta;
      const progress = Math.min(state.currentStep.elapsed / state.currentStep.duration, 1);
      applyAnimationStep(state.currentStep, progress);
      if (detectNoFlyCollision()) {
        crashDrone();
        drawScene(timestamp);
        requestAnimationFrame(stepAnimation);
        return;
      }
      detectCheckpointHits();
      updateHud();
      if (progress >= 1) {
        finalizeStep(state.currentStep);
        state.currentStep = null;
      }
    } else if (!state.animationQueue.length) {
      state.playing = false;
      stopDroneHum();
      state.currentMissionSuccess = evaluateMissionSuccess();
      if (state.currentMissionSuccess) {
        recordMissionCompletion();
        playSuccessTone("mission");
      }
      renderMissionPanel();
      updateFeedback(
        state.currentMissionSuccess
          ? "Mission complete. The storyline can continue to the next challenge."
          : "Mission finished, but some objectives are still incomplete. Try refining the code.",
        state.currentMissionSuccess ? "Success" : "Finished",
        state.currentMissionSuccess ? "chip-good" : "chip-calm"
      );
    }
  }

  drawScene(timestamp);
  requestAnimationFrame(stepAnimation);
}

function applyAnimationStep(step, progress) {
  if (step.type === "move") {
    state.drone.x = lerp(step.startX, step.targetX, progress);
    state.drone.y = lerp(step.startY, step.targetY, progress);
  }
  if (step.type === "altitude") {
    state.drone.altitude = lerp(step.startAltitude, step.targetAltitude, progress);
  }
  if (step.type === "rotate") {
    const shortestTurn = getShortestTurn(step.startHeading, step.targetHeading);
    state.drone.heading = normalizeDegrees(step.startHeading + shortestTurn * progress);
  }
  if (step.type === "move" || step.type === "altitude") {
    const lastPoint = state.trail[state.trail.length - 1];
    if (!lastPoint || Math.hypot(lastPoint.x - state.drone.x, lastPoint.y - state.drone.y) > 8) {
      state.trail.push({ x: state.drone.x, y: state.drone.y });
    }
  }
}

function finalizeStep(step) {
  if (step.type === "move") {
    state.drone.x = step.targetX;
    state.drone.y = step.targetY;
  }
  if (step.type === "altitude") {
    state.drone.altitude = step.targetAltitude;
    state.drone.airborne = step.targetAltitude > 0;
  }
  if (step.type === "rotate") {
    state.drone.heading = step.targetHeading;
  }
  if (step.type === "sample") {
    state.collectedSamples.add(step.sampleLabel);
    state.drone.sampleFlashMs = 2000;
    playSuccessTone("sample");
  }
  if (step.type === "landSample") {
    state.collectedLandSamples.add(step.sampleLabel);
    state.drone.sampleFlashMs = 2000;
    playSuccessTone("sample");
  }
  if (step.type === "photo") {
    state.capturedPhotos.add(step.photoLabel);
    state.drone.photoFlashMs = 700;
    playSuccessTone("photo");
  }
  detectCheckpointHits();
  updateHud();
  renderMissionPanel();
}

function detectCheckpointHits() {
  getMission().checkpoints.forEach((checkpoint) => {
    const distance = Math.hypot(state.drone.x - checkpoint.x, state.drone.y - checkpoint.y);
    if (state.drone.airborne && distance <= checkpoint.radius + 16 && !state.visitedCheckpoints.has(checkpoint.id)) {
      state.visitedCheckpoints.add(checkpoint.id);
      playSuccessTone("checkpoint");
    }
  });
  renderMissionPanel();
}

function detectNoFlyCollision() {
  return getMission().noFlyZones.some((zone) =>
    state.drone.x > zone.x &&
    state.drone.x < zone.x + zone.width &&
    state.drone.y > zone.y &&
    state.drone.y < zone.y + zone.height
  );
}

function crashDrone() {
  state.playing = false;
  state.animationQueue = [];
  state.currentStep = null;
  state.currentMissionSuccess = false;
  state.visitedCheckpoints = new Set();
  state.collectedSamples = new Set();
  state.collectedLandSamples = new Set();
  state.capturedPhotos = new Set();
  state.trail = [];
  state.drone = getInitialDrone();
  state.lastTime = 0;
  stopDroneHum();
  playSuccessTone("crash");
  updateHud();
  renderMissionPanel();
  updateFeedback("The drone crashed in a no-fly zone and restarted at the launch pad. Adjust the code and try again.", "Crash", "chip-bad");
}

function evaluateMissionSuccess() {
  const allVisited = getMission().checkpoints.every((checkpoint) => state.visitedCheckpoints.has(checkpoint.id));
  const allSamplesCollected = (getMission().sampleRequirements ?? []).every((sample) => state.collectedSamples.has(sample.label));
  const allLandSamplesCollected = (getMission().landSampleRequirements ?? []).every((sample) => state.collectedLandSamples.has(sample.label));
  const allPhotosCaptured = (getMission().photoRequirements ?? []).every((photo) => state.capturedPhotos.has(photo.label));
  return allVisited && allSamplesCollected && allLandSamplesCollected && allPhotosCaptured && isOnLaunchPad() && !state.drone.airborne && state.drone.altitude === 0;
}

function isOnLaunchPad() {
  const pad = getMission().launchPad;
  return state.drone.x >= pad.x && state.drone.x <= pad.x + pad.width && state.drone.y >= pad.y && state.drone.y <= pad.y + pad.height;
}

function drawScene(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawGrid();
  drawDecorations(timestamp);
  drawColorZones();
  drawLandSampleTargets();
  drawPhotoTargets(timestamp);
  drawNoFlyZones();
  drawLaunchPad();
  drawCheckpoints(timestamp);
  drawFlightTrail();
  drawDrone(timestamp);
}

function drawBackground() {
  const sky = getCampaign().sky;
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, sky[0]);
  gradient.addColorStop(0.42, sky[1]);
  gradient.addColorStop(0.43, sky[2]);
  gradient.addColorStop(1, sky[3]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGrid() {
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawDecorations(timestamp) {
  getMission().decorations.forEach((decoration, index) => {
    if (decoration.type === "cloud") drawCloud(decoration.x, decoration.y, decoration.size, timestamp / 900 + index);
    if (decoration.type === "hangar") drawHangar(decoration);
    if (decoration.type === "ship") drawShip(decoration);
    if (decoration.type === "mountain") drawMountain(decoration);
    if (decoration.type === "river") drawRiver(decoration);
    if (decoration.type === "stars") drawStars(decoration.density);
    if (decoration.type === "lightning") drawLightning(decoration.x, decoration.y, timestamp / 160 + index);
    if (decoration.type === "platform") drawPlatform(decoration);
  });
}

function drawCloud(x, y, scale, drift) {
  const offset = Math.sin(drift) * 10;
  ctx.fillStyle = "rgba(255,255,255,0.68)";
  ctx.beginPath();
  ctx.arc(x + offset, y, 24 * scale, 0, Math.PI * 2);
  ctx.arc(x + 28 * scale + offset, y - 10 * scale, 20 * scale, 0, Math.PI * 2);
  ctx.arc(x + 52 * scale + offset, y, 24 * scale, 0, Math.PI * 2);
  ctx.fill();
}

function drawHangar({ x, y, width, height }) {
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "#9fe7ff";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
}

function drawShip({ x, y, width, height }) {
  ctx.fillStyle = "rgba(89, 215, 255, 0.2)";
  ctx.fillRect(x, y, width, height);
  ctx.beginPath();
  ctx.moveTo(x + 20, y + height);
  ctx.lineTo(x + width - 15, y + height);
  ctx.lineTo(x + width - 40, y + height + 18);
  ctx.lineTo(x + 35, y + height + 18);
  ctx.closePath();
  ctx.fill();
}

function drawMountain({ x, y, width, height }) {
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width / 2, y - height);
  ctx.lineTo(x + width, y);
  ctx.closePath();
  ctx.fill();
}

function drawRiver({ x, y, width, height }) {
  ctx.fillStyle = "rgba(120, 208, 255, 0.18)";
  ctx.fillRect(x, y, width, height);
}

function drawStars(density) {
  for (let index = 0; index < density; index += 1) {
    const x = (index * 47) % canvas.width;
    const y = (index * 73) % 240;
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.fillRect(x, y, 2, 2);
  }
}

function drawLightning(x, y, phase) {
  if (Math.sin(phase) <= 0.6) return;
  ctx.strokeStyle = "rgba(255, 239, 123, 0.8)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 15, y + 30);
  ctx.lineTo(x - 4, y + 30);
  ctx.lineTo(x + 10, y + 58);
  ctx.stroke();
}

function drawPlatform({ x, y, width, height }) {
  ctx.fillStyle = "rgba(255, 215, 168, 0.18)";
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "#ffd7a8";
  ctx.strokeRect(x, y, width, height);
}

function drawNoFlyZones() {
  getMission().noFlyZones.forEach((zone) => {
    ctx.fillStyle = "rgba(255, 123, 123, 0.18)";
    ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
    ctx.strokeStyle = "#ff7b7b";
    ctx.lineWidth = 2;
    ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
    ctx.fillStyle = "#ffe7e7";
    ctx.font = "700 14px Chakra Petch";
    ctx.fillText(zone.label.toUpperCase(), zone.x + 10, zone.y + 24);
  });
}

function drawColorZones() {
  getMissionColorZones().forEach((zone) => {
    ctx.fillStyle = zone.fill;
    ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
    ctx.strokeStyle = zone.stroke;
    ctx.lineWidth = 2;
    ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
    ctx.fillStyle = "#eef8ff";
    ctx.font = "700 13px Chakra Petch";
    ctx.fillText(zone.label.toUpperCase(), zone.x + 8, zone.y + 22);
  });
}

function drawLandSampleTargets() {
  (getMission().landSampleRequirements ?? []).forEach((sample) => {
    if (typeof sample.x !== "number" || typeof sample.y !== "number") return;
    const radius = sample.radius ?? 46;
    const complete = state.collectedLandSamples.has(sample.label);
    ctx.beginPath();
    ctx.fillStyle = complete ? "rgba(173, 247, 111, 0.18)" : "rgba(142, 105, 70, 0.28)";
    ctx.arc(sample.x, sample.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = complete ? "#adf76f" : "#c09362";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#fff3dc";
    ctx.font = "700 13px Chakra Petch";
    ctx.fillText(sample.label.toUpperCase(), sample.x - radius + 8, sample.y + 5);
  });
}

function drawPhotoTargets(timestamp) {
  (getMission().photoRequirements ?? []).forEach((target, index) => {
    const radius = target.radius ?? 44;
    const pulse = 1 + Math.sin(timestamp / 320 + index) * 0.08;
    const complete = state.capturedPhotos.has(target.label);
    ctx.beginPath();
    ctx.fillStyle = complete ? "rgba(173, 247, 111, 0.18)" : "rgba(255, 255, 255, 0.1)";
    ctx.arc(target.x, target.y, radius * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = complete ? "#adf76f" : "#eff9ff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = complete ? "#adf76f" : "#eff9ff";
    ctx.font = "700 22px Chakra Petch";
    ctx.fillText("CAM", target.x - 22, target.y + 8);
    ctx.font = "700 12px Chakra Petch";
    ctx.fillText(target.label.toUpperCase(), target.x - radius + 4, target.y + radius + 18);
  });
}

function drawLaunchPad() {
  const pad = getMission().launchPad;
  ctx.fillStyle = "rgba(89, 215, 255, 0.18)";
  ctx.fillRect(pad.x, pad.y, pad.width, pad.height);
  ctx.strokeStyle = getCampaign().droneColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(pad.x, pad.y, pad.width, pad.height);
  ctx.fillStyle = "#eff9ff";
  ctx.font = "700 18px Chakra Petch";
  ctx.fillText("PAD", pad.x + 34, pad.y + 34);
}

function drawCheckpoints(timestamp) {
  getMission().checkpoints.forEach((checkpoint, index) => {
    const pulse = 1 + Math.sin(timestamp / 280 + index) * 0.12;
    const complete = state.visitedCheckpoints.has(checkpoint.id);
    ctx.beginPath();
    ctx.fillStyle = complete ? "rgba(173, 247, 111, 0.22)" : "rgba(255,255,255,0.08)";
    ctx.arc(checkpoint.x, checkpoint.y, checkpoint.radius * pulse + 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = complete ? getCampaign().rotorColor : "#eff9ff";
    ctx.arc(checkpoint.x, checkpoint.y, checkpoint.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#09161e";
    ctx.font = "700 15px Chakra Petch";
    ctx.fillText(String(index + 1), checkpoint.x - 5, checkpoint.y + 5);
  });
}

function drawFlightTrail() {
  if (state.trail.length < 2) return;
  ctx.beginPath();
  ctx.strokeStyle = "rgba(89, 215, 255, 0.28)";
  ctx.lineWidth = 2;
  ctx.moveTo(state.trail[0].x, state.trail[0].y);
  state.trail.forEach((point) => ctx.lineTo(point.x, point.y));
  ctx.stroke();
}

function drawDrone(timestamp) {
  const bob = state.drone.airborne ? Math.sin(timestamp / 120) * 4 : 0;
  const rotorSpin = timestamp / 28;
  const campaign = getCampaign();
  ctx.save();
  ctx.translate(state.drone.x, state.drone.y - state.drone.altitude - bob);
  ctx.rotate((state.drone.heading * Math.PI) / 180);
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.beginPath();
  ctx.ellipse(0, state.drone.altitude + 38, 26, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = campaign.droneColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-28, 0);
  ctx.lineTo(28, 0);
  ctx.moveTo(0, -20);
  ctx.lineTo(0, 20);
  ctx.stroke();
  ctx.fillStyle = campaign.droneColor;
  roundedRect(-24, -14, 48, 28, 10);
  ctx.fill();
  ctx.fillStyle = state.drone.sampleFlashMs > 0 ? "#74e26f" : state.drone.photoFlashMs > 0 ? "#ffe880" : "#eff9ff";
  roundedRect(-12, -8, 24, 16, 6);
  ctx.fill();
  drawRotor(-28, -20, rotorSpin, campaign.rotorColor);
  drawRotor(28, -20, rotorSpin, campaign.rotorColor);
  drawRotor(-28, 20, rotorSpin, campaign.rotorColor);
  drawRotor(28, 20, rotorSpin, campaign.rotorColor);
  ctx.strokeStyle = "#d4f7ff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-18, 18);
  ctx.lineTo(-10, 28);
  ctx.lineTo(10, 28);
  ctx.lineTo(18, 18);
  ctx.stroke();
  ctx.restore();
}

function drawRotor(x, y, spin, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(spin);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-16, 0);
  ctx.lineTo(16, 0);
  ctx.moveTo(0, -16);
  ctx.lineTo(0, 16);
  ctx.stroke();
  ctx.restore();
}

function roundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

function normalizeDegrees(value) {
  return ((Math.round(value) % 360) + 360) % 360;
}

function getShortestTurn(start, end) {
  let diff = normalizeDegrees(end) - normalizeDegrees(start);
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff;
}

runButton.addEventListener("click", startProgram);
resetButton.addEventListener("click", resetDrone);
exampleButton.addEventListener("click", () => {
  if (!isExampleAvailableForMission()) {
    updateFeedback("Examples are only available on Mission 1 of each flight level.", "No Example", "chip-warn");
    return;
  }
  loadMissionEditor();
  updateFeedback("Mission example loaded into the editor.", "Example", "chip-calm");
});
prevMissionButton.addEventListener("click", () => loadMission(state.missionIndex - 1));
nextMissionButton.addEventListener("click", () => loadMission(state.missionIndex + 1));
pathButtons.forEach((button) => button.addEventListener("click", () => applyLevel(button.dataset.level)));
showLoginButton.addEventListener("click", () => setAuthMode("login"));
showRegisterButton.addEventListener("click", () => setAuthMode("register"));
selectStudentButton.addEventListener("click", () => setAuthKind("student"));
selectTeacherButton.addEventListener("click", () => setAuthKind("teacher"));
authSubmitButton.addEventListener("click", handleAuthSubmit);
logoutButton.addEventListener("click", logoutCurrentUser);
teacherPasswordButton.addEventListener("click", changeTeacherPassword);
teacherStudentSelect.addEventListener("change", () => {
  state.selectedTeacherStudentEmail = teacherStudentSelect.value;
  renderTeacherDashboard();
});
studentMissionSelect.addEventListener("change", () => {
  state.selectedStudentMissionKey = studentMissionSelect.value;
  switchStudentMissionByKey(studentMissionSelect.value);
});
rankCertificatesPanel.addEventListener("click", async (event) => {
  const button = event.target.closest(".rank-certificate-button");
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }
  const originalLabel = button.textContent;
  button.disabled = true;
  button.textContent = "Preparing PDF...";
  try {
    await downloadRankCertificate(button.dataset.levelKey ?? "");
  } catch (_error) {
    updateFeedback("The certificate could not be generated right now. Please try again.", "Certificate", "chip-warn");
  } finally {
    button.disabled = false;
    button.textContent = originalLabel;
  }
});
printCertificateButton.addEventListener("click", () => {
  window.print();
});

loadAccounts();
loadSession();
setAuthMode("login");
setAuthKind("student");
refreshAuthUi();
applyLevel("cadet");
drawScene(0);
requestAnimationFrame(stepAnimation);
