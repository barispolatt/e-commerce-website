export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  birthdate: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
