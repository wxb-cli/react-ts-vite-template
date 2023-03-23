declare namespace API {
  interface LoginParams {
    name: string;
    userPassword: string;
  }

  interface LoginData {
    token: string;
    userInfo: {
      username: string;
      level: number;
    };
  }
}