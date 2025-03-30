export interface Feedback {
    id: string;
    userId: string;
    username: string;
    avatar: string;
    productId: string;
    productName: string;
    feedback: string;
    parent?: Feedback;
    createDate: string;
}

export interface FeedbackResponse {
    code: number;
    result: Feedback[];
}