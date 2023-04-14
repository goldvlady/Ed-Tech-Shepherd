import * as React from "react";
import moment from 'moment-timezone';
import { useChakraSelectProps, Select } from "chakra-react-select";
import { zones } from "../tzdata";
import { useCallback, useEffect } from "react";

type Props = {
    value: any;
    onChange: (value: Props["value"]) => void;
}

const options = zones.map(tz => {
    const offset = parseInt(moment.tz(tz).format('Z'));
    const zoneAbbv = moment.tz(new Date(), tz).format('z');
    let label = `(GMT${offset >= 0 ? "+" : ""}${offset}) ${tz.replace(/_/g, ' ')} ${Number.isNaN(parseInt(zoneAbbv)) ? "— " + zoneAbbv : ``}`;

    return {
        label, value: tz, offset
    }
}).sort((a,b) => a.offset - b.offset);

const TimezoneSelect: React.FC<Props> = ({ value, onChange }) => {
    const selectProps = useChakraSelectProps({
        onChange,
        options: options
    });

    const guessTimezone = useCallback(() => {
        const assumedTimezone = moment.tz.guess();
        const assumedTimezoneInOptions = options.find(o => o.value === assumedTimezone);
        
        if (assumedTimezoneInOptions)
            onChange(assumedTimezoneInOptions)
    }, [])

    useEffect(() => {
        if (!value)
            guessTimezone();
    }, [guessTimezone])

    return <Select
        tagVariant="solid"
        defaultValue={options.find(o => o.value === value)}
        {...selectProps}
    />
}

export default TimezoneSelect;