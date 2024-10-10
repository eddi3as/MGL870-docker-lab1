import { collections } from '../services/dbservice'
import User from '../models/database/userdb';
var bcrypt = require('bcrypt');

export class Utils{
 
  public static async runscript(){
    let dbData = (await collections.auth?.find().toArray() as User[]);
    if(dbData.length === 0){
      this.createUsers();
    }
  }

  private static createUsers() {
    let new_usrs = Array();
    for (let i = 1; i <= 10; i++) {
        let nb = i.toString();
        let encrypted = bcrypt.hashSync("pswd_equipe" + nb, bcrypt.genSaltSync(8), null);
        let usr = { username: "equipe" + nb + "@etsmtl.ca", password: encrypted }; 
        new_usrs.push(usr);
    }
    collections.auth!.insertMany(new_usrs);
  }
}