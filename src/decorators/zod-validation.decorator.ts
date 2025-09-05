import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

export const ZodBody = (schema: ZodSchema) => {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    const pipe = new ZodValidationPipe(schema);
    return pipe;
  };
};

export const ZodQuery = (schema: ZodSchema) => {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    const pipe = new ZodValidationPipe(schema);
    return pipe;
  };
};
