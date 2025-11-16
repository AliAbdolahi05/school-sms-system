export class SmsService {
  private provider: string;

  constructor() {
    this.provider = process.env.SMS_PROVIDER || 'kavenegar';
  }

  async send(phone: string, message: string): Promise<boolean> {
    try {
      if (this.provider === 'kavenegar') {
        const Kavenegar = require('kavenegar');
        const api = Kavenegar.KavenegarApi({ apikey: process.env.SMS_API_KEY });
        return new Promise((resolve, reject) => {
          api.Send({
            message,
            sender: process.env.SMS_LINE_NUMBER,
            receptor: phone
          }, (response: any, status: number) => {
            if (status === 200) resolve(true);
            else reject(false);
          });
        });
      } else if (this.provider === 'ghasedak') {
        const Ghasedak = require('ghasedak');
        const ghasedak = new Ghasedak(process.env.SMS_API_KEY);
        await ghasedak.send({
          message,
          receptor: phone,
          linenumber: process.env.SMS_LINE_NUMBER
        });
        return true;
      } else if (this.provider === 'smsir') {
        const { Smsir } = require('sms-ir-api');
        const sms = new Smsir(process.env.SMS_API_KEY, process.env.SMS_LINE_NUMBER);
        await sms.Send(message, phone);
        return true;
      } else {
        throw new Error('ارائه دهنده SMS نامعتبر');
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}

export const smsService = new SmsService();