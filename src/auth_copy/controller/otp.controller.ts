import {
  Body,
  Controller,
  DefaultValuePipe,
  ParseBoolPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OtpDto as NewOtpDto, VerifyOtpDto as NewVerifyOtpDto } from 'src/zod/auth.zod';
import { OTPService as NewOTPService } from '../services/otp.service';

@ApiTags('NEW_AUTH/OTP')
@Controller('new_auth/otp')
export class NewOTPController {
  constructor(private readonly otpService: NewOTPService) {}

  @Post('/new-send')
  newSendOtp(
    @Body() payload: NewOtpDto,
    @Query('new-forget-password', new DefaultValuePipe(false), ParseBoolPipe)
    newForgetPassword?: boolean,
  ) {
    return this.otpService.sendOtp(payload, undefined, newForgetPassword);
  }

  @Post('/new-verify')
  newVerifyOtp(
    @Body() payload: NewVerifyOtpDto,
    @Query('new-forget-password') newForgetPassword?: boolean,
  ) {
    return this.otpService.verifyOTP(payload, newForgetPassword);
  }
}
