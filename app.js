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
const certificatePanel = document.querySelector("#certificatePanel");
const certificateSummaryText = document.querySelector("#certificateSummaryText");
const certificateDateText = document.querySelector("#certificateDateText");
const certificateActions = document.querySelector("#certificateActions");
const teacherPanel = document.querySelector("#teacherPanel");
const teacherSummaryBadge = document.querySelector("#teacherSummaryBadge");
const teacherStudentSelect = document.querySelector("#teacherStudentSelect");
const teacherDashboard = document.querySelector("#teacherDashboard");

const ACCOUNT_STORAGE_KEY = "drone-code-lab-accounts";
const SESSION_STORAGE_KEY = "drone-code-lab-session";
const DEFAULT_TEACHER_EMAIL = "mg@buckleyparkco.vic.edu.au";
const DEFAULT_TEACHER_PASSWORD = "password123";

const COMMANDS = new Set([
  "takeOff", "land", "moveUp", "moveDown", "moveLeft", "moveRight", "rotateLeft", "rotateRight", "wait", "takeSample", "takePhoto",
]);

const AudioContextClass = window.AudioContext || window.webkitAudioContext;
let missionAudioContext = null;
let droneHum = null;

const CAMPAIGNS = {
  cadet: {
    label: "Field Trainee",
    title: "Wetland Survey Team",
    droneColor: "#59d7ff",
    rotorColor: "#adf76f",
    sky: ["#153953", "#1d4d6e", "#163448", "#10263a"],
    missions: [
      {
        title: "Mission 1: Nesting Ground Check",
        objective: "Take off, visit the first two wetland survey points, photograph the waterbird nest marker, then land back on the field pad.",
        story: "Dr. Vega needs a gentle first flight over the reed beds to check whether waterbirds are nesting in the marked areas. Capture one waterbird nest photo before returning.",
        goalLabel: "Nest Survey",
        photoRequirements: [{ id: "photo-n1-waterbird", animal: "Waterbird Nest", label: "Waterbird Nest Photo", x: 476, y: 287, radius: 34 }],
        launchPad: { x: 90, y: 458, width: 132, height: 58 },
        checkpoints: [
          { id: "n1-a", name: "Reed Bed Camera Point", x: 320, y: 355, radius: 22 },
          { id: "n1-b", name: "Nesting Island Camera Point", x: 500, y: 265, radius: 22 },
        ],
        noFlyZones: [{ x: 620, y: 200, width: 120, height: 220, label: "Bird Rookery" }],
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
takePhoto();
moveDown(180);
moveLeft(320);
land();`,
      },
      {
        title: "Mission 2: Invasive Weed Sweep",
        objective: "Survey three weed-monitoring markers, photograph the dragonfly habitat marker, and steer around sensitive habitat.",
        story: "The field team is mapping an outbreak of invasive waterweed and must avoid flying over a nesting exclusion zone. Capture one dragonfly habitat photo for the wetland record.",
        goalLabel: "Weed Mapping",
        photoRequirements: [{ id: "photo-n2-dragonfly", animal: "Dragonfly Habitat", label: "Dragonfly Habitat Photo", x: 550, y: 247, radius: 34 }],
        launchPad: { x: 110, y: 430, width: 120, height: 54 },
        checkpoints: [
          { id: "n2-a", name: "Weed Patch North", x: 250, y: 210, radius: 22 },
          { id: "n2-b", name: "Weed Patch East", x: 520, y: 185, radius: 22 },
          { id: "n2-c", name: "Weed Patch South", x: 640, y: 400, radius: 22 },
        ],
        noFlyZones: [
          { x: 320, y: 250, width: 150, height: 210, label: "Nest Buffer" },
          { x: 720, y: 125, width: 110, height: 150, label: "Ranger Blind" },
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
takePhoto();
moveDown(210);
moveRight(120);
wait(1);
moveLeft(500);
land();`,
      },
      {
        title: "Mission 3: Frog Call Transect",
        objective: "Visit four acoustic recorder points, photograph the frog habitat marker, then return to base.",
        story: "After rain, the ecology team needs a quick transect to confirm which frog recorders are active around the wetland. Capture a frog habitat photo while the drone is above the recorder line.",
        goalLabel: "Call Survey",
        photoRequirements: [{ id: "photo-n3-frog", animal: "Frog Habitat", label: "Frog Habitat Photo", x: 673, y: 238, radius: 34 }],
        launchPad: { x: 92, y: 444, width: 126, height: 56 },
        checkpoints: [
          { id: "n3-a", name: "Recorder West", x: 230, y: 390, radius: 22 },
          { id: "n3-b", name: "Recorder North", x: 360, y: 210, radius: 22 },
          { id: "n3-c", name: "Recorder East", x: 675, y: 205, radius: 22 },
          { id: "n3-d", name: "Recorder South", x: 770, y: 380, radius: 22 },
        ],
        noFlyZones: [
          { x: 300, y: 275, width: 120, height: 165, label: "Tall Reeds" },
          { x: 545, y: 110, width: 105, height: 155, label: "Old Gum" },
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
takePhoto();
moveRight(160);
moveDown(170);
moveLeft(678);
moveDown(54);
land();`,
      },
      {
        title: "Mission 4: Wetland Baseline Run",
        objective: "Finish the full wetland route, visit every survey point, photograph the pelican roost marker, and return for a clean landing.",
        story: "The baseline survey is almost complete. Dr. Vega wants one careful run that avoids wildlife disturbance zones and records one pelican roost photo.",
        goalLabel: "Baseline Map",
        photoRequirements: [{ id: "photo-n4-pelican", animal: "Pelican Roost", label: "Pelican Roost Photo", x: 755, y: 279, radius: 34 }],
        launchPad: { x: 90, y: 445, width: 130, height: 58 },
        checkpoints: [
          { id: "n3-a", name: "Reed Edge Plot", x: 250, y: 360, radius: 22 },
          { id: "n3-b", name: "Open Water Plot", x: 450, y: 170, radius: 22 },
          { id: "n3-c", name: "Mudflat Plot", x: 690, y: 260, radius: 22 },
          { id: "n3-d", name: "Rookery Boundary", x: 760, y: 430, radius: 22 },
        ],
        noFlyZones: [
          { x: 325, y: 235, width: 110, height: 210, label: "Nest Buffer" },
          { x: 560, y: 115, width: 110, height: 170, label: "Tree Hollow" },
          { x: 820, y: 315, width: 90, height: 170, label: "Ranger Camp" },
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
takePhoto();
moveDown(170);
moveLeft(670);
land();`,
      },
    ],
  },
  second_officer: {
    label: "Field Ecologist",
    title: "Creek Health Team",
    droneColor: "#9fe7ff",
    rotorColor: "#e0ff7d",
    sky: ["#24384d", "#37556d", "#2c3f43", "#1b2c34"],
    missions: [
      {
        title: "Mission 1: Erosion Bank Sample",
        objective: "Fly from the creek entrance to the monitoring plots, photograph the platypus burrow marker, land on the grey bank patch to take a soil sample, then continue safely.",
        story: "A recent storm exposed creek-bank sediment, and the conservation scientist needs a grey soil sample plus a platypus burrow photo near the monitoring plots.",
        goalLabel: "Bank Survey",
        sampleRequirements: [{ color: "grey", label: "Eroded Bank Soil Sample" }],
        colorZones: [
          { color: "grey", label: "Grey Soil Patch", x: 110, y: 315, width: 120, height: 85, fill: "rgba(170, 180, 191, 0.32)", stroke: "#b8c1ca" },
        ],
        photoRequirements: [{ id: "photo-c1-platypus", animal: "Platypus Burrow", label: "Platypus Burrow Photo", x: 390, y: 232, radius: 34 }],
        launchPad: { x: 70, y: 420, width: 120, height: 54 },
        checkpoints: [
          { id: "c1-a", name: "Upstream Photo Plot", x: 220, y: 305, radius: 22 },
          { id: "c1-b", name: "Erosion Face", x: 610, y: 185, radius: 22 },
          { id: "c1-c", name: "Downstream Photo Plot", x: 810, y: 330, radius: 22 },
        ],
        noFlyZones: [
          { x: 250, y: 85, width: 120, height: 250, label: "Canopy Gap" },
          { x: 470, y: 250, width: 145, height: 220, label: "Steep Bank" },
          { x: 710, y: 90, width: 110, height: 150, label: "Old Nest Tree" },
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
takePhoto();
moveRight(200);
moveDown(145);
moveLeft(460);
}
land();`,
      },
      {
        title: "Mission 2: Water Quality Run",
        objective: "Map four creek markers, photograph the kingfisher perch marker, land on the blue patch to take a creek-edge land sample, then lift off and finish the route.",
        story: "After heavy rain, bank habitat may need repair. The field team needs a blue creek-edge land sample and one kingfisher perch photo before the drone returns.",
        goalLabel: "Water Survey",
        sampleRequirements: [{ color: "blue", label: "Creek Edge Land Sample" }],
        colorZones: [
          { color: "blue", label: "Blue Water Patch", x: 170, y: 310, width: 120, height: 85, fill: "rgba(89, 215, 255, 0.24)", stroke: "#72dfff" },
        ],
        photoRequirements: [{ id: "photo-c2-kingfisher", animal: "Kingfisher Perch", label: "Kingfisher Perch Photo", x: 523, y: 248, radius: 34 }],
        launchPad: { x: 130, y: 455, width: 126, height: 56 },
        checkpoints: [
          { id: "c2-a", name: "Pool A", x: 300, y: 390, radius: 22 },
          { id: "c2-b", name: "Riffle B", x: 460, y: 220, radius: 22 },
          { id: "c2-c", name: "Pool C", x: 690, y: 210, radius: 22 },
          { id: "c2-d", name: "Outflow D", x: 800, y: 390, radius: 22 },
        ],
        noFlyZones: [
          { x: 355, y: 265, width: 95, height: 205, label: "Snag Habitat" },
          { x: 565, y: 115, width: 105, height: 210, label: "Bank Nest" },
        ],
        decorations: [
          { type: "river", x: 0, y: 470, width: 960, height: 90 },
          { type: "mountain", x: 90, y: 470, width: 160, height: 100 },
        ],
        example: `takeOff();
if (droneIsAirborne) {
moveRight(170);
moveUp(65);
moveRight(160);
moveUp(170);
takePhoto();
moveRight(230);
moveRight(110);
moveDown(180);
wait(1);
moveLeft(670);
moveDown(65);
}
land();`,
      },
      {
        title: "Mission 3: Pollinator Corridor",
        objective: "Scan the habitat corridor, photograph the native bee marker, land on the gold patch for a pollen-dust sample, then keep flying to the last survey point.",
        story: "Flowering shrubs are linking two habitat patches, so the scientist needs a native bee photo and a gold pollen-dust sample from the corridor.",
        goalLabel: "Corridor Check",
        sampleRequirements: [{ color: "gold", label: "Pollen Dust Sample" }],
        colorZones: [
          { color: "gold", label: "Gold Pollen Patch", x: 120, y: 265, width: 120, height: 85, fill: "rgba(255, 215, 140, 0.24)", stroke: "#ffd78c" },
        ],
        photoRequirements: [{ id: "photo-c3-bee", animal: "Native Bee", label: "Native Bee Photo", x: 700, y: 232, radius: 34 }],
        launchPad: { x: 90, y: 430, width: 120, height: 54 },
        checkpoints: [
          { id: "c3-a", name: "West Habitat Patch", x: 220, y: 350, radius: 22 },
          { id: "c3-b", name: "Flowering Shrub Line", x: 410, y: 205, radius: 22 },
          { id: "c3-c", name: "East Habitat Patch", x: 640, y: 195, radius: 22 },
          { id: "c3-d", name: "Insect Camera Trap", x: 790, y: 350, radius: 22 },
        ],
        noFlyZones: [
          { x: 280, y: 160, width: 95, height: 205, label: "Bee Nest Zone" },
          { x: 520, y: 250, width: 105, height: 180, label: "Dense Scrub" },
          { x: 720, y: 120, width: 100, height: 145, label: "Canopy Roost" },
        ],
        decorations: [
          { type: "mountain", x: 120, y: 500, width: 210, height: 130 },
          { type: "mountain", x: 650, y: 500, width: 210, height: 130 },
        ],
        example: `takeOff();
if (droneIsAirborne) {
moveRight(130);
moveUp(80);
moveRight(190);
moveUp(145);
moveRight(230);
takePhoto();
moveRight(150);
moveDown(155);
moveLeft(700);
moveDown(70);
}
land();`,
      },
      {
        title: "Mission 4: Nocturnal Mammal Survey",
        objective: "Complete the creek route in the dark, photograph the bandicoot crossing, land on the grey patch for a track-bed land sample, and bring the drone home.",
        story: "Camera traps recorded movement after dark. The team needs a drone photo of the bandicoot crossing and a grey land sample from the track bed to plan habitat repairs.",
        goalLabel: "Night Transect",
        sampleRequirements: [{ color: "grey", label: "Track Bed Soil Sample" }],
        colorZones: [
          { color: "grey", label: "Grey Soil Patch", x: 120, y: 300, width: 120, height: 85, fill: "rgba(170, 180, 191, 0.32)", stroke: "#b8c1ca" },
        ],
        photoRequirements: [{ id: "photo-c4-bandicoot", animal: "Bandicoot", label: "Bandicoot Crossing Photo", x: 700, y: 192, radius: 34 }],
        launchPad: { x: 90, y: 430, width: 120, height: 54 },
        checkpoints: [
          { id: "c3-a", name: "Camera Trap West", x: 245, y: 330, radius: 22 },
          { id: "c3-b", name: "Burrow Entrance", x: 390, y: 165, radius: 22 },
          { id: "c3-c", name: "Track Crossing", x: 640, y: 160, radius: 22 },
          { id: "c3-d", name: "Camera Trap South", x: 770, y: 345, radius: 22 },
        ],
        noFlyZones: [
          { x: 250, y: 105, width: 82, height: 170, label: "Roost Tree" },
          { x: 465, y: 205, width: 105, height: 215, label: "Dense Habitat" },
          { x: 725, y: 125, width: 100, height: 150, label: "Burrow Buffer" },
        ],
        decorations: [
          { type: "stars", density: 16 },
          { type: "mountain", x: 150, y: 500, width: 240, height: 130 },
          { type: "mountain", x: 660, y: 500, width: 240, height: 130 },
        ],
        example: `takeOff();
if (droneIsAirborne) {
moveRight(155);
moveUp(100);
moveRight(145);
moveUp(165);
moveRight(250);
takePhoto();
moveRight(130);
moveDown(185);
moveLeft(680);
moveDown(100);
}
land();`,
      },
    ],
  },
  first_officer: {
    label: "Research Lead",
    title: "Woodland Recovery Team",
    droneColor: "#b8efff",
    rotorColor: "#ffe880",
    sky: ["#2d3950", "#4b5f7f", "#544231", "#2b2731"],
    missions: [
      {
        title: "Mission 1: Nest Box Inspection",
        objective: "Visit three nest box trees, photograph the sugar glider nest box, land on the blue patch for a moisture land sample, then return before the survey window closes.",
        story: "Morning light is ideal for checking nest boxes. The research lead needs a sugar glider photo and a blue moisture sample from the woodland edge to improve habitat plantings.",
        goalLabel: "Nest Box Check",
        sampleRequirements: [{ color: "blue", label: "Woodland Moisture Sample" }],
        colorZones: [
          { color: "blue", label: "Blue Water Patch", x: 160, y: 340, width: 120, height: 85, fill: "rgba(89, 215, 255, 0.24)", stroke: "#72dfff" },
        ],
        photoRequirements: [{ id: "photo-f1-glider", animal: "Sugar Glider", label: "Sugar Glider Nest Box Photo", x: 547, y: 267, radius: 34 }],
        launchPad: { x: 90, y: 446, width: 124, height: 54 },
        checkpoints: [
          { id: "f1-a", name: "West Nest Box", x: 235, y: 330, radius: 22 },
          { id: "f1-b", name: "North Nest Box", x: 470, y: 160, radius: 22 },
          { id: "f1-c", name: "East Nest Box", x: 760, y: 315, radius: 22 },
        ],
        noFlyZones: [
          { x: 300, y: 220, width: 115, height: 200, label: "Hollow Tree" },
          { x: 610, y: 110, width: 105, height: 165, label: "Raptor Nest" },
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
        title: "Mission 2: Eucalypt Health Grid",
        objective: "Visit four canopy-health sensors, photograph the possum den, land on the grey patch for a bark land sample, then keep the route moving.",
        story: "Several eucalypts are showing dieback, so the team must check canopy sensors, photograph the possum den, and collect a grey bark sample for habitat improvement work.",
        goalLabel: "Canopy Grid",
        sampleRequirements: [{ color: "grey", label: "Bark Condition Sample" }],
        colorZones: [
          { color: "grey", label: "Grey Soil Patch", x: 120, y: 300, width: 120, height: 85, fill: "rgba(170, 180, 191, 0.32)", stroke: "#b8c1ca" },
        ],
        photoRequirements: [{ id: "photo-f2-possum", animal: "Possum", label: "Possum Den Photo", x: 682, y: 233, radius: 34 }],
        launchPad: { x: 110, y: 445, width: 124, height: 56 },
        checkpoints: [
          { id: "f2-a", name: "Canopy Sensor A", x: 250, y: 390, radius: 22 },
          { id: "f2-b", name: "Canopy Sensor B", x: 390, y: 205, radius: 22 },
          { id: "f2-c", name: "Canopy Sensor C", x: 620, y: 205, radius: 22 },
          { id: "f2-d", name: "Canopy Sensor D", x: 820, y: 360, radius: 22 },
        ],
        noFlyZones: [
          { x: 280, y: 250, width: 90, height: 170, label: "Fallen Limb" },
          { x: 500, y: 120, width: 100, height: 180, label: "Sensitive Hollow" },
          { x: 710, y: 250, width: 95, height: 150, label: "Research Blind" },
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
moveRight(230);
takePhoto();
moveRight(200);
moveDown(155);
moveLeft(710);
moveDown(70);
land();`,
      },
      {
        title: "Mission 3: Fire Scar Recovery",
        objective: "Climb through the recovery corridor, photograph the wallaby sheltering near regrowth, land on the gold patch for an ash-bed land sample, then return.",
        story: "A low-intensity burn passed through the woodland. The team needs a wallaby photo and a gold ash-bed sample to track whether habitat is recovering.",
        goalLabel: "Fire Recovery",
        sampleRequirements: [{ color: "gold", label: "Ash Bed Sample" }],
        colorZones: [
          { color: "gold", label: "Gold Pollen Patch", x: 150, y: 335, width: 120, height: 85, fill: "rgba(255, 215, 140, 0.24)", stroke: "#ffd78c" },
        ],
        photoRequirements: [{ id: "photo-f3-wallaby", animal: "Wallaby", label: "Wallaby Regrowth Photo", x: 738, y: 173, radius: 34 }],
        launchPad: { x: 85, y: 440, width: 125, height: 55 },
        checkpoints: [
          { id: "f3-a", name: "Regrowth Plot West", x: 240, y: 300, radius: 22 },
          { id: "f3-b", name: "Ash Bed Plot", x: 430, y: 145, radius: 22 },
          { id: "f3-c", name: "Seedling Plot East", x: 675, y: 165, radius: 22 },
          { id: "f3-d", name: "Control Plot South", x: 815, y: 345, radius: 22 },
        ],
        noFlyZones: [
          { x: 315, y: 170, width: 85, height: 205, label: "Smouldering Log" },
          { x: 540, y: 255, width: 115, height: 175, label: "Unstable Tree" },
          { x: 760, y: 125, width: 90, height: 145, label: "Wildlife Refuge" },
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
moveRight(190);
moveUp(155);
moveRight(245);
takePhoto();
moveDown(20);
moveRight(140);
moveDown(180);
moveLeft(730);
moveDown(95);
land();`,
      },
      {
        title: "Mission 4: Woodland Biodiversity Audit",
        objective: "Complete the full woodland route, photograph the koala crossing, collect a blue land sample mid-mission, and prove you can lead a field survey.",
        story: "The biodiversity audit brings together nest checks, animal evidence, canopy photos, and one blue moisture sample for improving the habitat plan.",
        goalLabel: "Audit Flight",
        sampleRequirements: [{ color: "blue", label: "Biodiversity Moisture Sample" }],
        colorZones: [
          { color: "blue", label: "Blue Water Patch", x: 120, y: 300, width: 120, height: 85, fill: "rgba(89, 215, 255, 0.24)", stroke: "#72dfff" },
        ],
        photoRequirements: [{ id: "photo-f4-koala", animal: "Koala", label: "Koala Crossing Photo", x: 803, y: 263, radius: 34 }],
        launchPad: { x: 92, y: 438, width: 126, height: 56 },
        checkpoints: [
          { id: "f4-a", name: "Understorey Plot", x: 210, y: 370, radius: 22 },
          { id: "f4-b", name: "Nest Box Cluster", x: 365, y: 210, radius: 22 },
          { id: "f4-c", name: "Canopy Gap", x: 560, y: 145, radius: 22 },
          { id: "f4-d", name: "Fallen Log Habitat", x: 770, y: 235, radius: 22 },
          { id: "f4-e", name: "Return Transect", x: 835, y: 390, radius: 22 },
        ],
        noFlyZones: [
          { x: 250, y: 250, width: 85, height: 160, label: "Nest Buffer" },
          { x: 455, y: 120, width: 90, height: 170, label: "Old Hollow" },
          { x: 650, y: 210, width: 95, height: 160, label: "Quiet Zone" },
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
moveRight(180);
moveDown(90);
takePhoto();
moveRight(95);
moveDown(155);
moveLeft(743);
moveDown(48);
land();`,
      },
    ],
  },
  captain: {
    label: "Senior Scientist",
    title: "Landscape Conservation Team",
    droneColor: "#ffd7a8",
    rotorColor: "#ffef7b",
    sky: ["#311f43", "#56305e", "#442335", "#251628"],
    missions: [
      {
        title: "Mission 1: Post-Fire Erosion Check",
        objective: "Cross the monitoring gates, photograph the lyrebird refuge, land on the grey patch for an ash-soil land sample, then finish the tracker run and land at base.",
        story: "Rain is moving toward a burnt catchment, and the senior scientist needs live erosion readings, a lyrebird refuge photo, and a grey ash-soil sample for habitat repair.",
        goalLabel: "Erosion Trackers",
        sampleRequirements: [{ color: "grey", label: "Ash Soil Sample" }],
        colorZones: [
          { color: "grey", label: "Grey Soil Patch", x: 130, y: 320, width: 90, height: 70, fill: "rgba(170, 180, 191, 0.32)", stroke: "#b8c1ca" },
        ],
        photoRequirements: [{ id: "photo-e1-lyrebird", animal: "Lyrebird", label: "Lyrebird Refuge Photo", x: 591, y: 208, radius: 34 }],
        launchPad: { x: 80, y: 445, width: 122, height: 56 },
        checkpoints: [
          { id: "e1-a", name: "Slope Tracker One", x: 245, y: 230, radius: 22 },
          { id: "e1-b", name: "Slope Tracker Two", x: 520, y: 180, radius: 22 },
          { id: "e1-c", name: "Sediment Trap", x: 780, y: 320, radius: 22 },
        ],
        noFlyZones: [
          { x: 230, y: 300, width: 105, height: 180, label: "Unstable Slope" },
          { x: 470, y: 255, width: 135, height: 220, label: "Fallen Trees" },
          { x: 700, y: 95, width: 95, height: 150, label: "Raptor Nest" },
        ],
        decorations: [
          { type: "lightning", x: 180, y: 120 },
          { type: "lightning", x: 760, y: 100 },
          { type: "platform", x: 760, y: 455, width: 120, height: 28 },
        ],
        example: `takeOff();
moveRight(135);
moveUp(90);
if (sensingColor("grey")) {
for (let i = 0; i < 1; i++) {
wait(1);
}
moveUp(125);
moveRight(315);
moveUp(50);
takePhoto();
moveRight(260);
moveDown(140);
moveLeft(710);
moveDown(125);
}
land();`,
      },
      {
        title: "Mission 2: Wildlife Corridor Maze",
        objective: "Navigate through a dense habitat corridor, photograph the wallaby corridor, land on the blue patch for a waterhole land sample, then keep flying through the maze.",
        story: "GPS-collared animals are moving through a narrow corridor, and the scientist wants a wallaby photo and blue waterhole-edge land sample without entering quiet zones.",
        goalLabel: "Corridor Hover",
        sampleRequirements: [{ color: "blue", label: "Waterhole Edge Land Sample" }],
        colorZones: [
          { color: "blue", label: "Blue Water Patch", x: 410, y: 325, width: 85, height: 85, fill: "rgba(89, 215, 255, 0.24)", stroke: "#72dfff" },
        ],
        photoRequirements: [{ id: "photo-e2-wallaby", animal: "Wallaby", label: "Wallaby Corridor Photo", x: 818, y: 268, radius: 34 }],
        launchPad: { x: 115, y: 440, width: 125, height: 56 },
        checkpoints: [
          { id: "e2-a", name: "West Camera Trap", x: 270, y: 365, radius: 22 },
          { id: "e2-b", name: "North Waterhole", x: 420, y: 165, radius: 22 },
          { id: "e2-c", name: "Corridor Pinch Point", x: 630, y: 165, radius: 22 },
          { id: "e2-d", name: "East Camera Trap", x: 825, y: 300, radius: 22 },
        ],
        noFlyZones: [
          { x: 305, y: 235, width: 90, height: 205, label: "Quiet Zone A" },
          { x: 510, y: 95, width: 90, height: 215, label: "Quiet Zone B" },
          { x: 695, y: 255, width: 95, height: 185, label: "Quiet Zone C" },
        ],
        decorations: [
          { type: "stars", density: 22 },
          { type: "lightning", x: 560, y: 90 },
        ],
        example: `takeOff();
moveRight(430);
moveUp(200);
if (sensingColor("blue")) {
land();
takeSample();
takeOff();
for (let i = 0; i < 1; i++) {
wait(1);
}
moveRight(210);
takePhoto();
wait(1);
moveRight(195);
moveDown(135);
moveLeft(710);
moveDown(140);
}
land();`,
      },
      {
        title: "Mission 3: Alpine Plant Transect",
        objective: "Cross five research plots, photograph the pygmy-possum habitat, land on the gold patch to collect a land sample, then return safely.",
        story: "A cold front is approaching the alpine reserve, so the senior scientist must photograph pygmy-possum habitat and collect a gold land sample through the safest gap.",
        goalLabel: "Alpine Transect",
        sampleRequirements: [{ color: "gold", label: "Alpine Pollen Sample" }],
        colorZones: [
          { color: "gold", label: "Gold Pollen Patch", x: 120, y: 320, width: 120, height: 85, fill: "rgba(255, 215, 140, 0.24)", stroke: "#ffd78c" },
        ],
        photoRequirements: [{ id: "photo-e3-possum", animal: "Pygmy Possum", label: "Pygmy Possum Habitat Photo", x: 802, y: 288, radius: 34 }],
        launchPad: { x: 82, y: 440, width: 124, height: 56 },
        checkpoints: [
          { id: "e3-a", name: "Snow Gum Plot", x: 205, y: 350, radius: 22 },
          { id: "e3-b", name: "Herbfield Plot", x: 360, y: 160, radius: 22 },
          { id: "e3-c", name: "Bog Plot", x: 560, y: 140, radius: 22 },
          { id: "e3-d", name: "Rock Garden Plot", x: 740, y: 240, radius: 22 },
          { id: "e3-e", name: "Shelter Plot", x: 860, y: 390, radius: 22 },
        ],
        noFlyZones: [
          { x: 245, y: 200, width: 85, height: 205, label: "Fragile Moss A" },
          { x: 445, y: 100, width: 90, height: 175, label: "Fragile Moss B" },
          { x: 640, y: 225, width: 90, height: 160, label: "Wombat Burrow" },
          { x: 810, y: 145, width: 70, height: 140, label: "Nest Ledge" },
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
moveRight(200);
moveRight(180);
moveDown(100);
takePhoto();
moveRight(120);
moveDown(150);
moveLeft(778);
moveDown(50);
}
land();`,
      },
      {
        title: "Mission 4: Conservation Impact Report",
        objective: "Complete the full senior scientist route, photograph the wildlife crossing, collect a blue land sample mid-mission, scan all landscape plots, and finish with a precise landing.",
        story: "This final survey feeds the conservation impact report. Weather is closing in, so the team gets one clean run with a wildlife photo and a blue riparian land sample.",
        goalLabel: "Impact Report",
        sampleRequirements: [{ color: "blue", label: "Impact Report Riparian Land Sample" }],
        colorZones: [
          { color: "blue", label: "Blue Water Patch", x: 345, y: 325, width: 85, height: 85, fill: "rgba(89, 215, 255, 0.24)", stroke: "#72dfff" },
        ],
        photoRequirements: [{ id: "photo-e4-crossing", animal: "Wildlife Crossing", label: "Wildlife Crossing Photo", x: 780, y: 285, radius: 34 }],
        launchPad: { x: 80, y: 438, width: 122, height: 56 },
        checkpoints: [
          { id: "e3-a", name: "Creekline Plot", x: 220, y: 330, radius: 22 },
          { id: "e3-b", name: "Ridge Plot", x: 405, y: 150, radius: 22 },
          { id: "e3-c", name: "Regrowth Plot", x: 610, y: 150, radius: 22 },
          { id: "e3-d", name: "Wildlife Crossing", x: 760, y: 255, radius: 22 },
          { id: "e3-e", name: "Reference Plot", x: 850, y: 395, radius: 22 },
        ],
        noFlyZones: [
          { x: 240, y: 195, width: 90, height: 220, label: "Nest Buffer A" },
          { x: 445, y: 85, width: 85, height: 180, label: "Nest Buffer B" },
          { x: 635, y: 220, width: 90, height: 165, label: "Wetland Edge" },
          { x: 805, y: 170, width: 80, height: 130, label: "Quiet Refuge" },
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
moveRight(205);
moveRight(150);
moveDown(105);
takePhoto();
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
  photographedAnimals: new Set(),
  trail: [],
  currentMissionSuccess: false,
  accounts: {},
  currentUserEmail: "",
  authMode: "login",
  authKind: "student",
  selectedTeacherStudentEmail: "",
  selectedStudentMissionKey: "",
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
  const account = getCurrentAccount();
  const missions = getAllMissionEntries();
  if (!account || account.role !== "student") {
    return new Set(missions.map((entry) => entry.missionKey));
  }
  const progress = ensureAccountProgress(account);
  const unlocked = new Set();
  for (const entry of missions) {
    unlocked.add(entry.missionKey);
    if (!progress[entry.missionKey]?.completed) {
      break;
    }
  }
  return unlocked;
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

function getRoleProgressSummaries(account = getCurrentAccount()) {
  const progress = account ? ensureAccountProgress(account) : {};
  return Object.entries(CAMPAIGNS).map(([levelKey, campaign]) => {
    const completedCount = campaign.missions.filter((mission, missionIndex) =>
      progress[getMissionKey(levelKey, missionIndex)]?.completed
    ).length;
    return {
      levelKey,
      label: campaign.label,
      completedCount,
      totalCount: campaign.missions.length,
      complete: completedCount === campaign.missions.length,
    };
  });
}

function getRoleCompletionDate(account, levelKey) {
  if (!account || account.role !== "student") {
    return "";
  }
  const progress = ensureAccountProgress(account);
  const completionDates = CAMPAIGNS[levelKey].missions
    .map((_mission, missionIndex) => progress[getMissionKey(levelKey, missionIndex)]?.completedAt)
    .filter(Boolean)
    .sort();
  return completionDates.length === CAMPAIGNS[levelKey].missions.length
    ? completionDates[completionDates.length - 1]
    : "";
}

function getAvailableCertificates(account = getCurrentAccount()) {
  if (!account || account.role !== "student") {
    return [];
  }
  const roleCertificates = getRoleProgressSummaries(account)
    .filter((role) => role.complete)
    .map((role) => ({
      type: "role",
      levelKey: role.levelKey,
      label: `${role.label} Certificate`,
      roleLabel: role.label,
      awardedAt: getRoleCompletionDate(account, role.levelKey),
    }));
  const summary = getStudentCompletionSummary(account);
  if (summary.allComplete) {
    roleCertificates.push({
      type: "overall",
      levelKey: "all",
      label: "Conservation Drone Lab Certificate",
      roleLabel: "Buckley Park College Conservation Drone Lab",
      awardedAt: summary.latestCompletedAt,
    });
  }
  return roleCertificates;
}

function toPdfText(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, "");
}

function toPdfFilename(value) {
  return String(value ?? "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "certificate";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

function buildCertificateMarkup(certificate, account) {
  const rawStudentName = String(account.name ?? "").trim() || String(account.email ?? "").split("@")[0] || "Student";
  const studentName = rawStudentName;
  const issueDate = certificate.awardedAt
    ? new Date(certificate.awardedAt).toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" })
    : new Date().toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" });
  const title = certificate.type === "overall" ? "Certificate of Excellence" : "Certificate of Completion";
  const rankAchieved = certificate.type === "overall" ? "Whole Program Completion" : certificate.roleLabel;
  const achievementText = certificate.type === "overall"
    ? "for completing every field role in the Buckley Park College Conservation Drone Lab."
    : `for completing the ${certificate.roleLabel} field role in the Buckley Park College Conservation Drone Lab.`;
  const logoUrl = new URL("BPC-logo-WordMarkWHITEcond.png", window.location.href).href;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(certificate.label)}</title>
  <style>
    @page { size: A4 landscape; margin: 0; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #102330;
      color: #f7f5ea;
    }
    .sheet {
      width: 297mm;
      height: 210mm;
      margin: 0 auto;
      padding: 14mm;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)),
        #102330;
    }
    .certificate {
      width: 100%;
      height: 100%;
      border: 4px solid #f0d46a;
      padding: 14mm 16mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background:
        radial-gradient(circle at top right, rgba(240, 212, 106, 0.18), transparent 24%),
        rgba(7, 19, 27, 0.88);
    }
    .logo {
      width: 110mm;
      max-width: 100%;
      object-fit: contain;
      margin: 0 auto 6mm;
      display: block;
    }
    .eyebrow {
      text-align: center;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #f0d46a;
      font-size: 12pt;
      margin: 0 0 4mm;
    }
    h1 {
      text-align: center;
      font-size: 26pt;
      margin: 0 0 6mm;
      color: #fffdf3;
    }
    .presented {
      text-align: center;
      font-size: 13pt;
      margin: 0 0 4mm;
      color: #d7dee3;
    }
    .student-name {
      text-align: center;
      font-size: 28pt;
      font-weight: 700;
      color: #f0d46a;
      margin: 0 0 6mm;
    }
    .achievement {
      text-align: center;
      font-size: 14pt;
      line-height: 1.55;
      max-width: 230mm;
      margin: 0 auto;
      color: #f7f5ea;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8mm;
      margin-top: 10mm;
    }
    .meta-card {
      border: 1px solid rgba(240, 212, 106, 0.45);
      padding: 6mm 7mm;
      min-height: 28mm;
      background: rgba(255,255,255,0.03);
    }
    .meta-label {
      font-size: 10pt;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #f0d46a;
      margin-bottom: 2mm;
    }
    .meta-value {
      font-size: 16pt;
      font-weight: 700;
      color: #fffdf3;
    }
    .footer {
      text-align: center;
      font-size: 11pt;
      color: #d7dee3;
      margin-top: 8mm;
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="certificate">
      <div>
        <img class="logo" src="${escapeHtml(logoUrl)}" alt="Buckley Park College logo">
        <p class="eyebrow">Buckley Park College</p>
        <h1>${escapeHtml(title)}</h1>
        <p class="presented">Presented to</p>
        <p class="student-name">${escapeHtml(studentName)}</p>
        <p class="achievement">${escapeHtml(achievementText)}</p>
        <div class="meta-grid">
          <div class="meta-card">
            <div class="meta-label">Student Name</div>
            <div class="meta-value">${escapeHtml(studentName)}</div>
          </div>
          <div class="meta-card">
            <div class="meta-label">Rank Achieved</div>
            <div class="meta-value">${escapeHtml(rankAchieved)}</div>
          </div>
          <div class="meta-card">
            <div class="meta-label">Award Date</div>
            <div class="meta-value">${escapeHtml(issueDate)}</div>
          </div>
        </div>
      </div>
      <p class="footer">Buckley Park College Conservation Science and Drone Program</p>
    </div>
  </div>
</body>
</html>`;
}

function downloadCertificate(certificate) {
  const account = getCurrentAccount();
  if (!account || account.role !== "student") {
    return;
  }
  const printWindow = window.open("", "_blank", "width=1200,height=850");
  if (!printWindow) {
    updateFeedback("Allow pop-ups to open the certificate and save it as a PDF.", "Popup Blocked", "chip-warn");
    return;
  }
  printWindow.document.open();
  printWindow.document.write(buildCertificateMarkup(certificate, account));
  printWindow.document.close();
  printWindow.addEventListener("load", () => {
    printWindow.focus();
    printWindow.print();
  }, { once: true });
}

function renderStarRow(completedCount, totalCount) {
  return Array.from({ length: totalCount }, (_item, index) =>
    `<span class="role-star ${index < completedCount ? "filled" : ""}" aria-hidden="true">${index < completedCount ? "★" : "☆"}</span>`
  ).join("");
}

function ensureAccountProgress(account) {
  account.progress ??= {};
  return account.progress;
}

function getMission() {
  return getCampaign().missions[state.missionIndex];
}

function isIntroExampleMission(levelKey = state.levelKey, missionIndex = state.missionIndex) {
  return levelKey === "cadet" && missionIndex === 0;
}

function getInitialDrone() {
  const pad = getMission().launchPad;
  return { x: pad.x + pad.width / 2, y: pad.y + pad.height / 2, altitude: 0, heading: 0, airborne: false, sampleFlashMs: 0, photoFlashMs: 0, sampledTargets: new Set(), photographedTargets: new Set() };
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
  entryOverlay.classList.toggle("hidden", signedIn);
  appShell.classList.toggle("teacher-mode", teacherMode);
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
  stopDroneHum();
  state.playing = false;
  state.animationQueue = [];
  state.currentStep = null;
  state.lastTime = 0;
  state.visitedCheckpoints = new Set();
  state.collectedSamples = new Set();
  state.photographedAnimals = new Set();
  state.currentMissionSuccess = false;
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
  if (!getStudentUnlockedMissionKeys().has(missionEntry.missionKey)) {
    renderStudentProgress();
    updateFeedback("Complete the previous mission before opening this one.", "Locked", "chip-warn");
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
    studentProgressBadge.textContent = "0 complete";
    certificatePanel.classList.add("hidden");
    certificateActions.innerHTML = "";
    return;
  }
  const account = getCurrentAccount();
  const progress = ensureAccountProgress(account);
  const summary = getStudentCompletionSummary(account);
  const missions = summary.missions;
  const unlockedMissionKeys = getStudentUnlockedMissionKeys();
  const completedCount = summary.completedCount;
  studentProgressBadge.textContent = `${completedCount} complete`;
  studentProgressBadge.className = `chip ${completedCount ? "chip-good" : "chip-calm"}`;
  if (
    !missions.some((entry) => entry.missionKey === state.selectedStudentMissionKey) ||
    !unlockedMissionKeys.has(state.selectedStudentMissionKey)
  ) {
    state.selectedStudentMissionKey = missions[0]?.missionKey ?? "";
  }

  studentMissionSelect.innerHTML = missions.map((entry) => `
    <option
      value="${entry.missionKey}"
      ${entry.missionKey === state.selectedStudentMissionKey ? "selected" : ""}
      ${unlockedMissionKeys.has(entry.missionKey) ? "" : "disabled"}
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
  const unlocked = unlockedMissionKeys.has(selectedMission.missionKey);
  const roleProgressHtml = getRoleProgressSummaries(account).map((role) => `
    <div class="role-progress-card ${role.complete ? "complete" : ""}">
      <div>
        <strong>${role.label}</strong>
        <div>${role.completedCount} of ${role.totalCount} missions complete</div>
      </div>
      <div class="role-award">
        <div class="role-stars" aria-label="${role.completedCount} of ${role.totalCount} stars earned">
          ${renderStarRow(role.completedCount, role.totalCount)}
        </div>
        ${role.complete ? `<span class="role-badge">${role.label} Badge</span>` : `<span class="role-badge clear">Badge locked</span>`}
      </div>
    </div>
  `).join("");
  const selectedMissionHtml = `<div class="checkpoint-item ${complete ? "complete" : ""}"><div><strong>${selectedMission.levelLabel} - ${selectedMission.missionTitle}</strong><div>${complete ? `Completed${completedAt ? ` on ${new Date(completedAt).toLocaleDateString()}` : ""}` : unlocked ? "Ready to attempt" : "Locked until the previous mission is completed"}</div></div><span class="chip ${complete ? "chip-good" : unlocked ? "chip-calm" : "chip-warn"}">${complete ? "Done" : unlocked ? "Unlocked" : "Locked"}</span></div>`;
  studentProgressList.innerHTML = roleProgressHtml + selectedMissionHtml;

  const availableCertificates = getAvailableCertificates(account);
  certificatePanel.classList.toggle("hidden", availableCertificates.length === 0);
  if (!availableCertificates.length) {
    certificateSummaryText.textContent = "Certificates unlock as each field role is completed.";
    certificateDateText.textContent = "Finish all four missions in a field role to unlock that PDF certificate.";
    certificateActions.innerHTML = "";
    return;
  }
  certificateSummaryText.textContent = `${account.name ?? account.email} has unlocked ${availableCertificates.length} certificate${availableCertificates.length === 1 ? "" : "s"}.`;
  certificateDateText.textContent = summary.allComplete
    ? "All field role certificates are ready, and the full lab certificate is unlocked."
    : "Each completed field role now has a downloadable PDF certificate.";
  certificateActions.innerHTML = availableCertificates.map((certificate) => `
    <button
      type="button"
      class="secondary-button certificate-download-button"
      data-certificate-type="${certificate.type}"
      data-certificate-level="${certificate.levelKey}"
    >
      Download ${certificate.label}
    </button>
  `).join("");
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
  const missionKey = getMissionKey();
  const previousEntry = progress[missionKey] ?? {};
  progress[missionKey] = {
    ...previousEntry,
    completed: true,
    completedAt: new Date().toISOString(),
    levelKey: state.levelKey,
    missionIndex: state.missionIndex,
    savedCode: codeEditor.value,
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
    return "Field Ecologist missions can be solved with direct commands. Students can also use if statements, such as if (sensingColor(\"grey\")) { ... }, if they want to.";
  }
  if (state.levelKey === "first_officer") {
    return "Research Lead missions can be solved with direct commands. Students can also use loops, such as for (let i = 0; i < 3; i++) { ... }, if they want to.";
  }
  if (state.levelKey === "captain") {
    return "Senior Scientist missions can be solved with direct commands. If statements, loops, and colour sensing are still available for students who want to use them.";
  }
  return "Field Trainee missions can be solved with direct commands, and students can try extra coding structures later if they want to.";
}

function getMissionColorZones() {
  if (getMission().colorZones) {
    return getMission().colorZones;
  }
  return [
    { color: "grey", label: "Grey Soil Patch", x: 215, y: 330, width: 120, height: 85, fill: "rgba(170, 180, 191, 0.32)", stroke: "#b8c1ca" },
    { color: "blue", label: "Blue Water Patch", x: 485, y: 155, width: 120, height: 85, fill: "rgba(89, 215, 255, 0.24)", stroke: "#72dfff" },
    { color: "gold", label: "Gold Pollen Patch", x: 735, y: 345, width: 120, height: 85, fill: "rgba(255, 215, 140, 0.24)", stroke: "#ffd78c" },
  ];
}

function getSavedMissionCode(levelKey = state.levelKey, missionIndex = state.missionIndex) {
  const account = getCurrentAccount();
  if (!account || account.role !== "student") {
    return "";
  }
  const progress = ensureAccountProgress(account);
  return progress[getMissionKey(levelKey, missionIndex)]?.savedCode ?? "";
}

function loadMissionEditor(exampleOverride) {
  const savedCode = getSavedMissionCode();
  codeEditor.value = exampleOverride
    ?? (savedCode || (isIntroExampleMission() ? getMission().example : ""));
}

function updateFeedback(message, badgeText, badgeClass) {
  feedbackText.textContent = message;
  feedbackBadge.textContent = badgeText;
  feedbackBadge.className = `chip ${badgeClass}`;
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
  const photoRequirements = mission.photoRequirements ?? [];
  storyText.textContent = `${campaign.title}: ${mission.story}`;
  missionText.textContent = mission.objective;
  missionIndexBadge.textContent = `Mission ${state.missionIndex + 1} of ${campaign.missions.length}`;
  missionGoalBadge.textContent = mission.goalLabel;
  prevMissionButton.disabled = state.missionIndex === 0;
  nextMissionButton.disabled = state.missionIndex === campaign.missions.length - 1;
  exampleButton.disabled = !isIntroExampleMission();
  exampleButton.title = isIntroExampleMission() ? "Load the first worked example." : "Examples are only available on the first mission.";
  const checkpointHtml = mission.checkpoints.map((checkpoint) => {
    const complete = state.visitedCheckpoints.has(checkpoint.id);
    return `<div class="checkpoint-item ${complete ? "complete" : ""}"><div><strong>${checkpoint.name}</strong><div>${complete ? "Surveyed by drone" : "Pending survey"}</div></div><span class="chip ${complete ? "chip-good" : "chip-calm"}">${complete ? "Done" : "Pending"}</span></div>`;
  }).join("");
  const sampleHtml = sampleRequirements.map((sample) => {
    const complete = state.collectedSamples.has(sample.label);
    return `<div class="checkpoint-item ${complete ? "complete" : ""}"><div><strong>${sample.label}</strong><div>${complete ? `Collected from ${sample.color} land patch` : `Land on the ${sample.color} patch and use takeSample();`}</div></div><span class="chip ${complete ? "chip-good" : "chip-calm"}">${complete ? "Sampled" : "Pending"}</span></div>`;
  }).join("");
  const photoHtml = photoRequirements.map((photo) => {
    const complete = state.photographedAnimals.has(photo.label);
    return `<div class="checkpoint-item ${complete ? "complete" : ""}"><div><strong>${photo.label}</strong><div>${complete ? `Photo captured: ${photo.animal}` : `Hover over the ${photo.animal} marker and use takePhoto();`}</div></div><span class="chip ${complete ? "chip-good" : "chip-calm"}">${complete ? "Photographed" : "Pending"}</span></div>`;
  }).join("");
  checkpointList.innerHTML = checkpointHtml + sampleHtml + photoHtml;

  if (state.playing) {
    missionState.textContent = "Flying";
    missionState.className = "chip chip-warn";
  } else if (state.currentMissionSuccess && allVisited) {
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
  stopDroneHum();
  state.drone = getInitialDrone();
  state.animationQueue = [];
  state.currentStep = null;
  state.lastTime = 0;
  state.playing = false;
  state.visitedCheckpoints = new Set();
  state.collectedSamples = new Set();
  state.photographedAnimals = new Set();
  state.trail = [{ x: state.drone.x, y: state.drone.y }];
  state.currentMissionSuccess = false;
  updateHud();
  renderMissionPanel();
  updateFeedback("Drone reset. Run the mission program when you're ready.", "Ready", "chip-calm");
}

function applyLevel(levelKey) {
  if (isStudentUser()) {
    const targetMissionKey = getMissionKey(levelKey, 0);
    if (!getStudentUnlockedMissionKeys().has(targetMissionKey)) {
      updateFeedback("Complete the earlier missions before moving to that level.", "Locked", "chip-warn");
      return;
    }
  }
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
  const nextMissionKey = getMissionKey(state.levelKey, nextIndex);
  if (isStudentUser() && !getStudentUnlockedMissionKeys().has(nextMissionKey)) {
    updateFeedback("Complete the previous mission before opening this one.", "Locked", "chip-warn");
    return;
  }
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
  validateRankRequirements(parsed.meta);
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
  const needsValue = !["takeOff", "land", "takeSample", "takePhoto"].includes(name);
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
  return zone ? zone.color.toLowerCase() : "";
}

function getSampleTargetAtPosition(x, y) {
  const sensedColor = getSensedColor(x, y);
  if (!sensedColor) return null;
  return (getMission().sampleRequirements ?? []).find((sample) => sample.color.toLowerCase() === sensedColor) ?? null;
}

function getPhotoTargetAtPosition(x, y) {
  return (getMission().photoRequirements ?? []).find((photo) =>
    Math.hypot(x - photo.x, y - photo.y) <= photo.radius + 16
  ) ?? null;
}

function validateRankRequirements(meta) {
  return meta;
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
  if (command.name === "takePhoto") {
    if (!previewDrone.airborne) throw new Error(`Line ${command.line}: takePhoto() only works while the drone is airborne above an animal marker.`);
    const photoTarget = getPhotoTargetAtPosition(previewDrone.x, previewDrone.y);
    if (!photoTarget) throw new Error(`Line ${command.line}: takePhoto() only works when hovering over a required animal marker.`);
    previewDrone.photographedTargets.add(photoTarget.label);
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
    if (command.name === "takePhoto") {
      if (!previewDrone.airborne) throw new Error(`Line ${command.line}: takePhoto() only works while the drone is airborne above an animal marker.`);
      const photoTarget = getPhotoTargetAtPosition(previewDrone.x, previewDrone.y);
      if (!photoTarget) throw new Error(`Line ${command.line}: takePhoto() only works when hovering over a required animal marker.`);
      previewDrone.photographedTargets.add(photoTarget.label);
      queue.push({ type: "photo", photoLabel: photoTarget.label, animal: photoTarget.animal, duration: 600, label: `Photographing ${photoTarget.animal}` });
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

function getMissionAudioContext() {
  if (!AudioContextClass) {
    return null;
  }
  if (!missionAudioContext) {
    try {
      missionAudioContext = new AudioContextClass();
    } catch (error) {
      return null;
    }
  }
  return missionAudioContext;
}

function unlockMissionAudio() {
  const audioContext = getMissionAudioContext();
  if (audioContext?.state === "suspended") {
    const resumeAudio = audioContext.resume();
    if (resumeAudio?.catch) {
      resumeAudio.catch(() => {});
    }
  }
}

function playTone(frequency, startOffset, duration, volume = 0.12) {
  const audioContext = getMissionAudioContext();
  if (!audioContext || audioContext.state === "suspended") {
    return;
  }
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const startTime = audioContext.currentTime + startOffset;
  const endTime = startTime + duration;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, endTime);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(endTime + 0.02);
}

function startDroneHum() {
  const audioContext = getMissionAudioContext();
  if (!audioContext || audioContext.state === "suspended" || droneHum) {
    return;
  }
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(82, audioContext.currentTime);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(180, audioContext.currentTime);
  gain.gain.setValueAtTime(0.001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.035, audioContext.currentTime + 0.18);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  droneHum = { oscillator, gain };
}

function stopDroneHum() {
  if (!droneHum || !missionAudioContext) {
    droneHum = null;
    return;
  }
  const { oscillator, gain } = droneHum;
  const stopTime = missionAudioContext.currentTime + 0.12;
  try {
    gain.gain.cancelScheduledValues(missionAudioContext.currentTime);
    gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.001), missionAudioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, stopTime);
    oscillator.stop(stopTime + 0.02);
  } catch (error) {
    // Audio nodes may already be stopped if the browser interrupts playback.
  }
  droneHum = null;
}

function playCrashSound() {
  unlockMissionAudio();
  stopDroneHum();
  playTone(150, 0, 0.12, 0.18);
  playTone(92, 0.1, 0.18, 0.16);
  playTone(55, 0.24, 0.26, 0.14);
}

function playSuccessSound(type) {
  unlockMissionAudio();
  if (type === "sample") {
    playTone(660, 0, 0.12, 0.13);
    playTone(880, 0.12, 0.16, 0.11);
    return;
  }
  if (type === "photo") {
    playTone(988, 0, 0.08, 0.1);
    playTone(1319, 0.08, 0.08, 0.08);
    return;
  }
  if (type === "mission") {
    playTone(523, 0, 0.1, 0.12);
    playTone(659, 0.1, 0.1, 0.12);
    playTone(784, 0.2, 0.2, 0.13);
    return;
  }
  playTone(740, 0, 0.1, 0.1);
  playTone(988, 0.1, 0.12, 0.09);
}

function startProgram() {
  if (!isStudentUser()) {
    updateFeedback("Sign in with a student account to run missions and save progress.", "Login Required", "chip-bad");
    return;
  }
  try {
    unlockMissionAudio();
    stopDroneHum();
    const parsedProgram = parseProgram(codeEditor.value);
    state.animationQueue = buildAnimationQueue(parsedProgram.commands);
    state.drone = getInitialDrone();
    state.currentStep = null;
    state.lastTime = 0;
    state.playing = true;
    state.visitedCheckpoints = new Set();
    state.collectedSamples = new Set();
    state.photographedAnimals = new Set();
    state.trail = [{ x: state.drone.x, y: state.drone.y }];
    state.currentMissionSuccess = false;
    renderCommandPreview(parsedProgram.commands);
    updateHud();
    renderMissionPanel();
    updateFeedback("Program accepted. The mission simulation is running.", "Running", "chip-warn");
  } catch (error) {
    stopDroneHum();
    state.playing = false;
    state.animationQueue = [];
    state.currentStep = null;
    state.currentMissionSuccess = false;
    renderMissionPanel();
    updateFeedback(error.message, "Error", "chip-bad");
    if (error.message.includes("exits the mission flight area")) {
      playCrashSound();
    }
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
        startDroneHum();
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
        playSuccessSound("mission");
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
    if (!state.drone.airborne) {
      stopDroneHum();
    }
  }
  if (step.type === "rotate") {
    state.drone.heading = step.targetHeading;
  }
  if (step.type === "sample") {
    const alreadyCollected = state.collectedSamples.has(step.sampleLabel);
    state.collectedSamples.add(step.sampleLabel);
    state.drone.sampleFlashMs = 2000;
    if (!alreadyCollected) {
      playSuccessSound("sample");
    }
  }
  if (step.type === "photo") {
    const alreadyPhotographed = state.photographedAnimals.has(step.photoLabel);
    state.photographedAnimals.add(step.photoLabel);
    state.drone.photoFlashMs = 1600;
    if (!alreadyPhotographed) {
      playSuccessSound("photo");
    }
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
      playSuccessSound("checkpoint");
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
  playCrashSound();
  state.playing = false;
  state.animationQueue = [];
  state.currentStep = null;
  state.currentMissionSuccess = false;
  state.visitedCheckpoints = new Set();
  state.collectedSamples = new Set();
  state.photographedAnimals = new Set();
  state.trail = [];
  state.drone = getInitialDrone();
  state.lastTime = 0;
  updateHud();
  renderMissionPanel();
  updateFeedback("The drone crashed in a no-fly zone and restarted at the launch pad. Adjust the code and try again.", "Crash", "chip-bad");
}

function evaluateMissionSuccess() {
  const allVisited = getMission().checkpoints.every((checkpoint) => state.visitedCheckpoints.has(checkpoint.id));
  const allSamplesCollected = (getMission().sampleRequirements ?? []).every((sample) => state.collectedSamples.has(sample.label));
  const allPhotosTaken = (getMission().photoRequirements ?? []).every((photo) => state.photographedAnimals.has(photo.label));
  return allVisited && allSamplesCollected && allPhotosTaken && isOnLaunchPad() && !state.drone.airborne && state.drone.altitude === 0;
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

function drawPhotoTargets(timestamp) {
  (getMission().photoRequirements ?? []).forEach((photo, index) => {
    const complete = state.photographedAnimals.has(photo.label);
    const pulse = 1 + Math.sin(timestamp / 260 + index) * 0.1;
    ctx.beginPath();
    ctx.fillStyle = complete ? "rgba(173, 247, 111, 0.2)" : "rgba(255, 255, 255, 0.12)";
    ctx.arc(photo.x, photo.y, photo.radius * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = complete ? getCampaign().rotorColor : "#ffd78c";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = complete ? getCampaign().rotorColor : "#ffd78c";
    ctx.beginPath();
    ctx.arc(photo.x, photo.y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#09161e";
    ctx.font = "700 14px Chakra Petch";
    ctx.fillText("A", photo.x - 5, photo.y + 5);
    ctx.fillStyle = "#eef8ff";
    ctx.font = "700 12px Chakra Petch";
    ctx.fillText(photo.animal.toUpperCase(), photo.x + 18, photo.y - 14);
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
  ctx.fillStyle = state.drone.photoFlashMs > 0 ? "#ffd78c" : state.drone.sampleFlashMs > 0 ? "#74e26f" : "#eff9ff";
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
  if (!isIntroExampleMission()) {
    updateFeedback("Examples are only available on the first mission. Write your own program for this challenge.", "Student Code", "chip-calm");
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
certificateActions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-certificate-type]");
  if (!button) {
    return;
  }
  const certificate = getAvailableCertificates().find((entry) =>
    entry.type === button.dataset.certificateType && entry.levelKey === button.dataset.certificateLevel
  );
  if (!certificate) {
    return;
  }
  downloadCertificate(certificate);
});

loadAccounts();
loadSession();
setAuthMode("login");
setAuthKind("student");
refreshAuthUi();
applyLevel("cadet");
drawScene(0);
requestAnimationFrame(stepAnimation);
