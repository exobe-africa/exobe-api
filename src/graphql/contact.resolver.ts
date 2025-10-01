import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ContactService } from '../contact/contact.service';
import { ContactMessageInput } from './dto/contact-message.input';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
class ContactMessageResult {
  @Field()
  id: string;
}

@Resolver()
export class ContactResolver {
  constructor(private contact: ContactService) {}

  @Mutation(() => ContactMessageResult)
  sendContactMessage(@Args('input') input: ContactMessageInput) {
    return this.contact.sendMessage(input);
  }
}


