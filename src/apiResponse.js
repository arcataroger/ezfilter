import {decode as htmlEntityDecode} from 'he'; // For rendering HTML entities inside description strings

const D7Output = {
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
            "sold_out": "1",
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
            "sold_out": "1",
            "online_event": "0",
            "message": "<p>Celebrate <em>T. rex</em>&nbsp;and other famous dinosaurs that lived before and during SUE's time.</p>",
            "topics": null,
            "audience": null
        }
    }], "pager": {"pages": 1, "page": 0, "count": 10, "limit": 12}
};

let apiResponse = D7Output.nodes.map(entry => {

    const node = entry.node;

    // Typecast strings into arrays
    ['audience','topics'].forEach(key => {
        if(node[key]) {
            node[key] = htmlEntityDecode(node[key]);
            node[key] = node[key].split('|');
        }
    });

    // Type strings into booleans
    ['sold_out', 'online_event'].forEach(key =>
    {
        switch(node[key]) {
            case true:
            case 'true':
            case '1':
            case 1:
                node[key] = true;
                break;

            default:
                node[key] = false;
        }
    });

    // Parse HTML entities from Drupal's output
    if(node.message) {
        node.message = htmlEntityDecode(node.message);
    }

    return node;
});

export default apiResponse;