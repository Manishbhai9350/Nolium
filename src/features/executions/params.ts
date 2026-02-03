import { parseAsInteger } from 'nuqs/server';
import { PAGINATION } from './server/constants';

export const ExecutionsParams = {
    page: parseAsInteger
    .withDefault(PAGINATION.page)
    .withOptions({ clearOnDefault:true }),
    pageSize: parseAsInteger
    .withDefault(PAGINATION.pageSize)
    .withOptions({ clearOnDefault:true }),
}