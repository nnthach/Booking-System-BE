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

export class FormatConvertExcelRow {
  getField(obj: Record<string, unknown>, candidates: string[]) {
    // convert to lowercase (đồng nhất tên)
    const lowerMap = Object.keys(obj).reduce(
      (acc, key) => {
        acc[key.toLowerCase().trim()] = obj[key];
        return acc;
      },
      {} as Record<string, unknown>,
    );

    for (const candidate of candidates) {
      const lower = candidate.toLowerCase().trim();
      if (Object.prototype.hasOwnProperty.call(lowerMap, lower)) {
        const value = lowerMap[lower];
        if (typeof value === 'string') {
          const v = value.trim();
          if (v !== '') return v;
        }
        if (typeof value === 'number') {
          return String(value);
        }
      }
    }
    return '';
  }
}
