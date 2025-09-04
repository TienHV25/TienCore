import { hashPasswordHelper } from './../../helper/utils';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs';
import { MailService } from '@/mail/mail.service';
import { ChangePasswordAuthDto } from '@/auth/dto/create-auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private mailService: MailService,
  ) {}

  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email: email });
    if (user) return true;
    return false;
  };

  async create(createUserDto: CreateUserDto) {
    return this.preRegister(createUserDto);
  }

  // Pre-register (send email)
  async preRegister(createUserDto: CreateUserDto) {
    const hashPassword = await hashPasswordHelper(createUserDto.password);
    const checkEmailExist = await this.isEmailExist(createUserDto.email);
    
    if (!checkEmailExist) {
      const activationCode = uuidv4(); 
      
      const newUser = await this.userModel.create({
        ...createUserDto,
        password: hashPassword,
        isActive: false,
        codeId: activationCode, 
        codeExpired: dayjs().add(5, 'minutes')
      });

      try {
        await this.mailService.sendActivationEmail(
          newUser.email,
          newUser.email,
          activationCode, 
        );
      } catch (err) {
        // Rollback
        await this.userModel.deleteOne({ _id: newUser._id });
        throw new BadRequestException('Không thể gửi email kích hoạt, vui lòng thử lại.');
      }

      return {
        message: 'Tài khoản đã được tạo. Vui lòng kiểm tra email để kích hoạt.',
        userId: newUser._id
      };
    } else {
      throw new BadRequestException(`Email ${createUserDto.email} đã tồn tại !`);
    }
  }

  //  Verify activation code
  async verifyActivation(email: string, code: string) {
    const user = await this.userModel.findOne({ 
      email: email,
      codeId: code,
      isActive: false,
      codeExpired: { $gt: new Date() } // Check code has expired
    });

    if (!user) {
      throw new BadRequestException('Mã kích hoạt không hợp lệ hoặc đã hết hạn.');
    }

    // active user
    await this.userModel.updateOne(
      { _id: user._id },
      { 
        isActive: true,
        codeId: null, // delete code id
        codeExpired: null 
      }
    );

    return {
      message: 'Tài khoản đã được kích hoạt thành công!',
      user: {
        _id: user._id,
        email: user.email,
        isActive: true
      }
    };
  }

  // resend code id
  async resendActivationCode(email: string) {
    const user = await this.userModel.findOne({ 
      email: email, 
      isActive: false 
    });

    if (!user) {
      throw new BadRequestException('Không tìm thấy tài khoản chưa kích hoạt với email này.');
    }

    const newActivationCode = uuidv4();
    
    await this.userModel.updateOne(
      { _id: user._id },
      { 
        codeId: newActivationCode,
        codeExpired: dayjs().add(5, 'minutes')
      }
    );

    try {
      await this.mailService.sendActivationEmail(
        user.email,
        user.email,
        newActivationCode,
      );
    } catch (err) {
      throw new BadRequestException('Không thể gửi lại email kích hoạt.');
    }

    return {
      message: 'Mã kích hoạt mới đã được gửi đến email của bạn.'
    };
  }

  async findAll(query: any, current: number, pageSize: number) {
     const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * (pageSize);

    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select("-password")
      .sort(sort as any);

     return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      results //kết quả query
    }

  }

  async findOne(id: number): Promise<User> {
    const findUser = await this.userModel.findOne({ _id: id });
    return findUser;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email: email });
  }

  async update(updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      updateUserDto._id,
      { ...updateUserDto },
      { new: true }
    );
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    if (mongoose.isValidObjectId(id)) {
      const result = await this.userModel.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        throw new NotFoundException(`User với ID ${id} không tồn tại`);
      }
    } else {
      throw new BadRequestException(`ID ${id} không đúng định dạng`);
    }
  }

   async retryPassword(email: string) {
    //check email
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }


    //send Email
    const codeId = uuidv4();

    //update user
    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes')
    })

    //send email
    await this.mailService.sendChangePasswordEmail(
          user.email,
          user.email,
          codeId, 
    );
    return { _id: user._id, email: user.email }
  }

  async changePassword(data: ChangePasswordAuthDto) {
    if (data.confirmPassword !== data.password) {
      throw new BadRequestException("Mật khẩu/xác nhận mật khẩu không chính xác.")
    }

    //check email
    const user = await this.userModel.findOne({ email: data.email });

    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }

    //check expire code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);

    if (isBeforeCheck) {
      //valid => update password
      const newPassword = await hashPasswordHelper(data.password);
      await user.updateOne({ password: newPassword })
      return { isBeforeCheck };
    } else {
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn")
    }

  }

}