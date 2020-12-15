import React, {useState, useEffect} from "react";
import ReactDOM from 'react-dom';
import {decode as htmlEntityDecode} from 'he';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import Fuse from 'fuse.js';

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

// Figure out valid audiences
const validAudiences = [...uniqueAudiences].map(audienceString => {
    const label = htmlEntityDecode(audienceString); // Some of the audience names are HTML encoded (ampersands, etc.)
    return {label: label, value: label} // The format expected by ReactMultiSelectCheckboxes
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
            // We'll whittle down the events one filter at a time.
            let filteredEvents = events;

            // First filter selected audiences
            if (selectedAudiences.length > 0) {
                filteredEvents = filteredEvents.filter(event =>
                    // Array.some returns true as soon as the condition matches one element of the array, then stops
                    selectedAudiences.some(audience => {
                        if (event.audience) {
                            return event.audience.includes(audience.value);
                        }
                        else return false;
                    })
                )
            }

            // Then do a fuzzy keyword match
            if (searchTerm) {
                const fuse = new Fuse(filteredEvents, {
                    keys: ['title', 'message']
                })

                filteredEvents = fuse.search(searchTerm).map(result => result.item);
            }

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
                options={validAudiences}
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
                    <li key={item.nid}>{item.title} ({item.audience}) - {item.message}</li>
                ))}
            </ul>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
