/* Context for sharing state across components */
import React, {useContext, useEffect, useState} from "react";

export const FilterContextProvider = ({children, inputArray}) => {
    const [state, setState] = useState({
        input: inputArray,
        filterFunctionsArray: [],
        output: inputArray
    });

    useEffect(() => {
        let filteredOutput = inputArray;

        if (state.filterFunctionsArray.length) {
            state.filterFunctionsArray.map(filterFunction => filteredOutput = filteredOutput.filter(item => filterFunction.function(item)));
        }

        setState({...state, output: filteredOutput});
    }, [state.filterFunctionsArray.length]);

    return (
        <FilterContext.Provider value={[state, setState]}>
            {children}
        </FilterContext.Provider>
    );
};

export const FilterContext = React.createContext();

export const BooleanFilter = ({label, parameterName}) => {
    const [context, setContext] = useContext(FilterContext);

    const [booleanState, setBooleanState] = useState(false);
    const booleanHandler = () => setBooleanState(!booleanState);
    const filterFunction = (item) => item[parameterName] === booleanState;

    useEffect(() => {
        console.log('Current context', context);

        let newFilterFunctionsArray = context.filterFunctionsArray;

        // When the box is unchecked, we don't want to filter ONLY for false, we want to show everything
        if (booleanState) {
            newFilterFunctionsArray.push({name: parameterName, function: filterFunction});
        } else {
            newFilterFunctionsArray = newFilterFunctionsArray.filter(item => item.name !== parameterName);
        }
        setContext({...context, filterFunctionsArray: newFilterFunctionsArray});
        console.log('Modified context', context);
    }, [booleanState]);


    return (
        <label>
            <input
                name={parameterName}
                type="checkbox"
                checked={booleanState}
                onChange={booleanHandler}
            />
            {label}
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