import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private templateCache = new Map<string, HandlebarsTemplateDelegate>();

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_APP_PASSWORD'),
      },
    });
  }

  private async renderTemplate(
    templateName: string,
    context: Record<string, any>,
  ): Promise<string> {
    let compiled = this.templateCache.get(templateName);
    if (!compiled) {
      const filePath = path.join(process.cwd(), 'src', 'mail', 'templates', `${templateName}.hbs`);
      const source = await fs.readFile(filePath, 'utf8');
      compiled = handlebars.compile(source, { noEscape: true });
      this.templateCache.set(templateName, compiled);
    }
    return compiled!(context);
  }

  async sendActivationEmail(to: string, email: string, activationCode: string) {
    const html = await this.renderTemplate('activation', { email, activationCode });
    const from = this.configService.get<string>('MAIL_FROM');

    await this.transporter.sendMail({
      from,
      to,
      subject: 'Kích hoạt tài khoản - Tiencore',
      html,
    });
  }
}