import React from 'react';
import { Button } from '@mui/material';

const FormActions = ({ handleClearClick, exportToGoogleSheet }) => {
  return (
    <div>
      <Button
        onClick={handleClearClick}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        DELETE
      </Button>
    </div>
  );
};

export default FormActions;
