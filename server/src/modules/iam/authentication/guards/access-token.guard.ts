import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import accessTokenConfig from 'src/modules/iam/config/access-token.config';
import { REQUEST_USER_KEY } from 'src/modules/iam/iam.constants';
import {
  COOKIE_ACCESS_TOKEN,
  ERR_MSG_INVALID_TOKEN,
  ERR_MSG_LOGIN_REQUIRED,
  ERR_MSG_TOKEN_EXPIRED,
} from '../authentication.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(accessTokenConfig.KEY)
    private readonly accessTokenConfiguration: ConfigType<
      typeof accessTokenConfig
    >,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.signedCookies[COOKIE_ACCESS_TOKEN];

    if (!accessToken) {
      throw new UnauthorizedException(ERR_MSG_LOGIN_REQUIRED);
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        accessToken,
        this.accessTokenConfiguration,
      );

      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      if (
        error instanceof JsonWebTokenError &&
        error.name === 'TokenExpiredError'
      ) {
        throw new UnauthorizedException(ERR_MSG_TOKEN_EXPIRED);
      }

      throw new UnauthorizedException(ERR_MSG_INVALID_TOKEN);
    }

    return true;
  }
}
