export type Interactive = {
    type: 'list' | 'button' | 'product' | 'flow' | 'location_request_message',
    body?: {
        text: string
    },
    action: {
        name?: string,
        buttons?: Array<{
            type: 'reply',
            reply?: {
                id: string,
                title: string
            }
        }>
    },
    header?: {
        type: 'text' | 'image' | 'video' | 'document',
        text: string
    }
    footer?: {
        text: string
    }
}