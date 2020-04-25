export enum UserRole {
  Admin = 0,
  Power,
  User,
  Demo
}


export class User {
  public static readonly typeTexts: string[] = ['Pääkäyttäjä', 'Tehokäyttäjä', 'Käyttäjä', 'Demokäyttäjä'];

  public token: string;
  public id: number;
  public role: UserRole;
  public firstName: string;
  public lastName: string;
  public phone: string;
  
  constructor(token: string, data: any) {
    this.token = token;
    this.id = data.id;
    this.role = data.role;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.phone = data.phone;
  }

  public get name() {
    return this.firstName + ' ' + this.lastName;
  }

  public get roleText() {
    return User.typeTexts[this.role];
  }
}
