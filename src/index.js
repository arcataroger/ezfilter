import ReactDOM from 'react-dom';
import './App.css';
import apiResponse from "./apiResponse.js";
import {BooleanFilter, FilterContextProvider, OnlineFilter, SoldOutFilter} from "./filters";
import FilteredOutput from "./FilteredOutput"; // Parse and transform mock API response into an array

function App() {

    return (
        <FilterContextProvider inputArray={apiResponse}>
            <BooleanFilter parameterName={'sold_out'} label={'Sold out'} />
            <BooleanFilter parameterName={'online_event'} label={'Online'} />
            <FilteredOutput/>
        </FilterContextProvider>
    )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);