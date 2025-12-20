/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export const StringRequired = (name: string, min?: number, max?: number) =>
  applyDecorators(
    ApiProperty({ required: true, minLength: min, maxLength: max }),
    IsString({ message: `${name} must be string` }),
    IsNotEmpty({ message: `${name} is required` }),
    ...(min !== undefined
      ? [
          MinLength(min, {
            message: `${name} at least ${min} characters`,
          }),
        ]
      : []),
    ...(max !== undefined
      ? [MaxLength(max, { message: `${name} at most ${max} characters` })]
      : []),
  );

export const StringNotRequired = (name: string) =>
  applyDecorators(
    ApiProperty({ required: false }),
    IsString({ message: `${name} must be string` }),
    IsOptional(),
  );

export const NumberRequired = (name: string, min?: number, max?: number) =>
  applyDecorators(
    ApiProperty({ required: true, minLength: min, maxLength: max }),
    Type(() => Number),
    IsNumber({}, { message: `${name} must be number` }),
    IsNotEmpty({ message: `${name} is required` }),
    ...(min !== undefined
      ? [
          MinLength(min, {
            message: `${name} at least ${min} characters`,
          }),
        ]
      : []),
    ...(max !== undefined
      ? [MaxLength(max, { message: `${name} at most ${max} characters` })]
      : []),
  );

export const NumberNotRequired = (name: string) =>
  applyDecorators(
    ApiProperty({ required: false }),
    Type(() => Number),
    IsNumber({}, { message: `${name} must be number` }),
    IsOptional(),
  );

export const BooleanRequired = (name: string) =>
  applyDecorators(
    ApiProperty({ required: true }),
    Type(() => Boolean),
    IsBoolean({ message: `${name} must be boolean` }),
    IsNotEmpty({ message: `${name} is required` }),
  );

export const BooleanNotRequired = (name: string) =>
  applyDecorators(
    ApiProperty({ required: false }),
    Type(() => Boolean),
    IsBoolean({ message: `${name} must be boolean` }),
    IsOptional(),
  );

export const EnumRequired = (name: string, enumType: object) =>
  applyDecorators(
    ApiProperty({
      required: true,
      enum: enumType,
    }),
    IsEnum(enumType, {
      message: `${name} must be: ${Object.values(enumType).join(', ')}`,
    }),
    IsNotEmpty({ message: `${name} is required` }),
  );

export const EnumNotRequired = (name: string, enumType: object) =>
  applyDecorators(
    ApiProperty({ required: false, enum: enumType }),
    IsEnum(enumType, {
      message: `${name} must be: ${Object.values(enumType).join(', ')}`,
    }),
    IsOptional(),
  );

export const ArrayRequired = (
  name: string,
  type: any,
  minSize?: number,
  maxSize?: number,
) =>
  applyDecorators(
    ApiProperty({
      required: true,
      type: 'array',
      isArray: true,
      items: { type: type.name },
    }),
    IsArray({ message: `${name} must be array` }),
    ArrayNotEmpty({ message: `${name} is required` }),
    Type(() => type),
    ...(minSize !== undefined
      ? [
          ArrayMinSize(minSize, {
            message: `${name} must be at least ${minSize} item`,
          }),
        ]
      : []),
    ...(maxSize !== undefined
      ? [
          ArrayMaxSize(maxSize, {
            message: `${name} maximum ${maxSize} item`,
          }),
        ]
      : []),
  );

export const ArrayNotRequired = (
  name: string,
  type: any,
  minSize?: number,
  maxSize?: number,
) =>
  applyDecorators(
    ApiProperty({
      required: false,
      type: 'array',
      isArray: true,
      items: { type: type?.name },
    }),
    IsArray({ message: `${name} must be array` }),
    Type(() => type),
    ...(minSize !== undefined
      ? [
          ArrayMinSize(minSize, {
            message: `${name} at least ${minSize} item`,
          }),
        ]
      : []),
    ...(maxSize !== undefined
      ? [
          ArrayMaxSize(maxSize, {
            message: `${name} maximum ${maxSize} item`,
          }),
        ]
      : []),
    IsOptional(),
  );
