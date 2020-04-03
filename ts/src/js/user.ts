export enum UserType {
  Admin = 0,
  Power,
  User,
  Demo
}


export class User {
  public static readonly typeTexts: string[] = ['Pääkäyttäjä', 'Tehokäyttäjä', 'Käyttäjä', 'Demokäyttäjä'];

  public id: number;
  public type: UserType;
  public firstName: string;
  public lastName: string;
  public phone: string;
  
  constructor(id: number, type: UserType, firstName: string, lastName: string, phone: string) {
    this.id = id;
    this.type = type;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
  }

  public get name() {
    return this.firstName + ' ' + this.lastName;
  }

  public get typeText() {
    return User.typeTexts[this.type];
  }
}
