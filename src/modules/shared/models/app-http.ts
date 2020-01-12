import { AxiosError } from 'axios';

export interface AppHttpError<T = any> extends AxiosError<T> {
  operation: string;
}

export interface AppHttpParams {
  [key: string]: string | string[];
}
