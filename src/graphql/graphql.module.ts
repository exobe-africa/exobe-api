import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersResolver } from './users.resolver';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { AuthResolver } from './auth.resolver.js';
import { ApplicationsModule } from '../applications/applications.module';
import { ApplicationsResolver } from './applications.resolver.js';
import { ContactModule } from '../contact/contact.module';
import { ContactResolver } from './contact.resolver.js';
import { NewsModule } from '../news/news.module';
import { NewsResolver } from './news.resolver.js';
import { CatalogModule } from '../catalog/catalog.module';
import { CatalogResolver } from './catalog.resolver.js';
import { AnalyticsModule } from '../analytics/analytics.module';
import { AnalyticsResolver } from './analytics.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      csrfPrevention: true,
      cache: 'bounded',
      context: ({ req, request, res, reply }) => ({
        req: req || request,
        reply: reply || res,
      }),
    }),
    UsersModule,
    AuthModule,
    ApplicationsModule,
    ContactModule,
    NewsModule,
    CatalogModule,
    AnalyticsModule,
  ],
  providers: [UsersResolver, AuthResolver, ApplicationsResolver, ContactResolver, NewsResolver, CatalogResolver, AnalyticsResolver],
})
export class GraphqlModule {}