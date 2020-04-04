export enum UserRole {
  Admin = 0,
  Power,
  User,
  Demo
}


export class User {
  public static readonly typeTexts: string[] = ['Pääkäyttäjä', 'Tehokäyttäjä', 'Käyttäjä', 'Demokäyttäjä'];

  public id: number;
  public role: UserRole;
  public firstName: string;
  public lastName: string;
  public phone: string;
  public token: string;
  
  constructor(id: number, role: UserRole, firstName: string, lastName: string, phone: string, token: string) {
    this.id = id;
    this.role = role;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.token = token;
  }

  public get name() {
    return this.firstName + ' ' + this.lastName;
  }

  public get roleText() {
    return User.typeTexts[this.role];
  }
}
