import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity("proposals")
export class Proposal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  offerAddress: string;

  @Column()
  wantedAddress: string;

  @ManyToOne(() => User, (user) => user.proposals)
  user: User;
}
