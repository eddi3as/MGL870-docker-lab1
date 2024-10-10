import { encode, decode, TAlgorithm } from "jwt-simple";
import type { Session, PartialSession, EncodeResult, DecodeResult, ExpirationStatus } from "../index_sec";

export class Security{
    /**
    * Classe inspirer du site:
    * https://nozzlegear.com/blog/implementing-a-jwt-auth-system-with-typescript-and-node
    */
    public static encodeSession(secretKey: string, partialSession: PartialSession): EncodeResult {
        // Always use HS512 to sign the token
        const algorithm: TAlgorithm = "HS512";
        // Determine when the token should expire
        const emit = Date.now();
        const tenMinsInMs = 10 * 60 * 1000;
        const expire = emit + tenMinsInMs;
        const session: Session = {
            ...partialSession,
            emission: emit,
            expire: expire
        };
    
        return {
            token: encode(session, secretKey, algorithm),
            emission: emit,
            expire: expire
        };
    }

    public static decodeSession(secretKey: string, sessionToken: string): DecodeResult {
        // Always use HS512 to decode the token
        const algo: TAlgorithm = "HS512";
    
        let resultat: Session;
    
        try {
            resultat = decode(sessionToken, secretKey, false, algo);
        } catch (_e: any) {
            const e: Error = _e;
    
            // These error strings can be found here:
            // https://github.com/hokaccha/node-jwt-simple/blob/c58bfe5e5bb049015fcd55be5fc1b2d5c652dbcd/lib/jwt.js
            if (e.message === "No token supplied" || e.message === "Not enough or too many segments") {
                return {
                    type: "invalid-token"
                };
            }
    
            if (e.message === "Signature verification failed") {
                return {
                    type: "integrity-error"
                };
            }
        }
    
        return {
            type: "valid",
            session: resultat!
        }
    }
    
    public static validerExpiration(token: Session): ExpirationStatus {
        const now = Date.now();
        
        if (token.expire > now) return "actif";
    
        // Find the timestamp for the end of the token's grace period
        const tenMinsInMs = 10 * 60 * 1000;
        const tenMinsAfterExpiration = token.expire + tenMinsInMs;
    
        if (tenMinsAfterExpiration > now) return "grace";
    
        return "expire";
    }
}