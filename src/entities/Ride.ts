import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn
} from "typeorm";
import { rideStatus } from "src/types/types";
import User from "./User";
import Chat from "./Chat";

@Entity()
class Ride extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({
    type: "enum",
    enum: ["ACCEPTED", "FINISHED", "CANCELED", "REQUESTING", "ONROUTE"],
    default: "REQUESTING"
  })
  status: rideStatus;

  @Column({ type: "text" })
  pickUpAddress: string;

  @Column({ type: "float", default: 0 })
  pickupLat: number;

  @Column({ type: "float", default: 0 })
  pickUpLng: number;

  @Column({ type: "text" })
  dropOffAddress: string;

  @Column({ type: "float", default: 0 })
  dropOffLat: number;

  @Column({ type: "float", default: 0 })
  dropOffLng: number;

  @Column({ type: "float", default: 0 })
  price: number;

  @Column({ type: "text" })
  duration: string;

  @Column({ type: "text" })
  distance: string;

  @Column({ nullable: true })
  passengerId: number;
  
  @ManyToOne(type => User, user => user.ridesAsPassenger)
  passenger: User;

  @Column({ nullable: true })
  driverId: number;
  
  @ManyToOne(type => User, user => user.ridesAsDriver, { nullable: true })
  driver: User;
  
  @Column({ nullable: true })
  chatId: number;
  
  @OneToOne(type => Chat, chat => chat.ride, {nullable: true})
  @JoinColumn()
  chat: Chat
  
  @CreateDateColumn()
  createAt: string;

  @UpdateDateColumn()
  updateAt: string;
}

export default Ride;
