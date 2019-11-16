import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import Ride from "../../../entities/Ride";
import {
  UpdateRideStatusMutationArgs,
  UpdateRideStatusResponse
} from "../../../types/graph";
import Chat from "../../../entities/Chat";

const resolvers: Resolvers = {
  Mutation: {
    UpdateRideStatus: privateResolver(
      async (
        _,
        args: UpdateRideStatusMutationArgs,
        { req, pubSub }
      ): Promise<UpdateRideStatusResponse> => {
        const user: User = req.user;
        if (user.isDriving) {
          try {
            let ride: Ride | undefined;
            if (args.status === "ACCEPTED") {
              ride = await Ride.findOne(
                { id: args.rideId, status: "REQUESTING" },
                { relations: ["passenger", "driver"] }
              );
              if (ride) {
                ride.driver = user;
                ride.passenger.isRiding = true;
                user.isTaken = true;
                await user.save();
                const chat = await Chat.create({
                  driver: user,
                  passenger: ride.passenger,
                  rideId: ride.id
                }).save();
                ride.chat = chat;
                await ride.save();
              }
            } else {
              ride = await Ride.findOne(
                {
                  id: args.rideId,
                  driver: user
                },
                { relations: ["passenger", "driver"] }
              );
              if (args.status === "FINISHED") {
                user.isTaken = false;
                await user.save();
                const passenger: User = ride!.passenger;
                passenger.isRiding = false;
                await passenger.save();
              }
            }
            if (ride) {
              ride.status = args.status;
              await ride.save();
              pubSub.publish("rideUpdate", { RideStatusSubscription: ride });
              return {
                ok: true,
                error: null,
                rideId: ride.id
              };
            } else {
              return {
                ok: false,
                error: "업데이트를 할 수 없습니다.",
                rideId: null
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              rideId: null
            };
          }
        } else {
          return {
            ok: false,
            error: "운전자 등록을 해주세요",
            rideId: null
          };
        }
      }
    )
  }
};

export default resolvers;
