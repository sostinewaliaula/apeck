import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import type { StrategyOptionsWithRequest } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    const refreshSecret = configService.get<string>('jwt.refreshSecret');
    if (!refreshSecret) {
      throw new Error('Refresh secret missing');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshSecret,
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  async validate(req: Request, payload: any) {
    const tokenExtractor = ExtractJwt.fromAuthHeaderAsBearerToken();
    const token = tokenExtractor(req);
    return { ...payload, token };
  }
}

