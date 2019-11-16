import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import { GetRideResponse, GetRideQueryArgs } from "../../../types/graph";
import User from "../../../entities/User";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
  Query: {
    GetRide: privateResolver(
      async (_, args: GetRideQueryArgs, { req }): Promise<GetRideResponse> => {
        const user: User = req.user;
        try {
          const ride = await Ride.findOne(
            { id: args.rideId },
            { relations: ["passenger", "driver"] }
          );
          if (ride) {
            if (ride.passengerId === user.id || ride.driverId === user.id) {
              return {
                ok: true,
                error: null,
                ride
              };
            } else {
              return {
                ok: false,
                error: "권한이 없습니다.",
                ride: null
              };
            }
          } else {
            return {
              ok: false,
              error: "운전요청을 찾을 수 없습니다.",
              ride: null
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            ride: null
          };
        }
      }
    )
  }
};

export default resolvers;
