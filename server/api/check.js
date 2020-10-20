const axios = require('axios');

async function fetch() {
  try {
    const response = await axios.get('https://www.regcheck.org.uk/api/reg.asmx/CheckFinland?RegistrationNumber=ZLP-833&username=Ilkka183')
    console.log(response.data);
  } catch (error) {
    console.error(error)
  }
}

fetch();
