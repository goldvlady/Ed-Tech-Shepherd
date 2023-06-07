import { Checkbox, Flex } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import styled from 'styled-components';

export interface Option {
    value: string;
    label: string;
}

type Props = React.ComponentProps<typeof Select>;

const StyledCheckbox = styled(Checkbox)`
    display: none;
    pointer-events: none;
    [data-invalid] {
        border-color: inherit !important;
    }
`;

const StyledSelect = styled(Select)`
    [role='button'] {
        ${StyledCheckbox} {
            display: flex;
        }
    }
`;

const SelectComponent: React.FC<Props> = ({ options, ...rest }) => {
    return (
        <StyledSelect
            options={(options as Option[]).map((o) => {
                if (rest.isMulti) {
                    const isSelected = !![
                        ...((rest.defaultValue || rest.value) as Option[]),
                    ].find((v) => v.value === o.value);
                    return {
                        ...o,
                        label: (
                            <Flex gap={'5px'}>
                                <StyledCheckbox
                                    readOnly
                                    isChecked={isSelected}
                                />{' '}
                                {o.label}
                            </Flex>
                        ),
                    };
                }

                return o;
            })}
            closeMenuOnSelect={!rest.isMulti}
            hideSelectedOptions={false}
            chakraStyles={{
                menu: () => ({
                    zIndex: 9999,
                    position: 'absolute',
                    left: 0,
                    right: 0,
                }),
                option: (provided, { isSelected, isFocused }) => ({
                    ...provided,
                    color: '#585F68',
                    fontWeight: '500',
                    fontSize: '14px',
                    ...((isSelected || isFocused) && {
                        background: '#F2F4F7',
                    }),
                }),
            }}
            {...rest}
        />
    );
};

export default SelectComponent;
