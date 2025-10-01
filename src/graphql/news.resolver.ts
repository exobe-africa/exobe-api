import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NewsService } from '../news/news.service';
import { NewsArticleType } from './types/news.type';
import { CreateNewsArticleInput, UpdateNewsArticleInput } from './dto/news-article.input.js';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Resolver(() => NewsArticleType)
export class NewsResolver {
  constructor(private news: NewsService) {}

  @Query(() => [NewsArticleType])
  newsArticles(@Args('category', { nullable: true }) category?: string) {
    return this.news.list(category);
  }

  @Query(() => [NewsArticleType])
  featuredNewsArticles() {
    return this.news.featured();
  }

  @Query(() => NewsArticleType, { nullable: true })
  newsArticle(@Args('id') id: string) {
    return this.news.byId(id);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => NewsArticleType)
  createNewsArticle(@Args('input') input: CreateNewsArticleInput) {
    return this.news.create(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => NewsArticleType)
  updateNewsArticle(
    @Args('id') id: string,
    @Args('input') input: UpdateNewsArticleInput,
  ) {
    return this.news.update(id, input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => Boolean)
  deleteNewsArticle(@Args('id') id: string) {
    return this.news.delete(id).then(() => true);
  }
}


