/* Context for sharing state across components */
import React, {useContext, useEffect, useMemo, useState} from "react";

export const FilterContext = React.createContext();

export const FilterContextProvider = ({children, inputArray}) => {
    const [state, setState] = useState({
        filteredData: inputArray,
        originalData: inputArray
    });

    return (
        <FilterContext.Provider value={[state, setState]}>
            {children}
        </FilterContext.Provider>
    );
};


export function OnlineFilter() {
    const [context, setContext] = useContext(FilterContext);

    // Online only
    const [onlineOnly, setOnlineOnly] = useState(false);
    const onlineOnlyHandler = () => setOnlineOnly(!onlineOnly);


    useEffect(() => {
        console.log('Current context', context);
        const onlineOnlyEvents = onlineOnly ? context.originalData.filter(event => event.online_event === true) : context.originalData;
        setContext({...context, filteredData: onlineOnlyEvents});
        console.log('Modified context', context);
    }, [onlineOnly]);


    return (
        <label>
            <input
                name="onlineOnly"
                type="checkbox"
                checked={onlineOnly}
                onChange={onlineOnlyHandler}
            />
            Online
        </label>
    )
}

export function MultiSelectFilter() {
    // From https://www.30secondsofcode.org/react/s/multiselect-checkbox

    /*
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
    */

    /*    // Multiselect
        if (taxonomyFilters.length > 0) {
            console.log(taxonomyFilters, filteredEvents);
            filteredEvents = filteredEvents.filter(event =>
                // Array.some returns true as soon as the condition matches one element of the array, then stops
                taxonomyFilters.some(selected => event.audience && event.audience.includes(selected.label))
            )
        }*/

}