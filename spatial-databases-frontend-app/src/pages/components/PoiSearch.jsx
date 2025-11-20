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

const PoiSearch = React.memo(({ item, onValueChange, onInputChange, /*, onDelete*/ }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  //стейты
  /*const [inputValue, setInputValue] = useState(selectedValue ? `${selectedValue?.code} ${selectedValue?.name}` : '');
  const [selectedOption, setSelectedOption] = useState(selectedValue || null);*/

  //селекторы
  const searchByNameList = useSelector((state) => state.pois.searchByNameList);
  const searchByNameListStatus = useSelector((state) => state.pois.searchByNameListStatus);

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
        getOptionLabel={(option) => option == null || option == undefined ? '' : `${option.name}`}
        getOptionSelected={(option, value) => option.name === value.name}
        filterOptions={(options, state) => {
          const { inputValue } = state;
          return options.filter(option => option.name.toLowerCase().includes(inputValue.toLowerCase())
          );
        }}
        onInputChange={onInputChange}
        onChange={onValueChange}
        inputValue={item.inputValue}
        loadingText="поиск данных"
        noOptionsText="введите наименование объекта"
        ListboxProps={{
            sx: {
              maxHeight: '50vh',
              overflowY: 'auto'
            }
        }}
        renderGroup={(params) => (
            <div key={params.key}>
              {params.children}                      
            </div>
        )}
        renderOption={(option) => (
            <ListItem key={`${option?.name}`} style={{ padding: '8px 16px' }}>
            <ListItemText
                primary={option?.name}
                secondary={option?.category}
                secondaryTypographyProps={{ style: { fontSize: 'small', color: 'gray' } }}
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
        value={item.value || null}
      />
    </>
  );
});

export { PoiSearch };