export enum UserType {
  Admin = 0,
  Power,
  User,
  Demo
}


export class User {
  public id: number;
  public firstName: string;
  public lastName: string;
  public type: UserType;
  
  constructor(id: number, firstName: string, lastName: string, type: UserType) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.type = type;
  }

  public get name() {
    return this.firstName + ' ' + this.lastName;
  }
}
