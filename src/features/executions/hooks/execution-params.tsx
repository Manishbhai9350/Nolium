import { useQueryStates } from 'nuqs';
import { ExecutionsParams } from '../params';


export const useExecutionParams = () => {
    return useQueryStates(ExecutionsParams)
}