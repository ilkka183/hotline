import { RestDatabase } from '@/lib/dataset'


class User {
  constructor() {
    this.username = null;
    this.name = null;
  }
}

export default class Connection {
  constructor() {
    this.database = new RestDatabase('http://localhost:3000', '/api/');
    this.user = null;
  }

  login(username, password) {
    const name = 'Ilkka Salmenius';

    if (password == 'ohion330') {
      this.user = new User(username, name);
    }
  }

  logout() {
    this.user = null;
  }
}