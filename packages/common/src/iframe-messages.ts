import {createIframeMessenger, MessageDirectionEnum} from 'interlocking-iframe-messenger';

export enum ChildFrameMessageTypeEnum {
    RequestDataFromChild = 'request-data-from-child',
    SendDataToChild = 'send-data-to-child',
}

export type ChildFrameMessageData = {
    [ChildFrameMessageTypeEnum.RequestDataFromChild]: {
        [MessageDirectionEnum.FromParent]: undefined;
        [MessageDirectionEnum.FromChild]: string;
    };
    [ChildFrameMessageTypeEnum.SendDataToChild]: {
        [MessageDirectionEnum.FromParent]: string;
        [MessageDirectionEnum.FromChild]: undefined;
    };
};

export const myIframeMessenger = createIframeMessenger<ChildFrameMessageData>({timeoutMs: 300});
