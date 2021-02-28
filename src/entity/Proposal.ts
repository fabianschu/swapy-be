import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity("users")
export class Proposal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  offer_address: string;

  @Column()
  wanted_address: string;

  @ManyToOne(() => User, (user) => user.proposals)
  user: User;
}
