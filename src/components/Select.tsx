import { Select } from 'chakra-react-select';

type Props = React.ComponentProps<typeof Select>;

const SelectComponent: React.FC<Props> = ({ ...rest }) => {
    return <Select chakraStyles={{
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