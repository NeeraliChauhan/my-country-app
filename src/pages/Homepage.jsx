import React from "react";
import Loader from "react-loader-spinner";
import { getCountries, getCurrency } from "../apiCalls/getCountries";
import CountryCard from "../components/countryCard";
import { debounce } from "lodash";
import './homepage.css'

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: [],
      keyword: "",
      selectedCountry: null,
      selectedCountriesList: [],
      isLoading: false,
      isOpen: false
    };
  }

  getData = async (keyword) => {
    await getCountries(keyword)
      .then((response) => {
        this.setState({
          countries: response,
          isLoading: false
        });
      })
      .catch((err) => {
        console.log("error in fetching countries", err);
      });
  };

  debounceGetData = debounce(this.getData, 400);

  getConvertedCurrency = async (code) => {
    try {
      let response = await getCurrency(code)
      if(response){
        return response
      }
    } catch(error){
      return error
    }
  };

  onKeywordChange = (event) => {
    const keyword = event.target.value;
    this.setState({ keyword, countries:[], isOpen: false });
    if (keyword.length > 2) {
      this.setState({ isLoading: true, isOpen: true });
      this.debounceGetData(keyword);
    }
  };

  onCountrySelect = (country) => {
    this.setState({
      keyword: country.name,
      countries: [],
      selectedCountry: country,
    });
  };

  onClickAdd = async () => {
    const { selectedCountriesList, selectedCountry } = this.state;
    let currency = await this.getConvertedCurrency(selectedCountry.currencies[0].code)
    selectedCountry['exchange_currency'] = currency
    selectedCountriesList.unshift(selectedCountry);
    this.setState({
      selectedCountriesList,
      selectedCountry: null,
      keyword: "",
    });
  };

  renderList() {
    const { selectedCountriesList } = this.state;
    return selectedCountriesList.map((country) => {
      return <CountryCard key={country.name} country={country} /> 
    });
  }

  renderSuggestions() {
    const { countries, isLoading, keyword, selectedCountry} = this.state;
    if(isLoading){
      return (
        <div className={"list-wrapper"}>
          <div className={"loader"}>
            <Loader
              type="TailSpin"
              color="#00BFFF"
              height={20}
              width={20}
              visible={this.state.isLoading}
            />
          </div>
        </div>
      );
    }
    if(keyword.length > 2 && !countries.length && !selectedCountry){
      return (
        <div className={"list-wrapper"}>
          <div className={"list-member"}>
            <p>No countries</p>
          </div>
        </div>
      );
    }
    if(countries.length){
      return (
        <div className={"list-wrapper"}>
          {countries.map((country, index = 0) => {
            return (
              <div
                onClick={() => this.onCountrySelect(country)}
                className={"list-member"}
                key={index}
              >
                <p>{country.name}</p>
              </div>
            );
          })}
        </div>
      );
    }
    return null
  }

  render() {
    const { isOpen } = this.state;
    return (
      <div className={"wrapper"}>
        <h1>Country App</h1>
        <p>Use this app to convert an amount in SEK to local currency of any country</p>
        <p className={'sub-title'}>Conversions available for European countries only</p>
        <div className={"main-container"}>
          <div className="comment">
            <i class="fas fa-exclamation"></i>
            <p className="comment-text">Please enter at-least 3 characters!</p>
          </div>
          <input
            className={"search-bar"}
            onChange={this.onKeywordChange}
            placeholder="Country"
            value={this.state.keyword}
          />
          {isOpen ? this.renderSuggestions() : null}
          <button
            disabled={this.state.selectedCountry ? false : true}
            onClick={() => this.onClickAdd()}
            className={"add-button"}
          >
            Add country
          </button>
        </div>
        <div className={"card-component"}>
          {this.state.selectedCountriesList ? this.renderList() : null}
        </div>
      </div>
    );
  }
}