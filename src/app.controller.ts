import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ReconcileDto } from './dto/reconcile.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealth(): string {
    return 'ok';
  }

  @Post('/identify')
  async reconcileContact(@Body() body: ReconcileDto): Promise<any> {
    if (!body.email && !body.phoneNumber) {
      throw new HttpException(
        'Either email or phone number is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const data = await this.appService.reconcile(body);
    let phoneNumbers = [data.phoneNumber];
    phoneNumbers = phoneNumbers.concat(
      data.secondaryContacts?.map((v) => v.phoneNumber),
    );
    let emails = [data.email];
    emails = emails.concat(data.secondaryContacts?.map((v) => v.email));
    return {
      contact: {
        primaryContactId: data.id,
        emails: [...new Set(emails.filter((v) => v))],
        phoneNumbers: [...new Set(phoneNumbers.filter((v) => v))],
        secondaryContactIds: data.secondaryContacts?.map((v) => v.id),
      },
    };
  }
}
