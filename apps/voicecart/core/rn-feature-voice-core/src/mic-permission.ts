import { useCallback, useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';
import {
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
} from 'expo-audio';

export type MicPermissionStatus = 'undetermined' | 'granted' | 'denied';

type RecordingPermissionResult = {
  granted: boolean;
  status: string;
};

export function mapRecordingPermission(
  result: RecordingPermissionResult
): MicPermissionStatus {
  if (result.granted || result.status === 'granted') {
    return 'granted';
  }
  if (result.status === 'undetermined') {
    return 'undetermined';
  }
  return 'denied';
}

export function micPermissionLabel(status: MicPermissionStatus): string {
  switch (status) {
    case 'granted':
      return 'Mic allowed';
    case 'denied':
      return 'Mic needed';
    case 'undetermined':
      return 'Checking microphone…';
  }
}

export function useMicPermission() {
  const [status, setStatus] = useState<MicPermissionStatus>('undetermined');
  const [isRequesting, setIsRequesting] = useState(false);

  const refresh = useCallback(async () => {
    if (Platform.OS === 'web') {
      setStatus('granted');
      return;
    }

    try {
      const current = await getRecordingPermissionsAsync();
      setStatus(mapRecordingPermission(current));
    } catch {
      setStatus('denied');
    }
  }, []);

  const request = useCallback(async () => {
    if (Platform.OS === 'web') {
      setStatus('granted');
      return;
    }

    setIsRequesting(true);
    try {
      const result = await requestRecordingPermissionsAsync();
      setStatus(mapRecordingPermission(result));
    } catch {
      setStatus('denied');
    } finally {
      setIsRequesting(false);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setStatus('granted');
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        const current = await getRecordingPermissionsAsync();
        if (cancelled) {
          return;
        }
        if (current.granted) {
          setStatus('granted');
          return;
        }
        setIsRequesting(true);
        const result = await requestRecordingPermissionsAsync();
        if (!cancelled) {
          setStatus(mapRecordingPermission(result));
        }
      } catch {
        if (!cancelled) {
          setStatus('denied');
        }
      } finally {
        if (!cancelled) {
          setIsRequesting(false);
        }
      }
    };

    void run();

    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') {
        void refresh();
      }
    });

    return () => {
      cancelled = true;
      sub.remove();
    };
  }, [refresh]);

  return { status, isRequesting, request };
}
