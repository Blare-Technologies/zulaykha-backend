import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestWithUser as NewRequestWithUser } from 'src/interfaces/nest.interface';
import { CreateUserDto as NewCreateUserDto } from 'src/zod/user.zod';
import { Auth as NewAuth } from '../decorators/auth.decorator';
import { AuthService as NewAuthService } from '../services/auth.service';

@ApiTags('NewAuthentication')
@Controller('new_auth')
export class NewAuthController {
  constructor(private readonly authService: NewAuthService) {}

  @Post('new-register')
  newRegister(@Body() createUserDto: NewCreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('new-login')
  newLogin(@Body() loginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @NewAuth()
  @ApiBearerAuth('NewAuthorization')
  @Get('new-profile')
  newProfile(@Request() req: NewRequestWithUser) {
    return this.authService.profile(req.user);
  }

  @Post('new-forget-password')
  newForgetPassword(@Body() createUserDto: NewCreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('new-log-out')
  newLogout() {
    return {};
  }
  
  @Get('new-activate-cp')
  newActivate() {
    return false;
  }
}
