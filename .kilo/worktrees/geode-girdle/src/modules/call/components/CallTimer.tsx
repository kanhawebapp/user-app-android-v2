import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface CallTimerProps {
  duration: number;
  isActive?: boolean;
}

export const CallTimer: React.FC<CallTimerProps> = ({
  duration,
  isActive = true,
}) => {
  const [displayTime, setDisplayTime] = useState(formatTime(duration));

  useEffect(() => {
    setDisplayTime(formatTime(duration));
  }, [duration]);

  function formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }

  return (
    <View style={styles.container}>
      {isActive && <View style={styles.recordingIndicator} />}
      <Text style={styles.timerText}>{displayTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  recordingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4444',
    marginRight: 8,
  },
  timerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});

export default CallTimer;
