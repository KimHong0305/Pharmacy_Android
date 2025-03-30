export interface Coupon {
    id: string;
    name: string;
    image: string;
    percent: number;
    max: number;
    orderRequire: number;
    levelUser: 'DONG' | 'BAC' | 'VANG' | 'BACHKIM' | 'KIMCUONG';
    description: string;
    createDate: string;
    expireDate: string;
}

export interface CouponUserResponse {
    code: number;
    result: Coupon[];
}