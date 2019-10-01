import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";

const resolvers = {
  Subscription: {
    RideStatusSubscription: {
      subscribe: withFilter(
        (_, __, { pubSub }) => pubSub.asyncIterator("rideUpdate"),
        (payload, args, { context }) => {
          const user: User = context.currentUser;
          const {
            RideStatusSubscription: { driverId, passangerId }
          } = payload;
          return user.id === driverId || user.id === passangerId;
        }
      )
    }
  }
};

export default resolvers;
