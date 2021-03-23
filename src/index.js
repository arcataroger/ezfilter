import React, {useState, useEffect} from "react";
import ReactDOM from 'react-dom';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import Fuse from 'fuse.js'; // Fuzzy keyword search
import './App.css';

import apiResponse from "./apiResponse.js"; // Parse and transform mock API response into an array

// Which keys do we want to filter by?
const options = {
    multiSelectKeys: ['audience', 'topics'], // Dropdowns + checkboxes
    booleanKeys: ['sold_out', 'online_event'], // Single checkboxes
    enableSearch: true,
};


const events = apiResponse;

let parsed = [];
options.multiSelectKeys.forEach(key => {
    let uniqueAudiences = new Set(); // To ensure uniqueness
    events.forEach(event => {
        if (event[key]) {
            event[key].map(item => uniqueAudiences.add(item))
        }
    })

    parsed[key] = [...uniqueAudiences].map(audienceString => {
        const label = audienceString; // Some of the audience names are HTML encoded (ampersands, etc.)
        return {label: label, value: audienceString} // The format expected by ReactMultiSelectCheckboxes
    });
})


function App() {
    const [searchResults, setSearchResults] = useState([]);

    // Title & description keyword search
    const [searchTerm, setSearchTerm] = useState("");
    const textSearch = e => {
        setSearchTerm(e.target.value);
    };

    // Audiences
    const [selectedAudiences, setSelectedAudiences] = useState([]);

    // Online only
    const [onlineOnly, setOnlineOnly] = useState(false);
    const onlineOnlyHandler = () => setOnlineOnly(!onlineOnly);


    // The filtering algorithm
    useEffect(() => {
            // We'll whittle down the events one filter at a time.
            let filteredEvents = events;

            // Filter audiences
            if (selectedAudiences.length > 0) {
                filteredEvents = filteredEvents.filter(event =>
                    // Array.some returns true as soon as the condition matches one element of the array, then stops
                    selectedAudiences.some(audience => {
                        if (event.audience) {
                            return event.audience.includes(audience.value);
                        } else return false;
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

            // Online events only
            if (onlineOnly) filteredEvents = filteredEvents.filter(event => event.online_event);

            setSearchResults(filteredEvents);

        }, [selectedAudiences, searchTerm, onlineOnly]
    );

    return (
        <div className="App">
            {
                options.enableSearch &&
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={textSearch}
                />
            }


            <ReactMultiSelectCheckboxes
                defaultValue={selectedAudiences}
                options={parsed['audience']}
                onChange={setSelectedAudiences}
                placeholderButtonLabel="Audiences"
                isSearchable={false}
            />

            <label>Online
                <input
                    name="onlineOnly"
                    type="checkbox"
                    checked={onlineOnly}
                    onChange={onlineOnlyHandler}
                />
            </label>

            <h1>Showing {searchResults.length} event(s) out of {events.length} total</h1>
            <ul>
                {searchResults.map(item => (
                    <li key={item.nid}> {item.title}
                        <ul>
                            <li>Online? {item.online_event ? 'Yes' : 'No'}</li>
                            <li>Audiences: {item.audience && item.audience.join(', ')}</li>
                            <li>Topics: {item.topics && item.topics.join(', ')}</li>
                            <p dangerouslySetInnerHTML={{__html: item.message}} />
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
