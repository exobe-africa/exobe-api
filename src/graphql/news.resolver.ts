import { Args, Query, Resolver } from '@nestjs/graphql';
import { NewsService } from '../news/news.service';
import { NewsArticleType } from './types/news.type';

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
}


