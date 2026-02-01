import { useQueryStates } from 'nuqs';
import { CredentialsParams } from '../params';


export const UseCredentialsParams = () => {
    return useQueryStates(CredentialsParams)
}