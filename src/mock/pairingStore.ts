

// A simple global singleton store for demo purposes (Zustand-like behavior without full setup)
// In a real app, this would be a full Zustand store or context
class PairingDemoStore extends EventTarget {
  private _state = {
    isRequesting: false,
    requestExpiry: 0,
    activeChallengeId: "",
    activeChallengeSlug: "",
    activeChallengeTitle: "",
    incomingRequests: [] as any[],
    targetUser: null as any | null,
    mode: null as 'broadcast' | 'join' | null,
    hasPermission: false,
  };

  get state() {
    return this._state;
  }

  private setState(updates: Partial<typeof this._state>) {
    this._state = { ...this._state, ...updates };
    this.dispatchEvent(new Event('change'));
  }

  startBroadcast(id: string, slug: string, title: string) {
    this.setState({
      isRequesting: true,
      mode: 'broadcast',
      requestExpiry: Date.now() + 60 * 1000,
      activeChallengeId: id,
      activeChallengeSlug: slug,
      activeChallengeTitle: title,
      incomingRequests: [],
      targetUser: null,
    });

    // Mock incoming requests after delay
    setTimeout(() => {
        if (this._state.isRequesting && this._state.mode === 'broadcast') {
            const newRequests = [
                {
                    id: "1",
                    name: "Ricardo Ferreira",
                    username: "dev_rico",
                    avatarUrl: "https://i.pravatar.cc/150?u=dev_rico",
                    occupation: "CS Student",
                    country: "🇧🇷 Brazil",
                    xp: 2980,
                    languages: ["Portuguese", "English", "JavaScript"],
                }
            ];
            this.setState({ incomingRequests: newRequests });
        }
    }, 8 * 1000);

    setTimeout(() => {
        if (this._state.isRequesting && this._state.mode === 'broadcast') {
            const newRequests = [
                ...this._state.incomingRequests,
                {
                    id: "2",
                    name: "Yuki Tanaka",
                    username: "yuki_algo",
                    avatarUrl: "https://i.pravatar.cc/150?u=yuki_algo",
                    occupation: "Backend Engineer",
                    country: "🇯🇵 Japan",
                    xp: 4410,
                    languages: ["Japanese", "English", "C++"],
                }
            ];
            this.setState({ incomingRequests: newRequests });
        }
    }, 15 * 1000);
  }

  requestToJoin(id: string, slug: string, title: string, user: any) {
    this.setState({
      isRequesting: true,
      mode: 'join',
      requestExpiry: Date.now() + 60 * 1000,
      activeChallengeId: id,
      activeChallengeSlug: slug,
      activeChallengeTitle: title,
      targetUser: user,
      incomingRequests: [],
      hasPermission: false, // Reset permission on new request
    });

    // Automatically give permission after 12s mock delay.
    // Lives here in the store so it persists when navigating screens.
    setTimeout(() => {
        if (this._state.isRequesting && this._state.mode === 'join') {
            this.setPermission(true);
        }
    }, 12000);
  }

  setPermission(granted: boolean) {
    this.setState({ hasPermission: granted });
  }

  cancelRequest() {
    this.setState({
      isRequesting: false,
      requestExpiry: 0,
      mode: null,
      targetUser: null,
      incomingRequests: [],
      hasPermission: false, // Reset on cancel
    });
  }
}

export const pairingStore = new PairingDemoStore();

// Hook to subscribe to the store in components
import { useSyncExternalStore } from 'react';

export function usePairingStore() {
  return useSyncExternalStore(
    (callback) => {
      pairingStore.addEventListener('change', callback);
      return () => pairingStore.removeEventListener('change', callback);
    },
    () => pairingStore.state
  );
}
