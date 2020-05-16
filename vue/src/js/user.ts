import jwtDecode from 'jwt-decode';

export enum UserRole {
  Admin = 0,
  Power,
  User,
  Demo
}

export class User {
  public static readonly roleTexts: string[] = [
    'Pääkäyttäjä',
    'Tehokäyttäjä',
    'Käyttäjä',
    'Demokäyttäjä'
  ];

  public data: any;
  
  constructor(token: string) {
    this.data = jwtDecode(token);
  }

  public get id(): number {
    return this.data.id;
  }

  public get firstName(): string {
    return this.data.firstName;
  }

  public get lastName(): string {
    return this.data.lastName;
  }

  public get fullName(): string {
    return this.firstName + ' ' + this.lastName;
  }

  public get email(): string {
    return this.data.email;
  }

  public get phone(): string {
    return this.data.phone;
  }

  public get role(): UserRole {
    return this.data.role;
  }

  public get roleText(): string {
    return User.roleTexts[this.role];
  }

  public get showSender(): boolean {
    return this.role <= UserRole.Power;
  }

  public get hideSender(): boolean {
    return !this.showSender;
  }

  public get showLicenseNumber(): boolean {
    return this.role <= UserRole.Power;
  }

  public get hideLicenseNumber(): boolean {
    return !this.showLicenseNumber;
  }
}
