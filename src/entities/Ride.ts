import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn
} from "typeorm";
import User from "./User";
import Chat from "./Chat";

@Entity()
class Ride extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({
    type: "enum",
    enum: ["ACCEPTED", "FINISHED", "CANCLED", "REQUESTING", "ONROUTE"],
    default: "REQUESTING"
  })
  status: string;

  @Column({ type: "text" })
  pickUpAddress: string;

  @Column({ type: "double precision", default: 0 })
  pickUpLat: number;

  @Column({ type: "double precision", default: 0 })
  pickUpLng: number;

  @Column({ type: "text" })
  dropOffAddress: string;

  @Column({ type: "double precision", default: 0 })
  dropOffLat: number;

  @Column({ type: "double precision", default: 0 })
  dropOffLng: number;

  @Column({ type: "double precision", default: 0 })
  price: number;

  @Column({ type: "text" })
  distance: string;

  @Column({ type: "text" })
  duration: string;

  @Column({ type: "text" })
  departDuration: string;

  @Column({ nullable: true })
  chatId: number;
  
  @OneToOne(type => Chat, chat => chat.ride, { nullable: true })
  @JoinColumn()
  chat: Chat;

  @Column({ nullable: true })
  passengerId: number;
  @ManyToOne(type => User, user => user.ridesAsPassenger)
  passenger: User;

  @Column({ nullable: true })
  driverId: number;
  @ManyToOne(type => User, user => user.ridesAsDriver, { nullable: true })
  driver: User;

  @CreateDateColumn()
  createAt: string;
  @UpdateDateColumn()
  updateAt: string;
}

export default Ride;
