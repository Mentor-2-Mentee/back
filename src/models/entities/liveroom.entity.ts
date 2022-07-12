import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class LiveRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  roomId: string;

  @Column({ nullable: false })
  roomTitle: string;

  @Column({ nullable: false })
  author: string;

  @Column({ nullable: false })
  imageFiles: string;

  @Column({ nullable: true })
  parentsTag: string;

  @Column({ nullable: true })
  roomTags: string;

  @Column({ type: "timestamp" })
  createdAt: string;

  @Column({ type: "timestamp" })
  startedAt: string;
}
