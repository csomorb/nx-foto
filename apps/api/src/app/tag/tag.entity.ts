/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToOne, JoinColumn} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Photo } from "../photo/photo.entity";
import { Video } from "../video/video.entity";

@Entity()
export class Tag {

  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({unique: true})
  title: string;

  @ApiProperty()
  @Column({nullable:true})
  description: string

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany('Photo', 'tags')
  photos: Photo[];

  @ManyToMany('Video','tags')
  videos: Video[];

  @OneToOne('Photo')
  @JoinColumn()
  coverPhoto: Photo;

}
