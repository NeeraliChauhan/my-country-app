import React from "react";
import './countryCard.css';

export default class CountryCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: ""
    }
  }

  onKeywordChange = (e) => {
    const {country} = this.props;
    this.setState({
      amount: (e.target.value * country.exchange_currency.SEK).toFixed(2)
    });
  }

  render() {
    const { country } = this.props;
    const currency = country.currencies[0];
    return (
      <div className="card">
        <div className={"card-wrapper"}>
          <div>
            <p className={"country-name"}>{country.name}</p>
          </div>
          <div className={" country-population"}>
            <i class="fas fa-users"></i>
            <label className={"population-label"}>Population:</label>
            <p>{country.population}</p>
          </div>
          <div className={"country-currency"}>
            <div className={"country-currency"}>
              <label>Currency:</label>
              <p>{currency.name}</p>
              <span className={"country-tag"}>{currency.code}</span>
            </div>
          </div>
        </div>
        <div className={"card-wrapper"}>
          <div className={"country-currency"}>
            <label>Exchange to SEK:</label>
            {country.exchange_currency ? (
              <div>
                <input
                  onChange={(e) => this.onKeywordChange(e)}
                  type="number"
                  placeholder="Enter amount"
                  className="amount-input"
                />
                <input
                  className="amount-input"
                  disabled
                  value={this.state.amount}
                  placeholder="Amount in SEK"
                />
              </div>
            ) : <div className={"red-tag"}>Not available</div>
          }
          </div>
        </div>
      </div>
    );
  }
}
