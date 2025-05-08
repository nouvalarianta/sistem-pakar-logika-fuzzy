// Membership functions for temperature
const membershipFunctions = {
  dingin: (temp: number) => {
    if (temp <= 15) return 1;
    if (temp > 15 && temp < 20) return (20 - temp) / 5;
    return 0;
  },
  sejuk: (temp: number) => {
    if (temp <= 15 || temp >= 25) return 0;
    if (temp > 15 && temp < 20) return (temp - 15) / 5;
    if (temp >= 20 && temp < 25) return (25 - temp) / 5;
    return 0;
  },
  normal: (temp: number) => {
    if (temp <= 20 || temp >= 30) return 0;
    if (temp > 20 && temp < 25) return (temp - 20) / 5;
    if (temp >= 25 && temp < 30) return (30 - temp) / 5;
    return 0;
  },
  panas: (temp: number) => {
    if (temp <= 25 || temp >= 35) return 0;
    if (temp > 25 && temp < 30) return (temp - 25) / 5;
    if (temp >= 30 && temp < 35) return (35 - temp) / 5;
    return 0;
  },
  sangatPanas: (temp: number) => {
    if (temp <= 30) return 0;
    if (temp > 30 && temp < 35) return (temp - 30) / 5;
    if (temp >= 35) return 1;
    return 0;
  },
};

// Sugeno singleton output values
const outputValues = {
  dingin: 10,
  sejuk: 17.5,
  normal: 25,
  panas: 32.5,
  sangatPanas: 40,
};

// Calculate fuzzy output using Sugeno method
export function calculateFuzzyOutput(temperature: number) {
  // Calculate membership degrees for each set
  const membershipDegrees = {
    dingin: membershipFunctions.dingin(temperature),
    sejuk: membershipFunctions.sejuk(temperature),
    normal: membershipFunctions.normal(temperature),
    panas: membershipFunctions.panas(temperature),
    sangatPanas: membershipFunctions.sangatPanas(temperature),
  };

  // Calculate weighted sum (Sugeno method)
  let weightedSum = 0;
  let sumOfWeights = 0;

  for (const [set, degree] of Object.entries(membershipDegrees)) {
    weightedSum += degree * outputValues[set as keyof typeof outputValues];
    sumOfWeights += degree;
  }

  // Defuzzification (weighted average)
  const crispOutput = sumOfWeights > 0 ? weightedSum / sumOfWeights : 0;

  // Determine the linguistic output with highest membership
  let maxDegree = 0;
  let condition = "Normal";

  for (const [set, degree] of Object.entries(membershipDegrees)) {
    if (degree > maxDegree) {
      maxDegree = degree;
      condition = set.charAt(0).toUpperCase() + set.slice(1);
    }
  }

  // Format condition name
  if (condition === "Dingin") condition = "Dingin";
  else if (condition === "Sejuk") condition = "Sejuk";
  else if (condition === "Normal") condition = "Normal";
  else if (condition === "Panas") condition = "Panas";
  else if (condition === "Sangatpanas") condition = "Sangat Panas";

  // Return the result
  return {
    temperature,
    crispOutput,
    condition,
    degree: maxDegree,
    memberships: [
      { set: "Dingin", degree: membershipDegrees.dingin },
      { set: "Sejuk", degree: membershipDegrees.sejuk },
      { set: "Normal", degree: membershipDegrees.normal },
      { set: "Panas", degree: membershipDegrees.panas },
      { set: "Sangat Panas", degree: membershipDegrees.sangatPanas },
    ],
  };
}

// Get all membership values for a range of temperatures (for chart)
export function getMembershipValues(start: number, end: number, step: number) {
  const values = [];

  for (let temp = start; temp <= end; temp += step) {
    values.push({
      temperature: temp,
      dingin: membershipFunctions.dingin(temp),
      sejuk: membershipFunctions.sejuk(temp),
      normal: membershipFunctions.normal(temp),
      panas: membershipFunctions.panas(temp),
      sangatPanas: membershipFunctions.sangatPanas(temp),
    });
  }

  return values;
}
