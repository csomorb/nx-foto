/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Album } from "../album/album.entity";
import { Tag } from "../tag/tag.entity";
import { People } from "../people/people.entity";

@Entity()
export class Video {

  @PrimaryGeneratedColumn()
  idVideo: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({nullable:true})
  description: string;

  @Column("int")
  weight: number;

  @Column("int", { nullable: true })
  height: number;

  @Column("int", { nullable: true })
  width: number;

  @Column("int", { nullable: true })
  duration: number;

  @ApiProperty()
  @Column("datetime", { nullable: true })
  shootDate: Date;

  @ApiProperty()
  @Column({ type: "decimal", precision: 10, scale: 8, nullable: true })
  lat: number;

  @ApiProperty()
  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true })
  long: number;

  @Column()
  originalFileName: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany('Album', 'videos', {
    eager: true
  })
  @JoinTable()
  albums: Album[];

  @ManyToMany('Tag', 'videos', {
    eager: true
  })
  @JoinTable()
  tags: Tag[];

  @ManyToMany('People', 'videos', {
    eager: true
  })
  @JoinTable()
  peoples: People[];

}
