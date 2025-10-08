import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { EmailSubscriptionService } from '../email-subscription/email-subscription.service';
import { SubscribeEmailInput } from './dto/email-subscription.input';

@Resolver('EmailSubscription')
export class EmailSubscriptionResolver {
  constructor(private readonly emailSubscriptionService: EmailSubscriptionService) {}

  @Mutation(() => String)
  async subscribeToNewsletter(@Args('input') input: SubscribeEmailInput): Promise<string> {
    await this.emailSubscriptionService.subscribeToNewsletter(input);
    return 'Successfully subscribed to newsletter!';
  }

  @Mutation(() => String)
  async unsubscribeFromNewsletter(@Args('email') email: string): Promise<string> {
    await this.emailSubscriptionService.unsubscribeFromNewsletter(email);
    return 'Successfully unsubscribed from newsletter!';
  }
}
