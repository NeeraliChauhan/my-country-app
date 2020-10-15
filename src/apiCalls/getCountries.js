import { WEBURL } from "../constants/common";

export const getCountries = async (keyword) => {
return fetch(WEBURL + "countries?keyword="+keyword)
  .then((res) => res.json())
  .then(
    (response) => {
      return response.result;
    }
  ).catch((error)=> {
    return 
  })
}

export const getCurrency = async (code) => {
  return fetch(WEBURL + "country/currencies?code=" + code)
    .then((res) => res.json())
    .then((response) => {
      return response.result;
    })
    .catch((error) => {
      return;
    });
};
