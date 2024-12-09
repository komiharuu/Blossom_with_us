import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, of } from 'rxjs';
import { IncomingWebhook } from '@slack/client';
import * as Sentry from '@sentry/minimal';

@Injectable()
export class WebhookInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((error) => {
        Sentry.captureException(error);
        const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK);
        webhook.send({
          attachments: [
            {
              color: 'danger',
              text: '살려주세요',
              fields: [
                {
                  title: ` ${error.message}`,
                  value: error.stack,
                  short: false,
                },
              ],
              ts: Math.floor(new Date().getTime() / 1000).toString(),
            },
          ],
        });
        return of(error);
      }),
    );
  }
}
