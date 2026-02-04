import cryptr from 'cryptr';

const encrypter = new cryptr(process.env.CRYPTR_SECRET!)

export const encrypt = (value:string) => encrypter.encrypt(value);

export const dcrypt = (value:string) => encrypter.decrypt(value);