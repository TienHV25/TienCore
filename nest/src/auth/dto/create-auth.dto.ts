import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty({ message: "Email không được để trống "})
    @IsEmail()
    email: string;

    @IsNotEmpty({ message: "Password không được để trống "})
    @IsString()
    password: string;
    
}

export class ChangePasswordAuthDto {
    @IsNotEmpty({ message: "code không được để trống" })
    code: string;

    @IsNotEmpty({ message: "password không được để trống" })
    password: string;

    @IsNotEmpty({ message: "confirmPassword không được để trống" })
    confirmPassword: string;

    @IsNotEmpty({ message: "email không được để trống" })
    email: string;

}

