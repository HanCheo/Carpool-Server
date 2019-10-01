import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";

import { getRepository, Between } from "typeorm";

import { GetNearbyRideResponse } from "../../../types/graph";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
  Query: {
    GetNearbyRide: privateResolver(
      async (_, __, { req }): Promise<GetNearbyRideResponse> => {
        const user: User = req.user;
        const { lastLat, lastLng } = user;
        if (user.isDriving) {
          try {
            const ride = await getRepository(Ride).findOne({
              status: "REQUESTING",
              pickupLat: Between(lastLat - 0.05, lastLat + 0.05),
              pickUpLng: Between(lastLng - 0.05, lastLng + 0.05)
            });
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
            error: "운전자가 아닙니다 운전자 등록을 해주세요.",
            ride: null
          };
        }
      }
    )
  }
};

export default resolvers;
