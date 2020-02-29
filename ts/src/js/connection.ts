import { RestDatabase } from '@/lib/dataset'


class User {
  public username: string;
  public name: string;
  
  constructor(username: string, name: string) {
    this.username = username;
    this.name = name;
  }
}

export default class Connection {
  public database: RestDatabase;
  public user: User | null = null;

  constructor() {
    this.database = new RestDatabase('http://localhost:3000', '/api/');
  }

  login(username: string, password: string) {
    const name = 'Ilkka Salmenius';

    if (password == 'ohion330') {
      this.user = new User(username, name);
    }
  }

  logout() {
    this.user = null;
  }
}