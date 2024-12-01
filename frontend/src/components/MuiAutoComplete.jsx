/* eslint-disable react/prop-types */
// /* eslint-disable react/prop-types */
// import { Autocomplete, TextField, Chip, Box, Typography } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";

// const MUIAutocomplete = ({
//   options,
//   value,
//   onChange,
//   label,
//   multiple = false,
//   placeholder,
//   required = false,
//   disabled = false,
//   error = false,
//   helperText = "",
//   getOptionLabel = (option) => option?.toString() || "",
//   freeSolo = false,
//   handleAddCategory,
// }) => {
//   return (
//     <Autocomplete
//       multiple={multiple}
//       options={options}
//       value={value}
//       onChange={(event, newValue, reason) => {
//         // Check if the selected option is a new category
//         if (newValue && newValue.isNewOption) {
//           // Extract the category name from the "Add "category"" string
//           const newCategory = newValue.category.slice(5, -1);
//           // Call handleAddCategory with the new category name
//           handleAddCategory(newCategory);
//           // Create a new option object matching your existing options structure
//           const newOption = { category: newCategory };
//           // Call onChange with the new option to select it
//           onChange(
//             event,
//             multiple ? [...(value || []), newOption] : newOption,
//             reason
//           );
//           return;
//         }
//         // Call the original onChange handler
//         onChange(event, newValue, reason);
//       }}
//       getOptionLabel={getOptionLabel}
//       disabled={disabled}
//       freeSolo={freeSolo}
//       filterOptions={(options, params) => {
//         const inputValue = params.inputValue?.toLowerCase();

//         // If handleAddCategory is provided, use category-specific filtering
//         if (handleAddCategory) {
//           const filtered = options.filter((option) =>
//             option.category?.toLowerCase().includes(inputValue)
//           );

//           if (
//             inputValue !== "" &&
//             !filtered.some(
//               (option) => option.category.toLowerCase() === inputValue
//             )
//           ) {
//             filtered.push({
//               category: `Add "${params.inputValue}"`,
//               isNewOption: true,
//             });
//           }
//           return filtered;
//         }
//         return options.filter((option) =>
//           getOptionLabel(option).toLowerCase().includes(inputValue)
//         );
//       }}
//       renderOption={(props, option, { selected }) => (
//         <Box
//           component="li"
//           {...props}
//           onClick={(e) => {
//             if (option.isNewOption) {
//               e.preventDefault();
//               const newCategory = option.category.slice(5, -1);
//               handleAddCategory(newCategory);
//               // Create and select the new option
//               const newOption = { category: newCategory };
//               onChange(
//                 null,
//                 multiple ? [...(value || []), newOption] : newOption,
//                 "select-option"
//               );
//             } else {
//               props.onClick(e);
//             }
//           }}
//         >
//           {option.isNewOption ? (
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               <AddIcon fontSize="small" />
//               <Typography>{option.category}</Typography>
//             </Box>
//           ) : (
//             <Typography>{option.category}</Typography>
//           )}
//         </Box>
//       )}
//       renderTags={(value, getTagProps) =>
//         value.map((option, index) => (
//           <Chip
//             key={option}
//             label={getOptionLabel(option)}
//             {...getTagProps({ index })}
//             size="medium"
//           />
//         ))
//       }
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           label={label}
//           placeholder={placeholder}
//           required={required}
//           error={error}
//           helperText={helperText}
//           variant="outlined"
//           fullWidth
//         />
//       )}
//     />
//   );
// };

// export default MUIAutocomplete;

import {
  Autocomplete,
  TextField,
  Chip,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const MUIAutocomplete = ({
  options = [], // list of options to display
  value, // controlled selected value(s)
  onChange, // callback when selection changes
  label = "", // label for the input
  multiple = false, // is it multi-select or single-select
  placeholder = "", // placeholder for the input
  required = false, // if the field is required
  disabled = false, // to disable the input
  error = false, // flag to show error styling
  helperText = "", // text for helper/error
  freeSolo = false, // allow free text input
  handleAddItem, // function to handle adding a new option
  loading = false, // is there a loading state
  getOptionLabel = (option) => option?.toString() || "", // how to display options (default is toString)
  type = "item", // category, tag, or any other type
  loadingText = "Loading...", // custom loading text
  noOptionsText = "No options", // custom no options text
}) => {
  // Helper function to add a new item (category/tag or free text)
  const handleNewItem = async (newOptionLabel, reason) => {
    if (handleAddItem) {
      try {
        // Adding a new item, waits for async function (i.e., backend call)
        const newItem = await handleAddItem(newOptionLabel);
        onChange(
          null,
          multiple ? [...(value || []), newItem] : newItem,
          reason
        );
      } catch (err) {
        console.error(`Error adding new ${type}:`, err);
      }
    }
  };

  return (
    <Autocomplete
      multiple={multiple}
      options={options}
      value={value}
      onChange={(event, newValue, reason) => {
        // If it's a new option being added
        if (newValue && newValue.isNewOption) {
          const newItemLabel = newValue[type].slice(5, -1); // Extract text between Add "item"
          handleNewItem(newItemLabel, reason);
          return;
        }
        // Normal option change
        onChange(event, newValue, reason);
      }}
      getOptionLabel={getOptionLabel}
      disabled={disabled || loading}
      freeSolo={freeSolo}
      loading={loading}
      filterOptions={(options, params) => {
        const inputValue = params.inputValue.toLowerCase();

        // Filter existing options based on input value
        const filtered = options.filter((option) =>
          getOptionLabel(option).toLowerCase().includes(inputValue)
        );

        // If free solo and input does not match any option, allow creation
        if (
          handleAddItem &&
          inputValue !== "" &&
          !filtered.some(
            (option) => getOptionLabel(option).toLowerCase() === inputValue
          )
        ) {
          filtered.push({
            [type]: `Add "${params.inputValue}"`,
            isNewOption: true,
          });
        }

        return filtered;
      }}
      loadingText={loadingText}
      noOptionsText={noOptionsText}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
          onClick={(e) => {
            if (option.isNewOption) {
              e.preventDefault();
              const newItemLabel = option[type].slice(5, -1);
              handleNewItem(newItemLabel, "select-option");
            } else {
              props.onClick(e);
            }
          }}
        >
          {option.isNewOption ? (
            <>
              <AddIcon fontSize="small" />
              <Typography>Add  &quot;{option[type].slice(5, -1)}&quot;</Typography>
            </>
          ) : (
            <Typography>{getOptionLabel(option)}</Typography>
          )}
        </Box>
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={index}
            label={getOptionLabel(option)}
            {...getTagProps({ index })}
            size="medium"
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={error}
          helperText={helperText}
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default MUIAutocomplete;
