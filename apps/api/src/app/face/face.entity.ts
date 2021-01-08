import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { Photo } from "../photo/photo.entity";
import { ManyToOne } from "typeorm/decorator/relations/ManyToOne";
import { People } from "../people/people.entity";

@Entity()
export class Face {
  @PrimaryGeneratedColumn()
    public facesId!: number;

    @Column()
    public idPhoto!: number;

    @Column()
    public idPeople!: number;

    @Column({type: "float", nullable:true})
    public avg: number;

    @Column({type: "float", nullable:true})
    public x: number;

    @Column({type: "float", nullable:true})
    public y: number;

    @Column({type: "float", nullable:true})
    public h: number;

    @Column({type: "float", nullable:true})
    public w: number;

    @Column({type: "smallint", nullable:true})
    public d: number;

    @Column({ type: "text", nullable: true })
    public descriptor: string;

    @Column({ type: "json", nullable: true })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public similarity: any;

    @ManyToOne('Photo', 'faces')
    public photo: Photo;

    @ManyToOne('People', 'faces')
    public people: People;
}
