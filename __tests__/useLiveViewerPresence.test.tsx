/**
 * @format
 */

import 'react-native';
import React from 'react';
import {Text, View} from 'react-native';
import renderer, {ReactTestRenderer} from 'react-test-renderer';
import {act} from 'react-test-renderer';

// Mock react-native-agora-chat before importing the hook
const mockFetchChatRoomMembers = jest.fn();
const mockAddRoomListener = jest.fn();
const mockRemoveRoomListener = jest.fn();

jest.mock('react-native-agora-chat', () => ({
  ChatClient: {
    getInstance: jest.fn(() => ({
      roomManager: {
        fetchChatRoomMembers: mockFetchChatRoomMembers,
        addRoomListener: mockAddRoomListener,
        removeRoomListener: mockRemoveRoomListener,
      },
    })),
  },
}));

import {useLiveViewerPresence} from '../src/modules/live/hooks/useLiveViewerPresence';

type PresenceEvent = 'onMemberJoined' | 'onMemberExited' | 'onDestroyed';

const listenersByRoom = new Map<string, Record<PresenceEvent, any>>();

function getListener(roomId: string, event: PresenceEvent) {
  return listenersByRoom.get(roomId)?.[event];
}

function simulateMemberJoined(roomId: string, participant: string) {
  const listener = getListener(roomId, 'onMemberJoined');
  act(() => {
    listener?.({roomId, participant});
  });
}

function simulateMemberExited(roomId: string, participant: string) {
  const listener = getListener(roomId, 'onMemberExited');
  act(() => {
    listener?.({roomId, participant});
  });
}

function simulateRoomDestroyed(roomId: string) {
  const listener = getListener(roomId, 'onDestroyed');
  act(() => {
    listener?.({roomId});
  });
}

function mountPresence(props: {
  enabled: boolean;
  chatRoomId: string;
  chatUserId: string;
  memberList?: string[];
}) {
  mockFetchChatRoomMembers.mockResolvedValue({
    list: props.memberList ?? [],
  });

  let tree: ReactTestRenderer;

  const TestComponent = () => {
    const {viewerCount} = useLiveViewerPresence(props);
    return (
      <View>
        <Text>{String(viewerCount)}</Text>
      </View>
    );
  };

  act(() => {
    tree = renderer.create(<TestComponent />);
  });

  // Capture the listener registered for this room
  const lastCall =
    mockAddRoomListener.mock.calls[mockAddRoomListener.mock.calls.length - 1];
  if (lastCall) {
    listenersByRoom.set(props.chatRoomId, lastCall[0]);
  }

  const getCount = () => {
    const textNode = tree.root.findByType(Text);
    return Number(textNode.props.children);
  };

  return {
    tree,
    getCount,
    unmount: () => {
      act(() => {
        tree.unmount();
      });
      listenersByRoom.delete(props.chatRoomId);
    },
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  listenersByRoom.clear();
  mockFetchChatRoomMembers.mockResolvedValue({list: []});
  mockAddRoomListener.mockClear();
  mockRemoveRoomListener.mockClear();
});

