import ReactDOM from 'react-dom';
import './App.css';
import apiResponse from "./apiResponse.js";
import {FilterContextProvider, BooleanFilter, MultiSelectFilter} from "./filters";
import FilteredOutput from "./FilteredOutput"; // Parse and transform mock API response into an array

function App() {

    console.log('apiResponse', apiResponse);

    return (
        <FilterContextProvider inputArray={apiResponse}>
            <BooleanFilter parameterName={'sold_out'} label={'Sold out'} />
            <BooleanFilter parameterName={'online_event'} label={'Online'} />
            <MultiSelectFilter parameterName={'audience'} label={'Audience'} />
            <MultiSelectFilter parameterName={'topics'} label={'Topics'} />
            <FilteredOutput />
        </FilterContextProvider>
    )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);