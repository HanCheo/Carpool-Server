import privateResolver from "../../../utils/privateResolver";
import { getRepository, Between } from "typeorm";
import Ride from "../../../entities/Ride";
import { GetNearbyRideResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import User from "../../../entities/User";

const resolvers: Resolvers = {
  Query: {
    GetNearbyRide: privateResolver(
      async (_, __, { req }): Promise<GetNearbyRideResponse> => {
        const user: User = req.user;
        if (!user.isRiding && user.isDriving) {
          const { lastLat, lastLng } = user;
          try {
            const ride = await getRepository(Ride).findOne(
              {
                status: "REQUESTING",
                pickUpLat: Between(lastLat - 0.05, lastLng + 0.05),
                pickUpLng: Between(lastLat - 0.05, lastLng + 0.05)
              },
              { relations: ["passenger"] }
            );
            if (ride) {
              return {
                ok: true,
                error: null,
                ride
              };
            } else {
              return {
                ok: true,
                error: null,
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
        } else {
          return {
            ok: false,
            error: "운전자 등록을 해주세요",
            ride: null
          };
        }
      }
    )
  }
};

export default resolvers;
