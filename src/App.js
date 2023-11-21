import React, { useState, useEffect } from 'react';
import './App.css'; // Import your CSS file for styling
import { TextField, Checkbox, FormControlLabel, Radio, RadioGroup, FormControl, FormLabel, Select, MenuItem, Switch, Container } from '@mui/material';

const DynamicForm = ({ schema }) => {
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => {
    const { id, value, checked } = e.target;
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: e.target.type === 'checkbox' ? checked : value,
    }));
  };
  const handleSwitchChange = (jsonKey) => {
    setFormData({
      ...formData,
      [jsonKey]: !formData[jsonKey],
    });
  };

  
  const renderFormItem = (item) => {
    switch (item.uiType) {
      case 'Input':
        return (
          <TextField
            key={item.jsonKey}
            id={item.jsonKey}
            label={item.label}
            value={formData[item.jsonKey] || ''}
            onChange={handleInputChange}
            fullWidth
            variant="filled" color="success"
          />
        );
      case 'Select':
        return (
          <FormControl fullWidth key={item.jsonKey}>
            <FormLabel>{item.label}</FormLabel>
            <Select
              id={item.jsonKey}
              value={formData[item.jsonKey]}
              onChange={handleInputChange}
              variant="filled" color="success"
            >
              {item.validate.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'Switch':
        return (
          <FormControlLabel
            key={item.jsonKey}
            control={<Switch id={item.jsonKey} checked={formData[item.jsonKey] || false} onChange={() => handleSwitchChange(item.jsonKey)} color='secondary'/>}
            label={item.label}
            className='text-black'
          />
        );
      case 'Group':
        return (
          <div key={item.jsonKey}>
            <h2 className='text-black mt-5 font-medium'>{item.label}</h2>
            {item.subParameters.map((subItem) => renderFormItem(subItem))}
          </div>
        );
      case 'Radio':
        return (
          <FormControl key={item.jsonKey} component="fieldset" >
            {/* <FormLabel color="success">{item.label}</FormLabel> */}
            <RadioGroup
              id={item.jsonKey}
              value={formData[item.jsonKey]}
              onChange={handleInputChange}
            >
              {item.validate.options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                  className='text-black'
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <div className='big-div'>
      {schema.map((item) => renderFormItem(item))}
    </div>
  );
};

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [jsonSchema, setJsonSchema] = useState(null);

  useEffect(() => {
    try {
      const parsedSchema = JSON.parse(jsonInput);
      setJsonSchema(parsedSchema);
    } catch (error) {
      console.error('Invalid JSON input:', error.stack);
      // You can handle the error (e.g., display an error message to the user)
    }
  }, [jsonInput]);

  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  return (
    <div className="app-container">
      <div className="half-container split-pane col-xs-12 col-sm-6 uiux-side">
        <h1 className='text-bold'>JSON Schema Input</h1>
        <textarea
          id="jsonInput"
          value={jsonInput}
          onChange={handleJsonInputChange}
          className='text-black text-sm py-5 px-5 mt-[20px] rounded-md opacity-90'
        />
      </div>

      <div className="half-container split-pane col-xs-12 col-sm-6 frontend-side">
        <h1 className='ml-[20px]'>Generated Form</h1>
        {jsonSchema && <DynamicForm schema={jsonSchema} />}
      </div>
    </div>
  );
};

export default App;
