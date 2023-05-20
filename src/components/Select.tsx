import { Select } from 'chakra-react-select';

export interface Option {
    value: string
    label: string;
}

type Props = React.ComponentProps<typeof Select>;

const SelectComponent: React.FC<Props> = ({ ...rest }) => {
    return <Select chakraStyles={{
        menu: () => ({
            zIndex: 9999,
            position: 'absolute',
            left: 0,
            right: 0
        }),
        option: (provided, { isSelected, isFocused }) => ({
            ...provided,
            color: '#585F68',
            fontWeight: '500',
            fontSize: '14px',
            ...((isSelected || isFocused) && {
                background: '#F2F4F7'
            })
        })
    }} {...rest} />
}

export default SelectComponent;