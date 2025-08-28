import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface DailyStats {
  date: string;
  hours: number;
  minutes: number;
  totalMinutes: number;
}

interface WeeklyStats {
  monday: DailyStats;
  tuesday: DailyStats;
  wednesday: DailyStats;
  thursday: DailyStats;
  friday: DailyStats;
  saturday: DailyStats;
  sunday: DailyStats;
}

interface StatsStore {
  // State
  dailyStats: DailyStats[];
  weeklyStats: WeeklyStats | null;
  todayTotal: number; // in minutes
  isLoading: boolean;
  error: string | null;
  
  // Actions
  recordStudySession: (durationInSeconds: number) => Promise<void>;
  fetchDailyStats: (userId: string) => Promise<void>;
  fetchWeeklyStats: (userId: string) => Promise<void>;
  getTodayStats: () => DailyStats;
  clearError: () => void;
}

export const useStatsStore = create<StatsStore>((set, get) => ({
  // Initial state
  dailyStats: [],
  weeklyStats: null,
  todayTotal: 0,
  isLoading: false,
  error: null,

  // Record a study session
  recordStudySession: async (durationInSeconds: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be logged in to record sessions');
      }

      const { error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: user.id,
          duration: durationInSeconds,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update today's total
      const durationInMinutes = Math.floor(durationInSeconds / 60);
      set((state) => ({
        todayTotal: state.todayTotal + durationInMinutes
      }));

      // Refresh daily stats
      await get().fetchDailyStats(user.id);
      
    } catch (error) {
      console.error('Error recording study session:', error);
      set({ error: (error as Error).message });
    }
  },

  // Fetch daily stats for the last 7 days
  fetchDailyStats: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 6); // Last 7 days

      const { data, error } = await supabase
        .from('user_sessions')
        .select('duration, completed_at')
        .eq('user_id', userId)
        .gte('completed_at', startDate.toISOString())
        .lte('completed_at', endDate.toISOString())
        .order('completed_at', { ascending: true });

      if (error) throw error;

      // Group sessions by date
      const dailyTotals: { [key: string]: number } = {};
      
      data.forEach((session) => {
        const date = new Date(session.completed_at).toDateString();
        dailyTotals[date] = (dailyTotals[date] || 0) + session.duration;
      });

      // Create daily stats array for last 7 days
      const dailyStats: DailyStats[] = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateString = date.toDateString();
        const totalMinutes = Math.floor((dailyTotals[dateString] || 0) / 60);
        
        dailyStats.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          hours: Math.floor(totalMinutes / 60),
          minutes: totalMinutes % 60,
          totalMinutes: totalMinutes
        });
      }

      // Calculate today's total
      const todayString = today.toDateString();
      const todayTotal = Math.floor((dailyTotals[todayString] || 0) / 60);

      set({ 
        dailyStats, 
        todayTotal,
        isLoading: false 
      });

    } catch (error) {
      console.error('Error fetching daily stats:', error);
      set({ 
        error: (error as Error).message,
        isLoading: false 
      });
    }
  },

  // Fetch weekly stats
  fetchWeeklyStats: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 6); // Current week (last 7 days)

      const { data, error } = await supabase
        .from('user_sessions')
        .select('duration, completed_at')
        .eq('user_id', userId)
        .gte('completed_at', startDate.toISOString())
        .lte('completed_at', endDate.toISOString())
        .order('completed_at', { ascending: true });

      if (error) throw error;

      // Initialize weekly stats
      const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const weeklyTotals: { [key: string]: number } = {};

      data.forEach((session) => {
        const date = new Date(session.completed_at);
        const dayOfWeek = weekDays[date.getDay()];
        weeklyTotals[dayOfWeek] = (weeklyTotals[dayOfWeek] || 0) + session.duration;
      });

      const createDayStats = (dayName: string): DailyStats => {
        const totalMinutes = Math.floor((weeklyTotals[dayName] || 0) / 60);
        return {
          date: dayName,
          hours: Math.floor(totalMinutes / 60),
          minutes: totalMinutes % 60,
          totalMinutes: totalMinutes
        };
      };

      const weeklyStats: WeeklyStats = {
        monday: createDayStats('monday'),
        tuesday: createDayStats('tuesday'),
        wednesday: createDayStats('wednesday'),
        thursday: createDayStats('thursday'),
        friday: createDayStats('friday'),
        saturday: createDayStats('saturday'),
        sunday: createDayStats('sunday'),
      };

      set({ 
        weeklyStats,
        isLoading: false 
      });

    } catch (error) {
      console.error('Error fetching weekly stats:', error);
      set({ 
        error: (error as Error).message,
        isLoading: false 
      });
    }
  },

  // Get today's stats
  getTodayStats: () => {
    const { dailyStats } = get();
    const today = dailyStats[dailyStats.length - 1];
    return today || { date: 'Today', hours: 0, minutes: 0, totalMinutes: 0 };
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
