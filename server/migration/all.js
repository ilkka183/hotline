const ADODB = require('node-adodb');

const insertKoulut = require('./koulu');
const insertHenkilot = require('./henkilo');
const insertQuestions = require('./question');

const source = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=hotline.mdb;');

let koulut = [];
let henkilot = [];
let questions = [];

function loadKoulut(source, destination) {
  source.query('SELECT * FROM Koulu')
    .then(data => {
      koulut = data;
      loadHenkilot(source, destination);
    })
    .catch(error => console.error(error));
}

function loadHenkilot(source, destination) {
  source.query('SELECT * FROM Henkilo')
    .then(data => {
      henkilot = data;
      loadQuestions(source, destination);
    })
    .catch(error => console.error(error));
}

function loadQuestions(source, destination) {
  source.query('SELECT * FROM HL_Question')
    .then(data => {
      questions = data;

      insertKoulut(destination, koulut);
      insertHenkilot(destination, koulut, henkilot);
      insertQuestions(destination, henkilot, questions);

      console.log(koulut.length);
      console.log(henkilot.length);
      console.log(questions.length);
    })
    .catch(error => console.error(error));
}

function migrate(destination) {
  loadKoulut(source, destination);
}

module.exports = migrate;
