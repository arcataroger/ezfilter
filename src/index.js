import React, {useState, useEffect} from "react";
import ReactDOM from 'react-dom';
import CheckboxGroup from 'react-checkbox-group'
import {decode as htmlEntityDecode} from 'he'

// Parse and transform API response into an associative array
const apiResponse = {
    "nodes": [{
        "node": {
            "nid": "31439",
            "title": "Filter Test Event",
            "path": "/our-events/filter-test-event",
            "start_date": "1607876100",
            "end_date": "1608833700",
            "sold_out": "0",
            "online_event": "0",
            "message": "",
            "topics": "Amphibians &amp; Reptiles|Ancient Americas|Animals",
            "audience": "Comma Test, Test, Test|Families|Adults"
        }
    }, {
        "node": {
            "nid": "31406",
            "title": "Discovery Adventures: How do animals adapt to the cold?",
            "path": "/our-events/discovery-adventures-how-do-animals-adapt-cold",
            "start_date": "1608053400",
            "end_date": "1608055200",
            "sold_out": "0",
            "online_event": "1",
            "message": "<p>Tune into this free, online event to learn about the natural world with up close looks at Field Museum exhibitions, collections, and research.</p>",
            "topics": "Animals",
            "audience": "Families|Adults|Teens &amp; Pre-teens"
        }
    }, {
        "node": {
            "nid": "31413",
            "title": "Discovery Adventures for Classrooms: How do animals adapt to the cold?",
            "path": "/our-events/discovery-adventures-classrooms-how-do-animals-adapt-cold",
            "start_date": "1608058800",
            "end_date": "1608060600",
            "sold_out": "0",
            "online_event": "1",
            "message": "<p>Students learn about the natural world in this free, online event with up-close looks at Field Museum exhibitions, collections, and research.</p>",
            "topics": "Animals",
            "audience": "Families|Teens &amp; Pre-teens|Educators"
        }
    }, {
        "node": {
            "nid": "31343",
            "title": "SUE the T. rex Virtual Tour: Prehistoric Winter",
            "path": "/our-events/sue-t-rex-virtual-tour-1",
            "start_date": "1608154200",
            "end_date": "1608157800",
            "sold_out": "0",
            "online_event": "0",
            "message": "<p>Explore aspects of SUE's environment, including the temperature range they endured.</p>",
            "topics": null,
            "audience": null
        }
    }, {
        "node": {
            "nid": "31426",
            "title": "SUE Science Saturdays: Prehistoric Party",
            "path": "/our-events/sue-science-saturdays-prehistoric-party",
            "start_date": "1611417600",
            "end_date": "1611424800",
            "sold_out": "0",
            "online_event": "1",
            "message": "<p>Families spend their Saturday morning online with Field scientists and SUE the T. rex for a hands-on look at the museum.</p>",
            "topics": "Dinosaurs",
            "audience": "Families"
        }
    }, {
        "node": {
            "nid": "31344",
            "title": "SUE the T. rex Virtual Tour: Cretaceous Cupid",
            "path": "/our-events/sue-t-rex-virtual-tour-2",
            "start_date": "1612992600",
            "end_date": "1612996200",
            "sold_out": "0",
            "online_event": "0",
            "message": "<p>Uncover some of SUE's favorite treats. Then, learn about <em>T. rex</em> mating habits and gender determination.</p>",
            "topics": null,
            "audience": null
        }
    }, {
        "node": {
            "nid": "31427",
            "title": "SUE Science Saturdays: Time Travelling Through the Midwest  ",
            "path": "/our-events/sue-science-saturdays-time-travelling-through-midwest",
            "start_date": "1615651200",
            "end_date": "1615658400",
            "sold_out": "0",
            "online_event": "1",
            "message": "<p>Families spend their Saturday morning online with Field scientists and SUE the T. rex for a hands-on look at the museum.</p>",
            "topics": "Dinosaurs",
            "audience": "Families"
        }
    }, {
        "node": {
            "nid": "31345",
            "title": "SUE the T. rex Virtual Tour: April Fools'",
            "path": "/our-events/sue-t-rex-virtual-tour-3",
            "start_date": "1617222600",
            "end_date": "1617226200",
            "sold_out": "0",
            "online_event": "0",
            "message": "<p>See how dinosaurs have stumped scientists\u2014and what mysteries SUE helps solve.</p>",
            "topics": null,
            "audience": null
        }
    }, {
        "node": {
            "nid": "31428",
            "title": "SUE Science Saturdays: Urban Ecology: The Wilder Side of the City    ",
            "path": "/our-events/sue-science-saturdays-urban-ecology-wilder-side-city",
            "start_date": "1618671600",
            "end_date": "1618678800",
            "sold_out": "0",
            "online_event": "1",
            "message": "<p>Families spend their Saturday morning online with Field scientists and SUE the T. rex for a hands-on look at the museum.</p>",
            "topics": "Dinosaurs",
            "audience": "Families"
        }
    }, {
        "node": {
            "nid": "31346",
            "title": "SUE the T. rex Virtual Tour: National Dinosaur Day",
            "path": "/our-events/sue-t-rex-virtual-tour-national-dinosaur-day",
            "start_date": "1622579400",
            "end_date": "1622583000",
            "sold_out": "0",
            "online_event": "0",
            "message": "<p>Celebrate <em>T. rex</em>&nbsp;and other famous dinosaurs that lived before and during SUE's time.</p>",
            "topics": null,
            "audience": null
        }
    }], "pager": {"pages": 1, "page": 0, "count": 10, "limit": 12}
};
const events = apiResponse.nodes.map(v => v.node);

// Calculate available audiences based on API response
let audiences = new Set(); // To ensure uniqueness
events.forEach(event => {
    if (event.audience) {
        event.audience.split('|').map(audience => audiences.add(audience))
    }
})
console.log(audiences);

function App() {

    // Searchbox
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const handleChange = e => {
        setSearchTerm(e.target.value);
    };
    useEffect(() => {
        const results = events.filter(event =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    }, [searchTerm]);


    return (
        <div className="App">
            <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleChange}
            />

            <ul>
                {[...audiences].map(audience => (
                    <li>{htmlEntityDecode(audience)}</li>
                ))}
            </ul>


            <ul>
                {searchResults.map(item => (
                    <li>{item.title}</li>
                ))}
            </ul>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
