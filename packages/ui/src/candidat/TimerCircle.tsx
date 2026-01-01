'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button, Chip } from '@mui/material';
import { PlayArrow, Stop, Refresh } from '@mui/icons-material';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

interface TimerCircleProps {
  duration: number; // En secondes
  title: string;
  description: string;
  color: string;
}

export default function TimerCircle({
  duration,
  title,
  description,
  color
}: TimerCircleProps) {
  const [time, setTime] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setTime(duration);
    setIsRunning(false);
  };

  const getColor = () => {
    const percentage = (time / duration) * 100;
    if (percentage > 50) return '#2D9B94';
    if (percentage > 25) return '#FFD93D';
    return '#FF6B9D';
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
        {description}
      </Typography>

      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
        <CircularProgress
          variant="determinate"
          value={(time / duration) * 100}
          size={150}
          thickness={6}
          sx={{
            color: getColor(),
            animation: time === 0 ? `${pulse} 0.5s ease-in-out infinite` : 'none'
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, color: getColor() }}
          >
            {time}s
          </Typography>
        </Box>
      </Box>

      {time === 0 && (
        <Chip
          label="🎉 Terminé !"
          sx={{
            mb: 2,
            background: color,
            color: '#FFF',
            fontWeight: 700
          }}
        />
      )}

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        {!isRunning ? (
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={handleStart}
            disabled={time === 0}
            sx={{ background: color, flex: 1 }}
          >
            Start
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<Stop />}
            onClick={handleStop}
            sx={{ background: '#FF6B9D', flex: 1 }}
          >
            Stop
          </Button>
        )}
        <Button
          variant="outlined"
          onClick={handleReset}
          sx={{ minWidth: 50 }}
        >
          <Refresh />
        </Button>
      </Box>
    </Box>
  );
}
