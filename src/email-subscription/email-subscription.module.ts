import { Module } from '@nestjs/common';
import { EmailSubscriptionService } from './email-subscription.service';
import { EmailSubscriptionResolver } from '../graphql/email-subscription.resolver';

@Module({
  providers: [EmailSubscriptionService, EmailSubscriptionResolver],
  exports: [EmailSubscriptionService],
})
export class EmailSubscriptionModule {}
