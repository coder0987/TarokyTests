const fs = require("fs");

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
        if (key === "deck") {
          rules.basic.deck = value;
        } else if (key === "decks") {
          rules.basic.numDecks = parseInt(value, 10);
        } else if (key === "deckScaling") {
          rules.basic.deckScaling = parseInt(value, 10);
        } else if (key === "playerMin") {
          rules.basic.playerMin = parseInt(value, 10);
        } else if (key === "playerMax") {
          rules.basic.playerMax = parseInt(value, 10);
        } else if (key === "type") {
          rules.basic.type = value;
        } else if (key === "start") {
          rules.basic.start = value;
        }

        // Handle player and board objects
        if (key === "player" || key === "board") {
          rules[key] = parseObject(value);
        }

        // Handle phases and steps
        if (key === "phase") {
          currentPhase = value;
          if (!rules.phases[currentPhase]) {
            rules.phases[currentPhase] = { steps: {}, order: [] };
          }
        } else if (key === "step" && currentPhase) {
          currentStep = value;
          rules.phases[currentPhase].steps[currentStep] = [];
          rules.phases[currentPhase].order.push(value);
        }

        // Handle instruction lines (starting with 'i:')
        if (key.startsWith("i") && currentPhase && currentStep) {
          const instruction = parseInstruction(value);
          rules.phases[currentPhase].steps[currentStep].push(instruction);
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
  const targets = parts[0].split(",");
  const action = parts[1];
  let items = parts[2];
  let custom = {};

  if (parts.length > 3) {
    const customField = parts.slice(3).join(":");
    if (customField.startsWith("{") && customField.endsWith("}")) {
      custom = parseObject(customField);
    } else {
      custom = customField;
    }
  }

  if (items && items.startsWith("[") && items.endsWith("]")) {
    items = items
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim());
  }

  return {
    targets: targets,
    action: action,
    items: items,
    custom: custom,
  };
}

module.exports = RulesReader;
