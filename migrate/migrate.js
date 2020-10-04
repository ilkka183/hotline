const ADODB = require('node-adodb');

const insertMerkit = require('./tables/merkki');
const insertMallit = require('./tables/malli');
const insertKoulut = require('./tables/koulu');
const insertHenkilot = require('./tables/henkilo');
const insertQuestions = require('./tables/question');
const insertAnswers = require('./tables/answer');

const source = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=hotline.mdb;');

const destination = require('../server/connection');
destination.connect();


let merkit = [];
let mallit = [];
let koulut = [];
let henkilot = [];
let questions = [];
let answers = [];

async function copyMerkit(source, destination) {
  try {
    merkit = await source.query('SELECT * FROM Merkki')
    console.log('Merkki', merkit.length);
    insertMerkit(destination, merkit);
  } catch (error) {
    console.error(error);
  }
}

async function copyMallit(source, destination) {
  try {
    mallit = await source.query('SELECT * FROM Malli')
    console.log('Malli', mallit.length);
    insertMallit(destination, mallit);
  } catch (error) {
    console.error(error);
  }
}

async function copyKoulut(source, destination) {
  try {
    koulut = await source.query('SELECT * FROM Koulu')
    console.log('Koulu', koulut.length);
    insertKoulut(destination, koulut);
  } catch (error) {
    console.error(error);
  }
}

async function copyHenkilot(source, destination) {
  try {
    henkilot = await source.query('SELECT * FROM Henkilo')
    console.log('Henkilo', henkilot.length);
    insertHenkilot(destination, koulut, henkilot);
  } catch (error) {
    console.error(error);
  }
}

async function copyQuestions(source, destination) {
  try {
    questions = await source.query('SELECT * FROM HL_Question')
    console.log('Question', questions.length);
    insertQuestions(destination, henkilot, questions);
  } catch (error) {
    console.error(error);
  }
}

async function copyAnswers(source, destination) {
  try {
    answers = await source.query('SELECT * FROM HL_Answer')
    console.log('Answer', answers.length);
    insertAnswers(destination, henkilot, questions, answers);
  } catch (error) {
    console.error(error);
  }
}

async function migrate() {
  await copyMerkit(source, destination);
  await copyMallit(source, destination);

  await copyKoulut(source, destination);
  await copyHenkilot(source, destination);
  await copyQuestions(source, destination);
  await copyAnswers(source, destination);

  console.log('Done');
}

migrate();
