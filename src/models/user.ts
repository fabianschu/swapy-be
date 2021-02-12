import { Table, Column, Model, HasMany } from "sequelize-typescript";

@Table
class User extends Model {
  @Column
  pubkey: string;

  @Column
  nonce: Date;
}
