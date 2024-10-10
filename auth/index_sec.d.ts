export interface UserSec {
    id: number;
    dateCreation: number;
    uname: string;
    mdp: string;
  }
  
  export interface Session {
    id: string;
    dateCreation: number;
    uname: string;
    emission: number;
    expire: number;
  }
  
  export type PartialSession = Omit<Session, "emit" | "expire">;
  
  export interface EncodeResult {
    token: string,
    expire: number,
    emission: number
  }
  
  export type DecodeResult =
    | {
          type: "valid";
          session: Session;
      }
    | {
          type: "integrity-error";
      }
    | {
          type: "invalid-token";
      };
  
  export type ExpirationStatus = "expire" | "actif" | "grace";