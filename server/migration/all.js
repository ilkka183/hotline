const ADODB = require('node-adodb');

const copyKoulu = require('./koulu');
const copyHenkilo = require('./henkilo');
const copyQuestion = require('./question');

const source = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=hotline.mdb;');

function migrate(destination) {
  copyKoulu(source, destination);
  copyHenkilo(source, destination);
  copyQuestion(source, destination);
}

module.exports = migrate;
