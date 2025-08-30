import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty({ message: "Email không được để trống "})
    @IsEmail()
    email: string;

    @IsNotEmpty({ message: "Password không được để trống "})
    @IsString()
    password: string;
    
}
