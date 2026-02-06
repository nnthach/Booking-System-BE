export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface SendEmailVerificationJob {
  email: string;
  token: string;
}

export interface SendEmailWelcomeStaffJob {
  fullName: string;
  email: string;
  password: string;
}
