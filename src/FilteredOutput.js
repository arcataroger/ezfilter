import {FilterContext} from "./filters";
import {useContext} from "react";

const FilteredOutput = () => {
    const [context] = useContext(FilterContext);
    const results = context.output;
    console.log('Display context', context);

    return (
        <>
            <h1>Showing {results.length} event(s)</h1>
            <ul>
                {results.map(item => (
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
        </>
    )
}

export default FilteredOutput;