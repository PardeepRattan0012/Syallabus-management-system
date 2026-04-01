import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('cds_user')) || null,

    setUser: (user) => {
        if (user) {
            localStorage.setItem('cds_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('cds_user');
        }
        set({ user });
    },

    updateProgress: (progress) => {
        set((state) => {
            if (!state.user) return state;
            const updatedUser = { ...state.user, progress };
            localStorage.setItem('cds_user', JSON.stringify(updatedUser));
            return { user: updatedUser };
        });
    },

    logout: () => {
        localStorage.removeItem('cds_user');
        set({ user: null });
    }
}));