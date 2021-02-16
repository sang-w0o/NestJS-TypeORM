import {
  UnauthorizedException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { checkExpDate } from '../utils/auth/jwt-token-util';

interface IUserRequest extends Request {
  accessToken: string;
}
@Injectable()
export class UserAuthMiddleware implements NestMiddleware {
  private checkSchemaAndReturnToken(header: string): string {
    const splitTemp = header.split(' ');
    if (splitTemp[0] !== 'Bearer') {
      throw new UnauthorizedException(
        'Authorization Header Schema must be Bearer.',
      );
    } else {
      return splitTemp[1];
    }
  }
  use(req: IUserRequest, res: Response, next: NextFunction) {
    const token = this.checkSchemaAndReturnToken(req.header('Authorization'));
    checkExpDate(token);
    req.accessToken = token;
    next();
  }
}
