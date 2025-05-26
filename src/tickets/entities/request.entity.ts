import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

export enum RequestStatus {
  NEW = "new",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELED = "canceled",
}

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @Column()
  message: string;

  @Column({
    type: "enum",
    enum: RequestStatus,
    default: RequestStatus.NEW,
  })
  status: RequestStatus;

  @Column({ nullable: true })
  resolution?: string;

  @Column({ nullable: true })
  cancelReason?: string;

  @CreateDateColumn()
  createdAt: Date;
}
