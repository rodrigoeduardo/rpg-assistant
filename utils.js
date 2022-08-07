const { userMention, inlineCode } = require("discord.js");

const allowedDices = [
  "d2",
  "d3",
  "d4",
  "d6",
  "d8",
  "d10",
  "d12",
  "d20",
  "d100",
];

function rollDices(userId, quantity, diceAndModifiers) {
  let reply;

  const diceSides = getDiceSides(diceAndModifiers);
  let modifiers = diceAndModifiers.replace("d" + diceSides, "");

  try {
    modifiers = eval(modifiers);
    if (!modifiers) {
      modifiers = 0;
    }
  } catch (err) {
    console.log(err);
    reply = "Invalid modifiers! Please insert a valid expression.";
    return reply;
  }

  if (diceSides) {
    const rolls = [];
    let sum = 0;

    let randomNumber;
    for (let i = 0; i < quantity; i++) {
      randomNumber = Math.floor(Math.random() * diceSides) + 1;
      rolls.push(randomNumber);
      sum += randomNumber;
    }

    reply = `${userMention(userId)} rolled **${
      quantity + "d" + diceSides
    }** and got ${getRolls(rolls)} (${
      modifiers >= 0 ? "+" + modifiers : modifiers
    }) = **${sum + modifiers}**`;
  } else {
    reply = `${userMention(userId)}, you can only roll ${inlineCode(
      allowedDices.join(", ")
    )}!`;
  }

  return reply;
}

function getDiceSides(diceAndModifiers) {
  let diceSides = null;

  allowedDices.forEach((dice) => {
    if (diceAndModifiers.startsWith(dice)) {
      diceSides = parseInt(dice.slice(1));
    }
  });

  return diceSides;
}

function getRolls(rollsArray) {
  const greatestRoll = getGreatestValueInArray(rollsArray);
  let rollNumbers = "";

  rollsArray.forEach((roll, index) => {
    if (index === rollsArray.length - 1) {
      rollNumbers += roll;
    } else {
      rollNumbers += roll + ", ";
    }
  });

  const rolls = `[${rollNumbers.replace(
    greatestRoll,
    "**" + greatestRoll + "**"
  )}]`;

  return rolls;
}

function getGreatestValueInArray(array) {
  let greatestValue = 0;

  array.forEach((value) => {
    if (value > greatestValue) {
      greatestValue = value;
    }
  });

  return greatestValue;
}

module.exports = { rollDices };
