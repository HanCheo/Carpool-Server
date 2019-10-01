import bcrypt from "bcrypt";
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany
} from "typeorm";
import { IsEmail } from "class-validator";
import Chat from "./Chat";
import Message from "./Messages";
import Ride from "./Ride";
import Place from "./Place";

const BCRTPT_ROUNDS = 10;

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: "text", nullable: true })
  @IsEmail()
  email: string | null;

  @Column({ type: "boolean", default: false })
  verifiedEmail: boolean;

  @Column({ type: "text" })
  firstName: string;

  @Column({ type: "text" })
  lastName: string;

  @Column({ type: "int", nullable: true })
  age: number;

  @Column({ type: "text", nullable: true })
  password: string;

  @Column({ type: "text", nullable: true })
  phoneNumber: string;

  @Column({ type: "boolean", default: false })
  verifiedPhoneNumber: boolean;

  @Column({ type: "text", nullable: true })
  fbId: string;

  @Column({ type: "text" })
  profilePhoto: string;

  @Column({ type: "boolean", default: false })
  isDriving: boolean;

  @Column({ type: "boolean", default: false })
  isRiding: boolean;

  @Column({ type: "boolean", default: false })
  isTaken: boolean;

  @Column({ type: "float", default: 0 })
  lastLng: number;

  @Column({ type: "float", default: 0 })
  lastLat: number;

  @Column({ type: "float", default: 0 })
  lastOrientation: number;

  @CreateDateColumn() createAt: string;

  @UpdateDateColumn() updateAt: string;

  @OneToMany(type => Chat, chat => chat.passenger)
  chatsAsPassenger: Chat[];

  @OneToMany(type => Chat, chat => chat.driver)
  chatsAsDriver: Chat[];

  @OneToMany(type => Message, message => message.chat)
  messages: Message[];

  @OneToMany(type => Ride, ride => ride.passenger)
  ridesAsPassenger: Ride[];

  @OneToMany(type => Ride, ride => ride.driver)
  ridesAsDriver: Ride[];

  @OneToMany(type => Place, places => places.user)
  places: Place[];

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async savePassword(): Promise<void> {
    if (this.password) {
      const hashPassword = await this.hashPassword(this.password);
      this.password = hashPassword;
    }
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRTPT_ROUNDS);
  }
}

export default User;


