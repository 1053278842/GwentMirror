import axios from 'axios';
export function getAllDeck(){
  return axios.get("gmapi/deck/api/getDecks")
}

export function getDecksByIds(param:{ids:string,page:number}){
  // localapi localhost:8081
  // gmapi    117.50.175.251:8081
  // api      www.playgwent.com
  return axios.get("gmapi/deck/api/getDecksByIds?ids="+param.ids+"&page="+param.page)
}