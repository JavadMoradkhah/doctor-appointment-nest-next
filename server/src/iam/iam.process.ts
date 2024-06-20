import axios from 'axios';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { JOB_OTP_SMS, QUEUE_OTP_SMS } from 'src/iam/iam.constants';
import { OtpSms } from './interfaces/jobs/otp-sms.job';

@Processor(QUEUE_OTP_SMS)
export class SmsQueueConsumer {
  private readonly logger = new Logger(SmsQueueConsumer.name);

  @Process(JOB_OTP_SMS)
  async sendOtpSms(job: Job<OtpSms>) {
    if (process.env.NODE_ENV !== 'production') {
      return this.logger.log('Code: ' + job.data.otp);
    }

    const response = await axios({
      method: 'POST',
      url: 'https://api.sms.ir/v1/send/verify/',
      headers: {
        ACCEPT: 'application/json',
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.API_KEY_SMS,
      },
      data: {
        Mobile: job.data.phone,
        TemplateId: 784780,
        Parameters: [
          {
            name: 'VERIFICATION_CODE',
            value: job.data.otp,
          },
        ],
      },
    });

    if (response.data.status !== 1) {
      throw new Error(response.data.message);
    }
  }

  @OnQueueError()
  errorHandler(error: Error) {
    this.logger.error('An error occurred', error.message);
  }

  @OnQueueFailed()
  failHandler(job: Job, error: Error) {
    this.logger.error('An error occurred', error.message);
  }
}
