//generate random number = random txt+ random number
const randomTxt = Math.random().toString(36).substring(7).toUpperCase();
const randomNumber = Math.floor(1000 + Math.random() * 90000);

const randomNumbers = randomNumber + randomTxt;
module.exports = randomNumbers;
