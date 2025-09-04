import { IsEmail, IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateUserDto {
        name: string;

        @IsNotEmpty({ message: "Email không được để trống "})
        @IsEmail()
        email: string;

        @IsNotEmpty({ message: "Password không được để trống "})
        @IsString()
        password: string;

        @IsOptional()
        @IsString()
        phone?: string;

        @IsOptional()
        @IsString()
        address?: string;

        @IsOptional()
        @IsString()
        image?: string;
}
