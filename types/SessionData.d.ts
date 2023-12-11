declare module 'express-session' {
    interface SessionData {
        user: UserEntity;
    }
  }
  
  export {};