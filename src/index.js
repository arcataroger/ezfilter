import React, {useState, useEffect} from "react";
import ReactDOM from 'react-dom';
import {decode as htmlEntityDecode} from 'he';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';


// Parse and transform API response into an associative array
import apiResponse from "./apiResponse";

const events = apiResponse.nodes.map(v => v.node);

// Calculate available audiences based on API response
let uniqueAudiences = new Set(); // To ensure uniqueness
events.forEach(event => {
    if (event.audience) {
        event.audience.split('|').map(audience => uniqueAudiences.add(audience))
    }
})
const audienceArray = [...uniqueAudiences].map(audienceString => {
    const label = htmlEntityDecode(audienceString);
    return {label: label, value: label}
});

function App() {

    // Searchbox
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const textSearch = e => {
        setSearchTerm(e.target.value);
    };
    useEffect(() => {
        const results = events.filter(event =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    }, [searchTerm]);


    // Checkboxes
    const [selectedAudiences, setSelectedAudiences] = useState([]);
    useEffect(() => {
        setSelectedAudiences(selectedAudiences);
    }, [selectedAudiences]);

    return (
        <div className="App">
            <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={textSearch}
            />


            <ReactMultiSelectCheckboxes
                defaultValue={selectedAudiences}
                options={audienceArray}
                onChange={setSelectedAudiences}
                placeholderButtonLabel="Audiences"
                isSearchable={false}
            />

            <h1>Audiences</h1>
            <ul>
                {selectedAudiences.map(item => (
                    <li key={item.value}>{item.label}</li>
                ))}
            </ul>

            <h1>Values</h1>
            <ul>
                {searchResults.map(item => (
                    <li key={item.nid}>{item.title}</li>
                ))}
            </ul>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
