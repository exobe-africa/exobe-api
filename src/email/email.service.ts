import { Injectable, Logger } from '@nestjs/common';
import { ServerClient } from 'postmark';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private client: ServerClient;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    const token = process.env.POSTMARK_SERVER_TOKEN;
    this.client = new ServerClient(token || '');
  }

  async sendEmail(params: { to: string; from?: string; subject: string; htmlBody?: string; textBody?: string; replyTo?: string }) {
    const from = params.from || (process.env.POSTMARK_FROM_EMAIL as string);
    try {
      return await this.client.sendEmail({
        From: from,
        To: params.to,
        Subject: params.subject,
        HtmlBody: params.htmlBody,
        TextBody: params.textBody,
        ReplyTo: params.replyTo,
        MessageStream: process.env.POSTMARK_STREAM || 'outbound',
      });
    } catch (e) {
      this.logger.error('Failed to send email', e as any);
      throw e;
    }
  }

  async sendTemplatedEmail(params: {
    to: string;
    from?: string;
    subject: string;
    template: string;
    variables: Record<string, any>;
    replyTo?: string;
  }) {
    const templatePath = path.join(__dirname, 'templates', `${params.template}.html`);
    let htmlBody = fs.readFileSync(templatePath, 'utf-8');

    for (const [key, value] of Object.entries(params.variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      htmlBody = htmlBody.replace(regex, value || '');
    }

    htmlBody = htmlBody.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (match, varName, content) => {
      return params.variables[varName] ? content : '';
    });

    return this.sendEmail({
      to: params.to,
      from: params.from,
      subject: params.subject,
      htmlBody,
      replyTo: params.replyTo,
    });
  }
}


