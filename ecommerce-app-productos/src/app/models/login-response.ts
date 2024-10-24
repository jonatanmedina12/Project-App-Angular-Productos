export interface LoginResponse {
    success:boolean,
    message?: string;
    errorCode:string;
    data:{id:number,token:string,username:string,roles:any[],tokenExpiration:string;
        isLoginActivo: boolean

    }
}
