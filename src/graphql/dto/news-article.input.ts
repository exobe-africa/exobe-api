import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDateString, IsInt, IsOptional, Min } from 'class-validator';

@InputType()
export class CreateNewsArticleInput {
  @Field()
  title: string;
  @Field()
  excerpt: string;
  @Field()
  content: string;
  @Field()
  author: string;
  @Field()
  @IsDateString()
  publishedAt: string;
  @Field()
  @IsInt()
  @Min(0)
  readTime: number;
  @Field()
  category: string;
  @Field()
  image: string;
  @Field({ nullable: true })
  @IsOptional()
  featured?: boolean;
  @Field({ nullable: true })
  @IsOptional()
  status?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@InputType()
export class UpdateNewsArticleInput {
  @Field({ nullable: true })
  @IsOptional()
  title?: string;
  @Field({ nullable: true })
  @IsOptional()
  excerpt?: string;
  @Field({ nullable: true })
  @IsOptional()
  content?: string;
  @Field({ nullable: true })
  @IsOptional()
  author?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  readTime?: number;
  @Field({ nullable: true })
  @IsOptional()
  category?: string;
  @Field({ nullable: true })
  @IsOptional()
  image?: string;
  @Field({ nullable: true })
  @IsOptional()
  featured?: boolean;
  @Field({ nullable: true })
  @IsOptional()
  status?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}


