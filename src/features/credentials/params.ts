import { parseAsString, parseAsInteger } from 'nuqs/server';
import { PAGINATION } from './server/constants';

export const CredentialsParams = {
    search: parseAsString
    .withDefault('')
    .withOptions({ clearOnDefault:true }),
    page: parseAsInteger
    .withDefault(PAGINATION.page)
    .withOptions({ clearOnDefault:true }),
    pageSize: parseAsInteger
    .withDefault(PAGINATION.pageSize)
    .withOptions({ clearOnDefault:true }),
}