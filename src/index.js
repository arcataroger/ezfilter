import React, {useState, useEffect, useMemo} from "react";
import ReactDOM from 'react-dom';
import Fuse from 'fuse.js'; // Fuzzy keyword search
import './App.css';
import apiResponse from "./apiResponse.js"; // Parse and transform mock API response into an array

function MultiselectCheckbox({options, onChange}) {
    // From https://www.30secondsofcode.org/react/s/multiselect-checkbox

    const [data, setData] = useState(options);

    const toggle = index => {
        const newData = [...data];
        newData.splice(index, 1, {
            label: data[index].label,
            checked: !data[index].checked
        });
        setData(newData);
        onChange(newData.filter(x => x.checked));
    };

    return (
        <>
            {data.map((item, index) => (
                <label key={item.label}>
                    <input
                        readOnly
                        type="checkbox"
                        checked={item.checked || false}
                        onClick={() => toggle(index)}
                    />
                    {item.label}
                </label>
            ))}
        </>
    );
}


function App() {
    // Which keys do we want to filter by?
    const options = {
        multiselectFields: {audience: 'Audiences', topics: 'Topics'}, // Multiselect filters (dropdowns and checkboxes)
        booleanFields: ['sold_out', 'online_event'], // Boolean filters (single checkboxes)
        enableKeywordSearch: true, // Turn keyword search on or off
        keywordSearchFields: ['title', 'message'], // Which keys to perform keyword search on
    };


    const eventsFromAPI = apiResponse;

    const taxonomies = {};
    Object.keys(options.multiselectFields).forEach(key => {
        let uniqueOptions = new Set(); // To ensure uniqueness
        eventsFromAPI.forEach(event => {
            if (event[key]) {
                event[key].map(item => uniqueOptions.add(item))
            }
        })

        taxonomies[key] = [...uniqueOptions].map(filterString => {
            return {label: filterString, value: filterString} // The format expected by ReactMultiSelectCheckboxes
        });
    })

    console.log('taxonomies', taxonomies);

    // Title & description keyword search
    const [searchTerm, setSearchTerm] = useState("");
    const textSearch = e => {
        setSearchTerm(e.target.value);
    };

    // Online only
    const [onlineOnly, setOnlineOnly] = useState(false);
    const onlineOnlyHandler = () => setOnlineOnly(!onlineOnly);

    // Taxonomy filters (multiselect checkboxes)
    const [taxonomyFilters, setTaxonomyFilters] = useState([]);

    // The filtering algorithm
    const searchResults = useMemo(() => {
        let filteredEvents = eventsFromAPI;

        // Then do a fuzzy keyword match
        if (searchTerm) {
            const fuse = new Fuse(filteredEvents, {
                keys: options.keywordSearchFields
            })

            filteredEvents = fuse.search(searchTerm).map(result => result.item);
        }

        // Online events only
        if (onlineOnly) filteredEvents = filteredEvents.filter(event => event.online_event);

        // Multiselect
        if (taxonomyFilters.length > 0) {
            console.log(taxonomyFilters, filteredEvents);
            filteredEvents = filteredEvents.filter(event =>
                // Array.some returns true as soon as the condition matches one element of the array, then stops
                taxonomyFilters.some(selected => event.audience && event.audience.includes(selected.label))
            )
        }

        return filteredEvents;
    }, [searchTerm, onlineOnly, taxonomyFilters]);

    return (
        <div className="App">
            {
                options.enableKeywordSearch &&
                <input
                    type="text"
                    placeholder="Search titles & descriptions"
                    value={searchTerm}
                    onChange={textSearch}
                />
            }

            {Object.keys(taxonomies).map(key => {
                return <MultiselectCheckbox
                    options={taxonomies[key]}
                    onChange={setTaxonomyFilters}
                    key={key}
                />
            })
            }

            <label>Online
                <input
                    name="onlineOnly"
                    type="checkbox"
                    checked={onlineOnly}
                    onChange={onlineOnlyHandler}
                />
            </label>

            <h1>Showing {searchResults.length} event(s) out of {eventsFromAPI.length} total</h1>
            <ul>
                {searchResults.map(item => (
                    <li key={item.nid}><h2>{item.title}</h2>
                        <ul>
                            <li>Online? {String(item.online_event)}</li>
                            <li>Sold out? {String(item.sold_out)}</li>
                            <li>Audiences: {item.audience && item.audience.join(', ')}</li>
                            <li>Topics: {item.topics && item.topics.join(', ')}</li>
                            <p dangerouslySetInnerHTML={{__html: item.message}}/>
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
