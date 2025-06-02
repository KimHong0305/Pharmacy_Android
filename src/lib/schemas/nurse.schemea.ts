export interface ChatRoomNurse {
    roomId: string,
    senderId: string, 
    senderName: string,
    senderImage: string,
    lastMessage: string,
    lastTime: string
}

export interface ChatRoomNurseResponse {
    code: number,
    result: ChatRoomNurse[]
}

export interface ChooseRoomVacant {
    roomId: string
}

export interface ChooseRoomVacantResponse {
    code: number,
    message: string
}

export interface Message {
    messageId: string,
    senderId: string,
    senderName: string,
    senderImage: string,
    receiverId: string,
    receiverName: string,
    receiverImage: string,
    content: string, 
    time: string
}

export interface MessageAtRoom {
    code: number,
    result: Message[]
}

export interface CreateMessage {
    roomId: string,
    sender: string,
    receiver: string,
    content: string
}

export interface CreateMessageResponse {
    messageId: string,
    senderId: string,
    receiverId: string,
    content: string,
    time: string
}

export interface CreateMessageAtRoomRespone {
    code: number,
    message: string,
    result: CreateMessageResponse
}

export interface BioNurse {
    id: string,
    firstname: string,
    lastname: string,
    dob: string,
    sex: string,
    image: string,
    specilization: string,
    description: string,
    workExperience: string,
    education: string,
    phoneNumber: string,
    workTime: string,
    salary: string
}

export interface BioNurseResponse {
    code: number,
    result: BioNurse
}