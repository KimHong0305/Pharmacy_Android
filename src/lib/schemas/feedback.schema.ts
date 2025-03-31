export interface FeedBack {
    id: string,
    userId: string,
    username: string,
    avatar: string,
    productId: string,
    productName: string,
    feedback: string,
    parent: FeedBack,
    createDate: string
}

export interface FeedBackResponse {
    code: number,
    result: FeedBack[]
}



