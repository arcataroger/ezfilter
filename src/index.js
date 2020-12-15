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
    const [searchResults, setSearchResults] = useState([]);

    // Searchbox
    const [searchTerm, setSearchTerm] = useState("");
    const textSearch = e => {
        setSearchTerm(e.target.value);
    };

    // Checkboxes
    const [selectedAudiences, setSelectedAudiences] = useState([]);

    useEffect(() => {
            const filteredEvents = events

                // First filter selected audiences
                .filter(event => selectedAudiences.length === 0 ||

                    // Array.some returns true as soon as the condition matches one element of the array, then stops
                    selectedAudiences.some(audience => {
                        if (event.audience) {
                            return event.audience.includes(audience.value);
                        }
                    })
                )

                // Then do a keyword match
                .filter(event => !searchTerm || event.title.toLowerCase().includes(searchTerm.toLowerCase()));

            setSearchResults(filteredEvents);

        }, [selectedAudiences, searchTerm]
    );

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

            <h1>Selected Audiences</h1>
            <ul>
                {selectedAudiences.map(item => (
                    <li key={item.value}>{item.label}</li>
                ))}
            </ul>

            <h1>Matching Events</h1>
            <ul>
                {searchResults.map(item => (
                    <li key={item.nid}>{item.title} ({item.audience})</li>
                ))}
            </ul>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
