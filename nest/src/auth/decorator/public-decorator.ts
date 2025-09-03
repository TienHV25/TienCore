import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY,RESPONSE_MESSAGE } from './constants';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const ResponseMessage = (message: string) =>
    SetMetadata(RESPONSE_MESSAGE, message);
