import React, { useState } from 'react';
import Select from 'react-select';

const AutocompleteDropdown = (props) => {
  const { studentDocuments, selectedOption, placeholder, handleSelected } =
    props;

  const options = studentDocuments.map((item, id) => ({
    value: item.documentURL,
    label: item.title,
    id: id
  }));

  return (
    <div style={{ width: '300px', margin: '20px' }}>
      <Select
        value={selectedOption}
        onChange={handleSelected}
        options={options}
        placeholder={selectedOption ? selectedOption : placeholder}
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
      />
    </div>
  );
};

export default AutocompleteDropdown;
