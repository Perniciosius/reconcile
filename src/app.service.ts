import { Injectable } from '@nestjs/common';
import { ReconcileDto } from './dto/reconcile.dto';
import { Contact } from './entities/contact.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async reconcile(data: ReconcileDto): Promise<Contact> {
    let finalContact: Contact;

    try {
      const contact = await this.contactRepository.findOneBy([
        { email: data.email },
        { phoneNumber: data.phoneNumber },
      ]);

      if (!contact) {
        // If contact not present, create a primary contact
        await this.contactRepository.insert({
          phoneNumber: data.phoneNumber,
          email: data.email,
          linkPrecedence: 'primary',
        });
      } else if (contact.linkPrecedence == 'primary') {
        if (
          (data.email && data.email != contact.email) ||
          (data.phoneNumber && data.phoneNumber != contact.phoneNumber)
        ) {
          // Create new secondary contact
          await this.contactRepository
            .insert({
              email: data.email,
              phoneNumber: data.phoneNumber,
              linkPrecedence: 'secondary',
              primaryContactId: contact.id,
            })
            .catch((e) => {
              if (
                !(e instanceof QueryFailedError) ||
                e.driverError.code != '23505'
              ) {
                throw e;
              }
            });
        }
      } else {
        if (
          (data.email && data.email != contact.email) ||
          (data.phoneNumber && data.phoneNumber != contact.phoneNumber)
        ) {
          // Create new secondary contact
          await this.contactRepository
            .insert({
              email: data.email,
              phoneNumber: data.phoneNumber,
              linkPrecedence: 'secondary',
              primaryContactId: contact.primaryContactId,
            })
            .catch((e) => {
              if (
                !(e instanceof QueryFailedError) ||
                e.driverError.code != '23505'
              ) {
                throw e;
              }
            });
        }
      }

      const where = this.contactRepository.create();
      if (contact) {
        where.id =
          contact.linkPrecedence == 'primary'
            ? contact.id
            : contact.primaryContactId;
      } else {
        where.email = data.email;
        where.phoneNumber = data.phoneNumber;
      }

      finalContact = await this.contactRepository.findOne({
        where: where,
        relations: {
          secondaryContacts: true,
        },
      });
    } catch (e) {
      console.log({ e });
      throw new Error('transaction failed');
    }
    return finalContact;
  }
}
