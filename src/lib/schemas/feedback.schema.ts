export interface FeedBack {
    id: string,
    userId: string,
    username: string,
    avatar: string,
    productId: string,
    productName: string,
    feedback: string,
    parent?: FeedBack,
    createDate: string
}

export interface FeedBackResponse {
    code: number,
    result: FeedBack[]
}

export interface CreateFeedback {
    productId?: string,
    priceId?: string,
    feedback?: string,
    parent?: string
}

export interface UpdateFeedback {
    id: string,
    feedback: string
}

export interface DeleteFeedback {
  id: string
}



