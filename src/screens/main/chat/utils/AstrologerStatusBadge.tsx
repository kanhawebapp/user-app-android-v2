import React from 'react';
import { Text, View } from 'react-native';

interface Props {
  status: 'online' | 'busy' | 'offline';
}

const STATUS_COLORS = {
  online: '#10B981',
  busy: '#F59E0B',
  offline: '#9CA3AF',
};

export default function AstrologerStatusBadge({
  status,
}: Props) {
  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
        backgroundColor: STATUS_COLORS[status] + '20',
      }}>
      <Text
        style={{
          color: STATUS_COLORS[status],
          fontWeight: '600',
          fontSize: 11,
          textTransform: 'capitalize',
        }}>
        {status}
      </Text>
    </View>
  );
}