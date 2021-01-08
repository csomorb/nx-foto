import { Entity, Tree, PrimaryGeneratedColumn, Column, TreeChildren, TreeParent, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToOne, JoinColumn} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Photo } from "../photo/photo.entity";
import { Video } from "../video/video.entity";

@Entity()
@Tree("materialized-path")
export class Album {

  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({nullable:true})
  description: string

  @TreeChildren()
  children: Album[];

  @TreeParent()
  parent: Album;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany('Photo', 'albums')
  photos: Photo[];

  @ManyToMany('Video', 'albums')
  videos: Video[];

  @OneToOne('Photo')
  @JoinColumn()
  coverPhoto: Photo;

}