describe('useLiveViewerPresence', () => {
  it('starts at 0 and includes the local user', async () => {
    const {getCount, unmount} = mountPresence({
      enabled: true,
      chatRoomId: 'room-1',
      chatUserId: 'user-1',
    });

    // Wait for async reconcileMembers to complete
    await act(async () => {
      await Promise.resolve();
    });

    expect(getCount()).toBe(1);
    unmount();
  });

  it('increases count when a remote member joins', async () => {
    const {getCount, unmount} = mountPresence({
      enabled: true,
      chatRoomId: 'room-1',
      chatUserId: 'user-1',
    });

    await act(async () => {
      await Promise.resolve();
    });
    expect(getCount()).toBe(1);

    simulateMemberJoined('room-1', 'user-2');
    expect(getCount()).toBe(2);

    simulateMemberJoined('room-1', 'user-3');
    expect(getCount()).toBe(3);

    unmount();
  });

  it('decreases count when a remote member exits', async () => {
    const {getCount, unmount} = mountPresence({
      enabled: true,
      chatRoomId: 'room-1',
      chatUserId: 'user-1',
    });

    await act(async () => {
      await Promise.resolve();
    });
    simulateMemberJoined('room-1', 'user-2');
    simulateMemberJoined('room-1', 'user-3');
    expect(getCount()).toBe(3);

    simulateMemberExited('room-1', 'user-2');
    expect(getCount()).toBe(2);

    simulateMemberExited('room-1', 'user-3');
    expect(getCount()).toBe(1);

    unmount();
  });

  it('does not double-count duplicate join events for the same UID', async () => {
    const {getCount, unmount} = mountPresence({
      enabled: true,
      chatRoomId: 'room-1',
      chatUserId: 'user-1',
    });

    await act(async () => {
      await Promise.resolve();
    });
    expect(getCount()).toBe(1);

    simulateMemberJoined('room-1', 'user-2');
    simulateMemberJoined('room-1', 'user-2'); // duplicate
    simulateMemberJoined('room-1', 'user-2'); // duplicate again
    expect(getCount()).toBe(2);

    unmount();
  });

  it('does not count the local user as a remote join', async () => {
    const {getCount, unmount} = mountPresence({
      enabled: true,
      chatRoomId: 'room-1',
      chatUserId: 'user-1',
    });

    await act(async () => {
      await Promise.resolve();
    });
    expect(getCount()).toBe(1);

    simulateMemberJoined('room-1', 'user-1'); // local user joining again
    expect(getCount()).toBe(1);

    unmount();
  });

  it('maintains independent counts for multiple sessions', async () => {
    const {getCount: getCountA, unmount: unmountA} = mountPresence({
      enabled: true,
      chatRoomId: 'room-a',
      chatUserId: 'user-1',
    });
    const {getCount: getCountB, unmount: unmountB} = mountPresence({
      enabled: true,
      chatRoomId: 'room-b',
      chatUserId: 'user-2',
    });

    await act(async () => {
      await Promise.resolve();
    });
    expect(getCountA()).toBe(1);
    expect(getCountB()).toBe(1);

    simulateMemberJoined('room-a', 'user-3');
    expect(getCountA()).toBe(2);
    expect(getCountB()).toBe(1);

    simulateMemberJoined('room-b', 'user-4');
    expect(getCountA()).toBe(2);
    expect(getCountB()).toBe(2);

    unmountA();
    unmountB();
  });

  it('resets count to 0 when the room is destroyed', async () => {
    const {getCount, unmount} = mountPresence({
      enabled: true,
      chatRoomId: 'room-1',
      chatUserId: 'user-1',
    });

    await act(async () => {
      await Promise.resolve();
    });
    simulateMemberJoined('room-1', 'user-2');
    expect(getCount()).toBe(2);

    simulateRoomDestroyed('room-1');
    expect(getCount()).toBe(0);

    unmount();
  });

  it('ignores events for a different room', async () => {
    const {getCount, unmount} = mountPresence({
      enabled: true,
      chatRoomId: 'room-1',
      chatUserId: 'user-1',
    });

    await act(async () => {
      await Promise.resolve();
    });
    expect(getCount()).toBe(1);

    simulateMemberJoined('room-other', 'user-2');
    expect(getCount()).toBe(1);

    simulateMemberExited('room-other', 'user-2');
    expect(getCount()).toBe(1);

    unmount();
  });

  it('reconciles with server member list on mount', async () => {
    const {getCount, unmount} = mountPresence({
      enabled: true,
      chatRoomId: 'room-1',
      chatUserId: 'user-1',
      memberList: ['server-user-1', 'server-user-2'],
    });

    await act(async () => {
      await Promise.resolve();
    });
    // server has 2 members + local user = 3
    expect(getCount()).toBe(3);
    unmount();
  });

  it('resets count when disabled', async () => {
    const {getCount, unmount} = mountPresence({
      enabled: true,
      chatRoomId: 'room-1',
      chatUserId: 'user-1',
    });

    await act(async () => {
      await Promise.resolve();
    });
    simulateMemberJoined('room-1', 'user-2');
    expect(getCount()).toBe(2);

    // Re-mount with enabled=false
    const {getCount: getCountDisabled} = mountPresence({
      enabled: false,
      chatRoomId: 'room-1',
      chatUserId: 'user-1',
    });
    expect(getCountDisabled()).toBe(0);

    unmount();
  });

  it('registers and removes room listeners', async () => {
    const {unmount} = mountPresence({
      enabled: true,
      chatRoomId: 'room-1',
      chatUserId: 'user-1',
    });

    await act(async () => {
      await Promise.resolve();
    });
    expect(mockAddRoomListener).toHaveBeenCalledTimes(1);
    unmount();
    expect(mockRemoveRoomListener).toHaveBeenCalledTimes(1);
  });
});
