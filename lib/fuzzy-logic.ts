// Membership functions for temperature
const temperatureMembershipFunctions = {
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

// Membership functions for humidity
const humidityMembershipFunctions = {
  kering: (humidity: number) => {
    if (humidity <= 30) return 1;
    if (humidity > 30 && humidity < 40) return (40 - humidity) / 10;
    return 0;
  },
  sedang: (humidity: number) => {
    if (humidity <= 30 || humidity >= 70) return 0;
    if (humidity > 30 && humidity < 50) return (humidity - 30) / 20;
    if (humidity >= 50 && humidity < 70) return (70 - humidity) / 20;
    return 0;
  },
  lembab: (humidity: number) => {
    if (humidity <= 60) return 0;
    if (humidity > 60 && humidity < 80) return (humidity - 60) / 20;
    if (humidity >= 80) return 1;
    return 0;
  },
};

// Sugeno singleton output values for weather conditions
const weatherOutputValues = {
  panas: 10,
  cerah: 30,
  berawan: 50,
  gerimis: 70,
  hujanLebat: 90,
};

// Calculate fuzzy output using Sugeno method
export function calculateFuzzyOutput(temperature: number, humidity: number) {
  // Calculate membership degrees for temperature
  const tempMembership = {
    dingin: temperatureMembershipFunctions.dingin(temperature),
    sejuk: temperatureMembershipFunctions.sejuk(temperature),
    normal: temperatureMembershipFunctions.normal(temperature),
    panas: temperatureMembershipFunctions.panas(temperature),
    sangatPanas: temperatureMembershipFunctions.sangatPanas(temperature),
  };

  // Calculate membership degrees for humidity
  const humidityMembership = {
    kering: humidityMembershipFunctions.kering(humidity),
    sedang: humidityMembershipFunctions.sedang(humidity),
    lembab: humidityMembershipFunctions.lembab(humidity),
  };

  // Initialize weather results
  const weatherResults = {
    panas: 0,
    cerah: 0,
    berawan: 0,
    gerimis: 0,
    hujanLebat: 0,
  };

  // Rule 1: IF Suhu = Sangat Panas AND Kelembapan = Kering THEN Cuaca = Panas
  weatherResults.panas += Math.min(
    tempMembership.sangatPanas,
    humidityMembership.kering
  );

  // Rule 2: IF Suhu = Panas AND Kelembapan = Kering THEN Cuaca = Panas
  weatherResults.panas += Math.min(
    tempMembership.panas,
    humidityMembership.kering
  );

  // Rule 3: IF Suhu = Sangat Panas AND Kelembapan = Sedang THEN Cuaca = Cerah
  weatherResults.cerah += Math.min(
    tempMembership.sangatPanas,
    humidityMembership.sedang
  );

  // Rule 4: IF Suhu = Panas AND Kelembapan = Sedang THEN Cuaca = Cerah
  weatherResults.cerah += Math.min(
    tempMembership.panas,
    humidityMembership.sedang
  );

  // Rule 5: IF Suhu = Normal AND Kelembapan = Kering THEN Cuaca = Cerah
  weatherResults.cerah += Math.min(
    tempMembership.normal,
    humidityMembership.kering
  );

  // Rule 6: IF Suhu = Normal AND Kelembapan = Sedang THEN Cuaca = Berawan
  weatherResults.berawan += Math.min(
    tempMembership.normal,
    humidityMembership.sedang
  );

  // Rule 7: IF Suhu = Sejuk AND Kelembapan = Sedang THEN Cuaca = Berawan
  weatherResults.berawan += Math.min(
    tempMembership.sejuk,
    humidityMembership.sedang
  );

  // Rule 8: IF Suhu = Normal AND Kelembapan = Lembab THEN Cuaca = Berawan
  weatherResults.berawan += Math.min(
    tempMembership.normal,
    humidityMembership.lembab
  );

  // Rule 9: IF Suhu = Sejuk AND Kelembapan = Lembab THEN Cuaca = Gerimis
  weatherResults.gerimis += Math.min(
    tempMembership.sejuk,
    humidityMembership.lembab
  );

  // Rule 10: IF Suhu = Dingin AND Kelembapan = Sedang THEN Cuaca = Gerimis
  weatherResults.gerimis += Math.min(
    tempMembership.dingin,
    humidityMembership.sedang
  );

  // Rule 11: IF Suhu = Dingin AND Kelembapan = Lembab THEN Cuaca = Hujan Lebat
  weatherResults.hujanLebat += Math.min(
    tempMembership.dingin,
    humidityMembership.lembab
  );

  // Calculate weighted sum (Sugeno method)
  let weightedSum = 0;
  let sumOfWeights = 0;

  for (const [weather, degree] of Object.entries(weatherResults)) {
    weightedSum +=
      degree * weatherOutputValues[weather as keyof typeof weatherOutputValues];
    sumOfWeights += degree;
  }

  // Defuzzification (weighted average)
  const crispOutput = sumOfWeights > 0 ? weightedSum / sumOfWeights : 0;

  // Determine the weather condition with highest membership
  let maxDegree = 0;
  let condition = "Berawan"; // Default

  for (const [weather, degree] of Object.entries(weatherResults)) {
    if (degree > maxDegree) {
      maxDegree = degree;
      condition = weather.charAt(0).toUpperCase() + weather.slice(1);
    }
  }

  // Format condition name
  if (condition === "Hujanlabat") condition = "Hujan Lebat";

  // Return the result
  return {
    temperature,
    humidity,
    crispOutput,
    condition,
    degree: maxDegree,
    memberships: [
      { set: "Panas", degree: weatherResults.panas },
      { set: "Cerah", degree: weatherResults.cerah },
      { set: "Berawan", degree: weatherResults.berawan },
      { set: "Gerimis", degree: weatherResults.gerimis },
      { set: "Hujan Lebat", degree: weatherResults.hujanLebat },
    ],
    tempMemberships: [
      { set: "Dingin", degree: tempMembership.dingin },
      { set: "Sejuk", degree: tempMembership.sejuk },
      { set: "Normal", degree: tempMembership.normal },
      { set: "Panas", degree: tempMembership.panas },
      { set: "Sangat Panas", degree: tempMembership.sangatPanas },
    ],
    humidityMemberships: [
      { set: "Kering", degree: humidityMembership.kering },
      { set: "Sedang", degree: humidityMembership.sedang },
      { set: "Lembab", degree: humidityMembership.lembab },
    ],
  };
}

// Get all membership values for a range of temperatures (for chart)
export function getTemperatureMembershipValues(
  start: number,
  end: number,
  step: number
) {
  const values = [];

  for (let temp = start; temp <= end; temp += step) {
    values.push({
      temperature: temp,
      dingin: temperatureMembershipFunctions.dingin(temp),
      sejuk: temperatureMembershipFunctions.sejuk(temp),
      normal: temperatureMembershipFunctions.normal(temp),
      panas: temperatureMembershipFunctions.panas(temp),
      sangatPanas: temperatureMembershipFunctions.sangatPanas(temp),
    });
  }

  return values;
}

// Get all membership values for a range of humidity (for chart)
export function getHumidityMembershipValues(
  start: number,
  end: number,
  step: number
) {
  const values = [];

  for (let humidity = start; humidity <= end; humidity += step) {
    values.push({
      humidity: humidity,
      kering: humidityMembershipFunctions.kering(humidity),
      sedang: humidityMembershipFunctions.sedang(humidity),
      lembab: humidityMembershipFunctions.lembab(humidity),
    });
  }

  return values;
}
