const ADODB = require('node-adodb');

const insertKoulut = require('./koulu');
const insertHenkilot = require('./henkilo');
const insertQuestions = require('./question');
const insertAnswers = require('./answer');

const source = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=hotline.mdb;');

let koulut = [];
let henkilot = [];
let questions = [];
let answers = [];

async function loadKoulut(source) {
  try {
    koulut = await source.query('SELECT * FROM Koulu')
  } catch (error) {
    console.error(error);
  }
}

async function loadHenkilot(source) {
  try {
    henkilot = await source.query('SELECT * FROM Henkilo')
  } catch (error) {
    console.error(error);
  }
}

async function loadQuestions(source) {
  try {
    questions = await source.query('SELECT * FROM HL_Question')
  } catch (error) {
    console.error(error);
  }
}

async function loadAnswers(source) {
  try {
    answers = await source.query('SELECT * FROM HL_Answer')
  } catch (error) {
    console.error(error);
  }
}

async function migrate(destination) {
  await loadKoulut(source);
  console.log('Koulu', koulut.length);
  insertKoulut(destination, koulut);

  await loadHenkilot(source);
  console.log('Henkilo', henkilot.length);
  insertHenkilot(destination, koulut, henkilot);

  await loadQuestions(source);
  console.log('Question', questions.length);
  insertQuestions(destination, henkilot, questions);

  await loadAnswers(source);
  console.log('Answer', answers.length);
  insertAnswers(destination, henkilot, questions, answers);

  console.log('Done');
}

module.exports = migrate;
