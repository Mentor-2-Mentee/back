import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  username: string;

  @Column({ type: "timestamp" })
  createdAt: string;

  @Column({ type: "timestamp" })
  updatedAt: string;
}
