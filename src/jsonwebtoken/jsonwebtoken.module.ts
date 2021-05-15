import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwt } from 'src/_shared_/config/env.config';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: jwt.secret,
      signOptions: {
        expiresIn: jwt.expiresIn,
      },
    }),
  ],
  exports: [JwtModule],
})
export class JsonWebTokenModule {}
