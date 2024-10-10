import { collections } from '../service/database.service'
import fs from 'fs'

export class Utils{
    public static atelier = "atelier";
    public static token = "GTI525_API_ACCESS_GRANTED";
    private static imported = "stats-imported";
    private static months = ["January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December"];

  public static setFilterDates(filter: any, debut: any, fin: any) {
    if(debut && fin){
      filter["Date"] = { $gte: new Date(this.toISODate(debut)), $lte: new Date(this.toISODate(fin)) };
    }
    else if(debut){
      filter["Date"] = { $gte: new Date(this.toISODate(debut)) };
    }
    else if(fin){
      filter["Date"] = { $lte: new Date(this.toISODate(fin)) };
    }
  }
  
  public static toISODate(csv_date: string){
    let date_utc = csv_date.indexOf("-") != -1 ? this.getFromCSV(csv_date) : this.getFromParams(csv_date);
    let final_date = date_utc[0] + " " + date_utc[1] + " " + date_utc[2] + " " + date_utc[3] + " UTC";
    const event = new Date(final_date);
    let date_iso = event.toISOString();
    return date_iso;
  }

  private static getFromCSV(csv_date: string) {
    let data = [];
    let date_arr = csv_date.split(" ");
    let date_utc = date_arr[0].split("-");
    let month = this. months[Number(date_utc[1]) - 1];
    data[0] = date_utc[0]; 
    data[1] = month; 
    data[2] = date_utc[2]; 
    data[3] = date_arr[1]; 
    return data;
  }

  private static getFromParams(csv_date: string) {
    let data = [];
    let year = csv_date.substring(0, 4);
    let tmp_month = csv_date.substring(4, 6);
    let day = csv_date.substring(6, 8);
    let month = this. months[Number(tmp_month) - 1];
    data[0] = year; 
    data[1] = month; 
    data[2] = day; 
    data[3] = "00:00:00"; 
    return data;
  }
}