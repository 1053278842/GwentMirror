import axios from 'axios';

export function getAllData() {
  const instance = axios.create({
    baseURL: '/api-pg',
  });
  return instance.get('/en/decks/api/builder/search')
  
  return 
  // return axios.get('/api-pg/en/decks/api/builder/search',{ withCredentials: true })

}
