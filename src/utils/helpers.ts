import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export class GenerateHelpers {
  static generateEmailVerificationToken(): {
    token: string;
    expire: Date;
  } {
    const token = crypto.randomBytes(32).toString('hex');
    const expire = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

    return { token, expire };
  }
}

export class AuthenUserHelpers {
  static async compareHashedPassword(
    inputPW: string,
    userPW: string,
  ): Promise<boolean> {
    return bcrypt.compare(inputPW, userPW);
  }
}
