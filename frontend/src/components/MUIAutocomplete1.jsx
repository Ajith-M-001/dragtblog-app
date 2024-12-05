/* eslint-disable react/prop-types */
import { Autocomplete, TextField, Chip, Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const MUIAutocomplete1 = ({
  options,
  label,
  value,
  onChange,
  placeholder = "",
  getOptionLabel,
  freeSolo = false,
  handleCreate,
  isMultiple = false,
  disabled = false,
  required = false,
  error = false,
  helperText = "",
}) => {
  return (
    <Autocomplete
      multiple={isMultiple}
      freeSolo={freeSolo}
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled}
      filterOptions={(options, { inputValue }) => {
        const filtered = options.filter((option) =>
          getOptionLabel(option)
            .toLowerCase()
            .includes(inputValue.toLowerCase())
        );

        if (inputValue !== "" && filtered.length === 0) {
          filtered.push({
            value: inputValue,
            label: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={error}
          helperText={helperText}
        />
      )}
      renderOption={(props, option) => {
        return (
          <Box key={option.value} component="li" {...props}>
            {option.label ? (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                onClick={() => handleCreate(option.value)}
              >
                <AddIcon fontSize="small" />
                <Typography>Add &quot;{option.value}&quot;</Typography>
              </Box>
            ) : (
              <Typography>{getOptionLabel(option)}</Typography>
            )}
          </Box>
        );
      }}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            key={index}
            variant="outlined"
            label={getOptionLabel(option)}
            {...getTagProps({ index })}
            size="medium"
          />
        ))
      }
    />
  );
};

export default MUIAutocomplete1;
