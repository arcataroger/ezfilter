/* Context for sharing state across components */
import React, {useContext, useEffect, useState} from "react";
import MultiSelect from "react-multi-select-component";


export const FilterContextProvider = ({children, inputArray}) => {
    const [state, setState] = useState({
        inputArray: inputArray,
        filterFunctionsArray: [],
        outputArray: inputArray
    });

    useEffect(() => {
        let filteredOutput = inputArray;

        if (state.filterFunctionsArray.length) {
            state.filterFunctionsArray.map(filterFunction => filteredOutput = filteredOutput.filter(item => filterFunction.function(item)));
        }

        setState({...state, outputArray: filteredOutput});
    }, [state.filterFunctionsArray.length]);

    return (
        <FilterContext.Provider value={[state, setState]}>
            {children}
        </FilterContext.Provider>
    );
};

export const FilterContext = React.createContext();

export const BooleanFilter = ({parameterName, label}) => {
    const [context, setContext] = useContext(FilterContext);

    const [booleanState, setBooleanState] = useState(false);
    const booleanHandler = () => setBooleanState(!booleanState);
    const filterFunction = (item) => item[parameterName] === booleanState;

    useEffect(() => {
        console.log('Current context', context);

        let newFilterFunctionsArray = context.filterFunctionsArray;

        if (booleanState) {
            // When the box is checked, we add a new filter function to the array
            newFilterFunctionsArray.push({name: parameterName, function: filterFunction});
        } else {
            // When the box is unchecked, we want to REMOVE this filter from the array, so we filter it out
            // We do this because (counter-intuitively), the box being unchecked does NOT mean we want to filter for `false
            // Rather, we'd rather just remove the filter to show everything. The alternative would be a 3-state checkbox
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

export function MultiSelectFilter({parameterName, label}) {
    const [context, setContext] = useContext(FilterContext);

    const validOptions = new Set();
    context.inputArray.forEach(item => {
            if (item[parameterName]) {
                item[parameterName].forEach(optionName =>
                    validOptions.add(optionName)
                )
            }
        }
    );

    console.log(parameterName, validOptions);

    const optionsArray = [];
    validOptions.forEach(option => optionsArray.push({label: option, value: option}))
    console.log(parameterName + ' array', optionsArray);

    const [selected, setSelected] = useState([]);


    // Now we use https://www.npmjs.com/package/react-multi-select-component to display the actual checkboxes
    const overrideStrings = {
        // "allItemsAreSelected": "All items are selected.",
        // "clearSearch": "Clear Search",
        // "noOptions": "No options",
        // "search": "Search",
        // "selectAll": "Select All",
        "selectSomeItems": label
    }

    return (
        <MultiSelect
            options={optionsArray}
            value={selected}
            onChange={setSelected}
            hasSelectAll={false}
            disableSearch={true}
            overrideStrings={overrideStrings}
        />
    );

    /*// Multiselect
    if (taxonomyFilters.length > 0) {
        console.log(taxonomyFilters, filteredEvents);
        filteredEvents = filteredEvents.filter(event =>
            // Array.some returns true as soon as the condition matches one element of the array, then stops
            taxonomyFilters.some(selected => event.audience && event.audience.includes(selected.label))
        )
    }
*/
}