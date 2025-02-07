import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class TraderResolver {
  @Query(() => String)
  hello() {
    return 'Hello, GraphQL!';
  }
}
