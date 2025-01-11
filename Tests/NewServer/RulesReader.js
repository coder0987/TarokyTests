const fs = require("fs");
const { ITEMS, ACTIONS, TARGETS, GAME_TYPE } = require('./Constants');

const RulesReader = {
  loadJSON: (filePath) => {
    let file = fs.readFileSync(filePath, "utf-8");
    try {
        return JSON.parse(file);
    } catch (error) {
        Logger.error(error);
        return null;
    }
  },
  parseGameConfig: (rules, filePath) => {
    const content = fs.readFileSync(filePath, "utf-8");

    const lines = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    rules.basic = {};
    rules.phases = {};

    let currentPhase = null;
    let currentStep = null;

    lines.forEach((line) => {
      // Match and process key-value pairs
      const match = line.match(/^([^:]+):(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();

        // Process basic properties
        switch (key) {
            case "deck":
              rules.basic.deck = value;
              break;
            case "decks":
              rules.basic.numDecks = parseInt(value, 10);
              break;
            case "deckScaling":
              rules.basic.deckScaling = parseInt(value, 10);
              break;
            case "playerMin":
              rules.basic.playerMin = parseInt(value, 10);
              break;
            case "playerMax":
              rules.basic.playerMax = parseInt(value, 10);
              break;
            case "type":
              rules.basic.type = value;
              break;
            case "start":
              rules.basic.start = value;
              break;
            case "board":
                rules.basic.board = parseObject(value);
                break;
            case "pointers":
                rules.basic.pointers = parseObject(value);
                break;
            case "initial":
                rules.basic.initial = parseObject(value);
                break;
            case "player":
                rules.basic.player = parseObject(value);
                break;
            case "phase":
                currentPhase = value;
                if (!rules.phases[currentPhase]) {
                    rules.phases[currentPhase] = { steps: {}, order: [] };
                }
                break;
            case "step":
                if (currentPhase) {
                    currentStep = value;
                    rules.phases[currentPhase].steps[currentStep] = [];
                    rules.phases[currentPhase].order.push(value);
                }
                break;
            case "i":
                if (currentPhase && currentStep) {
                    const instruction = parseInstruction(value);
                    rules.phases[currentPhase].steps[currentStep].push(instruction);
                }
                break;
            default:
                Logger.log("Unrecognized property " + key + " with value " + value);
          }
      }
    });
  },
};

// Function to parse an object-like string (e.g., {key: value, key2: value2})
function parseObject(str) {
  try {
    return JSON.parse(
      str.replace(/([a-zA-Z0-9]+):/g, '"$1":').replace(/'/g, '"')
    );
  } catch (e) {
    try {
      return JSON.parse(str);
    } catch (ignore) {}
    console.log(str);
    console.error("Error parsing object:", e);
    return {};
  }
}

// Function to parse an instruction line into a structured object
function parseInstruction(instruction) {
  const parts = instruction.split(":");
  const targets = parts[0].split(",").map((target) => {
    return TARGETS[target.toUpperCase()] || target;
  });
  const action = ACTIONS[parts[1].toUpperCase()] || parts[1];
  let items = parts[2];
  let custom = {};

  if (items) {
    if (items.startsWith("[") && items.endsWith("]")) {
      items = items.slice(1, -1).split(",").map((item) => {
        return ITEMS[item.trim().toUpperCase()] || item.trim();
      });
    } else {
      items = ITEMS[items.trim().toUpperCase()] || items.trim();
    }
  }

  if (parts.length > 3) {
    const customField = parts.slice(3).join(":");
    if (customField.startsWith("{") && customField.endsWith("}")) {
      custom = parseObject(customField);
    } else {
      custom = customField;
    }
  }

  return {
    targets: targets,
    action: action,
    items: items,
    custom: custom,
  };
}

module.exports = RulesReader;
