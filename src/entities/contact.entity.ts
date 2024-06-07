import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['email', 'phoneNumber'], { unique: true })
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  email?: string;

  @ManyToOne(() => Contact, (contact) => contact.secondaryContacts)
  primaryContact?: Contact;

  @Column({ nullable: true })
  primaryContactId?: number;

  @OneToMany(() => Contact, (contact) => contact.primaryContact)
  secondaryContacts: Contact[];

  @Column()
  linkPrecedence: LinkPrecedence;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}

type LinkPrecedence = 'primary' | 'secondary';
