import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RestoDec = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const resto = request.resto;

    return key ? resto?.[key] : resto;
  },
);
