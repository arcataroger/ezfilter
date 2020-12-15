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
    return {label: label, value: audienceString} // The format expected by ReactMultiSelectCheckboxes
});


// Figure out valid topics
// Calculate available audiences based on API response
let uniqueTopics = new Set(); // To ensure uniqueness
events.forEach(event => {
    if (event.topics) {
        event.topics.split('|').map(topic => uniqueTopics.add(topic))
    }
})

const validTopics = [...uniqueTopics].map(topicString => {
    const label = htmlEntityDecode(topicString); // Some of the audience names are HTML encoded (ampersands, etc.)
    return {label: label, value: topicString} // The format expected by ReactMultiSelectCheckboxes
});


function App() {
    const [searchResults, setSearchResults] = useState([]);

    // Title & description keyword search
    const [searchTerm, setSearchTerm] = useState("");
    const textSearch = e => {
        setSearchTerm(e.target.value);
    };

    // Audiences
    const [selectedAudiences, setSelectedAudiences] = useState([]);

    // Topics
    const [selectedTopics, setSelectedTopics] = useState([]);

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

            // Filter topics
            if (selectedTopics.length > 0) {
                filteredEvents = filteredEvents.filter(event =>
                    // Array.some returns true as soon as the condition matches one element of the array, then stops
                    selectedTopics.some(topic => {
                        if (event.topics) {
                            return event.topics.includes(topic.value);
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
            if (onlineOnly) filteredEvents = filteredEvents.filter(event => event.online_event === "1");

            setSearchResults(filteredEvents);

        }, [selectedAudiences, selectedTopics, searchTerm, onlineOnly]
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

            <ReactMultiSelectCheckboxes
                defaultValue={selectedTopics}
                options={validTopics}
                onChange={setSelectedTopics}
                placeholderButtonLabel="Topics"
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

            <h1>Matching Events</h1>
            <ul>
                {searchResults.map(item => (
                    <li key={item.nid}> {item.title}
                        <ul>
                            <li>Online? {item.online_event === "1" ? 'Online' : 'No'}</li>
                            <li>Audiences: {item.audience}</li>
                            <li>Topics: {item.topics}</li>
                            <li>Message: {item.message}</li>
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
