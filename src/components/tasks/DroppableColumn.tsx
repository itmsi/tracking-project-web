import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Box } from '@mui/material';

interface DroppableColumnProps {
  id: string;
  children: React.ReactNode;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        flexGrow: 1,
        minHeight: 400,
        backgroundColor: isOver ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
        borderRadius: 2,
        p: 1,
        transition: 'background-color 0.2s ease-in-out',
        border: isOver ? '2px dashed #3f51b5' : '2px dashed transparent',
      }}
    >
      {children}
    </Box>
  );
};

export default DroppableColumn;
