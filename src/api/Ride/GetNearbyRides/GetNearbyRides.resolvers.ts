import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";

import { GetNearbyRidesResponse } from "../../../types/graph";
import { getRepository, Between } from "typeorm";
import Ride from "src/entities/Ride";

const resolvers: Resolvers = {
  Query: {
    GetNearbyRides: privateResolver(
      async (_, __, { req }): Promise<GetNearbyRidesResponse> => {
        const user: User = req.user;
        const { lastLat, lastLng } = user;
        if (user.isDriving) {
          try {
            const rides = await getRepository(Ride).find({
              status: "REQUESTNG",
              pickupLat: Between(lastLat - 0.05, lastLat + 0.05),
              pickUpLng: Between(lastLng - 0.05, lastLng + 0.05)
            });
            return {
              ok: true,
              error: null,
              rides
            };
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              rides: null
            };
          }
        } else {
          return {
            ok: false,
            error: "운전자가 아닙니다 운전자 등록을 해주세요.",
            rides: null
          };
        }
      }
    )
  }
};

export default resolvers;
