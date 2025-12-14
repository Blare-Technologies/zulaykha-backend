import {
  BadRequestException as NewBadRequestException,
  ForbiddenException as NewForbiddenException,
  Injectable as NewInjectable,
} from '@nestjs/common';
import { ConfigService as NewConfigService } from '@nestjs/config';
import { JwtService as NewJwtService } from '@nestjs/jwt';
import { UserModel as NewUserModel } from 'src/entities/models/user.model';
import { UserAuthenticationModel as NewUserAuthenticationModel } from 'src/entities/models/user_auth.model';
import { EmailService as NewEmailService } from 'src/platforms/services/email.service';
import { UserModelRelations as NewUserModelRelations } from 'src/types/models';
import { generateCustomChar as newGenerateCustomChar } from 'src/utils/generate.helper';
import { comparePassword as newComparePassword, hashPassword as newHashPassword } from 'src/utils/password.bcrypt';

@NewInjectable()
export class NewAuthService {
  constructor(
    private readonly userModel: NewUserModel,
    private readonly userAuthenticationModel: NewUserAuthenticationModel,
    private readonly jwtService: NewJwtService,
    private readonly configService: NewConfigService,
    private readonly emailService: NewEmailService,
  ) {}

  /**
   *
   * @param payload any
   * @description this function accept payload of any type and encode it into a jwt token,
   *              this token should be stored in a client secured http cookie or a user mobile device
   * @returns string
   */
  private __generateToken(user: NewUserModelRelations): string {
    const payload = {
      id: user.id,
      session: user?.Authentication?.session,
    };

    return this.jwtService.sign(payload, {
      privateKey: this.configService.get<string>('NEW_JWT_SECRET'),
    });
  }

  async newLogin(loginDto) {
    console.log(loginDto);
    // async login(loginDto: LoginDto) {
    // retrieving user by email address
    const user = await this.userModel.findUser({
      param: loginDto.param,
      include: ['Authentication'],
      role: loginDto?.role,
    });

    // checking if user exist or not
    if (!user) throw new NewBadRequestException('Invalid credentials');

    // comparing password whether it matches with what exist in the database
    const passwordMatch: boolean = await newComparePassword(
      loginDto.password,
      user?.Authentication?.password || '',
    );

    // if password does not match throw exception
    if (!passwordMatch) throw new NewBadRequestException('Invalid credentials');

    // prevent user from logging in if suspended
    if (user.suspended)
      throw new NewForbiddenException('Your account has been suspended.');

    // check if there is no session, that means the user has log out on devices if it does not exist
    if (!user?.Authentication?.session) {
      try {
        const session = newGenerateCustomChar(20);
        await this.userAuthenticationModel.update(user?.id, {
          session,
        });
        if (user.Authentication) user.Authentication.session = session;
      } catch (error) {
        throw new NewBadRequestException('Unable to create session');
      }
    }

    // register device device
    if (loginDto?.device_name && loginDto?.ip_address && loginDto?.location) {
      await this.userAuthenticationModel.insertNewDevice({
        user_id: user?.id,
        device_name: loginDto?.device_name,
        ip_address: loginDto?.ip_address,
        location: loginDto?.location,
      });

      this.emailService.signInAlert({
        to: user?.email,
        name: user?.first_name,
        device: loginDto?.device_name,
        timestamp: new Date(Date.now()).toLocaleString(),
        location: loginDto?.location,
      });
    }

    //  user secured token
    const token = this.__generateToken(user);
  }
}
