import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    Autocomplete, 
    Box, 
    CircularProgress, 
    ListItem, 
    ListItemText,
    TextField
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSearchByNameList } from '../../store/slices/poisSlice';

const PoiSearch = React.memo(({ value, options, onChange, onInputChange, /*, onDelete*/ }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  //стейты
  /*const [inputValue, setInputValue] = useState(selectedValue ? `${selectedValue?.code} ${selectedValue?.name}` : '');
  const [selectedOption, setSelectedOption] = useState(selectedValue || null);*/

  //эффекты
  /*useEffect(() => {
    setInputValue(selectedValue ? `${selectedValue?.code} ${selectedValue?.name}` : '');
    setSelectedOption(selectedValue || null);
  }, [selectedValue, dispatch]);*/
  //
  return (    
    <> 
      <Autocomplete
        options={options || []}
        getOptionLabel={(option) => option.name || ''}
        /*getOptionSelected={(option, value) => option.name === value.name}
        filterOptions={(options, state) => {
          const { inputValue } = state;
          return options.filter(option => option.name.toLowerCase().includes(inputValue.toLowerCase())
          );
        }}*/
        onInputChange={onInputChange}
        onChange={onChange}
        isOptionEqualToValue={(a, b) => a.id === b.id}
        loadingText="поиск данных"
        noOptionsText="введите наименование объекта"
        ListboxProps={{
          sx: { maxHeight: '50vh', overflowY: 'auto' }
        }}
        renderOption={(props, option) => (
          <ListItem
            {...props}
            key={option.id}
            sx={{
              padding: '8px 16px',
              color: 'text.primary',
            }}
          >
            <ListItemText
              primary={option.name}
              secondary={option.category}
              primaryTypographyProps={{ noWrap: true }}
              secondaryTypographyProps={{
                noWrap: true,
                fontSize: '0.85rem',
                color: 'text.secondary',
              }}
            />
          </ListItem>
        )}
        renderInput={(params) => (
            <TextField
              {...params}
              required
              fullWidth
              name='poiName'
              /*id={id}*/
              placeholder={'Наименование объекта'}
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1 }}
              size='small'
              value={'Наименование объекта'}
            />
        )}
        sx={{
          flex: '0 0 90%',
          height: '100%',
          '& .MuiAutocomplete-listbox': {
          backgroundColor: '#fff',
          boxShadow: 2
          },
          '& .MuiAutocomplete-option': {
          padding: '8px 16px'
          },
      }}
        value={value || null}
      />
    </>
  );
});

export { PoiSearch };