import {useState, useEffect, useMemo} from "react";
import ReactDOM from 'react-dom';
import './App.css';
import apiResponse from "./apiResponse.js";
import {FilterContextProvider, OnlineFilter} from "./filters";
import DisplayComponent from "./DisplayComponent"; // Parse and transform mock API response into an array

function App() {

    return (
        <FilterContextProvider inputArray={apiResponse}>
            <OnlineFilter/>
            <DisplayComponent/>
        </FilterContextProvider>
    )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);