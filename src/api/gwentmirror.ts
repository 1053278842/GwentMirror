import axios from 'axios';
export function getAllDeck(){
  return axios.get("gmapi/deck/api/getDecks")
}

export function getDecksByIds(param:{ids:string,page:number}){
  // localapi localhost:8081
  // gmapi    117.50.175.251:8081
  // api      www.playgwent.com
  const url = `gmapi/deck/api/getDecksByIds?ids=${param.ids}&page=${param.page}`;
  return sendRequestWithRetry(url);
}

/**
 * 获取最近n个随机的卡组
 * @param num n
 * @returns 
 */
export function getRandomDeckLast(num:number){
  const url = `gmapi/deck/api/getRandomDecksLast?num=${num}`;
  return sendRequestWithRetry(url);
}


/**
 * 获取当前版本
 */
 export function getVersion(){
  return axios.get("gmapi/version/api/getId")
}


async function sendRequestWithRetry(url :string, maxRetries = 3) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const response = await axios.get(url);
      // 处理响应并返回结果
      return response.data;
    } catch (error) {
      console.log(`请求失败，正在尝试重新发送 (${retries+1}/${maxRetries})`);
      retries++;
    }
  }
  throw new Error(`请求失败，已达到最大重试次数 (${maxRetries})`);
}