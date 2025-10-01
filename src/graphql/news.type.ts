import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NewsArticleType {
  @Field(() => ID)
  id: string;
  @Field()
  title: string;
  @Field()
  excerpt: string;
  @Field()
  content: string;
  @Field()
  author: string;
  @Field()
  publishedAt: Date;
  @Field()
  readTime: number;
  @Field()
  category: string;
  @Field()
  image: string;
  @Field()
  featured: boolean;
}


