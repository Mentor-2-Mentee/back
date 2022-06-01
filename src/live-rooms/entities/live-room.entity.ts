import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class LiveRoom {
  @PrimaryGeneratedColumn()
  id: number;

  //   @Column()
  //   roomId: string;
  @Column()
  title: string;
  //   @Column()
  //   author: string;
  //   @Column()
  //   authorColor: string;
  //   @Column()
  //   createdAt: string;
  //   @Column()
  //   startedAt: string;
  //   @Column()
  //   thumbnailImgURL: string;
  //   @Column({ array: true })
  //   roomTags: string;
}
