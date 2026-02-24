import { Md5 } from 'ts-md5';

/**
 * 加密密码
 * @param password 原始密码
 * @returns MD5 加密后的密码
 */
export function encryptPassword(password: string): string {
  if (!password) {
    return '';
  }
  return Md5.hashStr(password);
}
