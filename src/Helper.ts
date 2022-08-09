import axios from "axios";

export interface ICountry {
  name: string;
  capital: string;
  id: number;
  region: string;
  flag: string;
}

export const FILTERBY = {
  NAME: "Name",
  CAPITAL: "Capital",
  REGION: "Region",
};

const BASE_URL = `https://restcountries.com/v2/all`;
const TIMEOUT_SECONDS = 30;

const timeout = () => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(
          `Request took too long! Timeout after ${TIMEOUT_SECONDS} seconds`
        )
      );
    }, TIMEOUT_SECONDS * 1000);
  });
};

export const getCountries = async () => {
  try {
    const fetchPromise = axios(BASE_URL);

    const response: any = await Promise.race([fetchPromise, timeout()]);

    const { data } = response;

    if (response.statusText !== "OK")
      throw new Error(`${data.message} ${response.status}`);

    const countryData = data.map((country: any, index: number) => {
      return {
        name: country.name,
        capital: country.capital,
        id: index,
        region: country.region,
        flag: country.flags.png,
      };
    });

    return countryData;
  } catch (err) {
    throw err;
  }
};

//This is used to filtercountries based on the filter type and keyword using regular expression
export const filterCountries = (
  countries: ICountry[],
  filterBy: string,
  searchWord: string
) => {
  const filteredCountries = countries.filter((country: ICountry) => {
    switch (filterBy) {
      case FILTERBY.CAPITAL:
        return new RegExp(`^${searchWord.toLowerCase()}.*`, "g").test(
          country.capital?.toLowerCase()
        );
      case FILTERBY.NAME:
        return new RegExp(`^${searchWord.toLowerCase()}.*`, "g").test(
          country.name?.toLowerCase()
        );
      case FILTERBY.REGION:
        return new RegExp(`^${searchWord.toLowerCase()}.*`, "g").test(
          country.region?.toLowerCase()
        );
    }
  });
  return filteredCountries;
};
