import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
        @IsNotEmpty({ message: "Name không được để trống "})
        name: string;

        @IsNotEmpty({ message: "Email không được để trống "})
        @IsEmail()
        email: string;

        @IsNotEmpty({ message: "Password không được để trống "})
        @IsString()
        password: string;

        
        phone: string;

       
        address: string;

        
        image: string;
}
