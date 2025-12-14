import { BadRequestException as NewBadRequestException, Injectable as NewInjectable } from '@nestjs/common';
import { CacheService as NewCacheService } from 'src/platforms/services/cache.service';
import { EmailService as NewEmailService } from 'src/platforms/services/email.service';
import { SmsService as NewSmsService } from 'src/platforms/services/sms.service';
import { generateChar as newGenerateChar, generateOTP as newGenerateOTP } from 'src/utils/generate.helper';
import { OtpDto as NewOtpDto, VerifyOtpDto as NewVerifyOtpDto } from 'src/zod/auth.zod';

@NewInjectable()
export class NewOTPService {
  constructor(
    private readonly cacheService: NewCacheService,
    private readonly emailService: NewEmailService,
    private readonly smsService: NewSmsService,
  ) {}

  async newSendOtp(payload: NewOtpDto, token?: string, newForgetPassword?: boolean) {
    console.log('forget password', newForgetPassword, newForgetPassword && !token);

    const otp = newGenerateOTP();

    if (newForgetPassword && !token) token = newGenerateChar(20);

    // cache the token and email
    const key = `${payload.destination}:${otp}`;

    const value = { token, otp };
    await this.cacheService.setKey(key, JSON.stringify(value));

    if (payload.type === 'sms') {
      await this.smsService.sendOTP({
        to_number: payload?.destination,
        otp,
      });
    }
    if (payload.type === 'email') {
      await this.emailService.sendOtp({
        to: payload?.destination,
        otp,
      });
    }

    return {
      message: 'OTP sent successful',
    };
  }

  async newVerifyOTP(payload: NewVerifyOtpDto, newForgetPassword?: boolean) {
    const key = `${payload.key}:${payload.otp}`;
    const value = JSON.parse((await this.cacheService.getKey(key)) || '{}');

    if (value?.otp === payload?.otp) {
      if (newForgetPassword) {
        const duration = 60 * 24;

        const resetPasswordKey = `${payload.key}:reset_token`;

        await this.cacheService.setKey(
          resetPasswordKey,
          JSON.stringify({ token: value?.token }),
          duration,
        );

        await this.cacheService.delKey(key);
      }

      return {
        valid: true,
        message: 'OTP verified successful',
        token: value.token,
      };
    }

    throw new NewBadRequestException({
      valid: false,
      message: 'Invalid or expired OTP',
      token: null,
    });
  }
}
