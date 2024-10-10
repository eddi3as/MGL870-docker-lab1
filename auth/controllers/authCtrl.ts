import { collections } from '../services/dbservice'
import User from '../models/database/userdb';
import { Security } from '../utils/security';
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');

export class AuthCtrl {
    constructor() {}

    public async login(usrname: string, pswd: string){
        let usr = (await collections.auth?.findOne<User>({username: usrname}) as User);
        if(usr && await bcrypt.compareSync(pswd, usr.password)){
            return this.generateToken(usr);
        }
        //usr doesnt exist
        return JSON.stringify({session: null});
    }

    private generateToken(usr: User){
        let secret = process.env.ACCESS_TOKEN + usr.username;
        const session = Security.encodeSession(secret, {
            id: usr._id!.toString(),
            uname: usr.username,
            dateCreation: Date.now(),
            emission: Date.now()
        });
        return JSON.stringify({session: session});
    }

    public verifyToken(usrname: string, token: string){
        let result = false;
        let secret = process.env.ACCESS_TOKEN + usrname;
        const session = Security.decodeSession(secret, token);
        if(session.type === 'valid'){
            let data = Security.validerExpiration(session.session);
            return { ok: (data === 'actif' || data === 'grace') };
        }
        return { ok: result};
    }

    public async logout(session: any){
        return null;
    }

    public async register(usrname: string, pswd: string){
        //encrypter pswd
        let encrypted = await bcrypt.hashSync(pswd, bcrypt.genSaltSync(8), null);
        //save usr with encrypted pswd
        collections.auth?.insertOne({username: usrname, password: encrypted});
    }
}