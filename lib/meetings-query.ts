"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createMeeting,
  getAllMeetings,
  getMeetingById,
  stopMeeting,
} from "./meetings-storage";

export const meetingsQueryKey = ["meetings"] as const;

export function meetingQueryKey(meetingId: string) {
  return ["meeting", meetingId] as const;
}

export function useMeetingsQuery() {
  return useQuery({
    queryKey: meetingsQueryKey,
    queryFn: async () => getAllMeetings(),
  });
}

export function useMeetingQuery(meetingId: string) {
  return useQuery({
    queryKey: meetingQueryKey(meetingId),
    queryFn: async () => getMeetingById(meetingId),
    enabled: Boolean(meetingId),
  });
}

export function useCreateMeetingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => createMeeting(),
    onSuccess: (meeting) => {
      queryClient.setQueryData(meetingQueryKey(meeting.id), meeting);
      queryClient.invalidateQueries({ queryKey: meetingsQueryKey });
    },
  });
}

export function useStopMeetingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meetingId: string) => stopMeeting(meetingId),
    onSuccess: (meeting) => {
      if (!meeting) {
        return;
      }

      queryClient.setQueryData(meetingQueryKey(meeting.id), meeting);
      queryClient.invalidateQueries({ queryKey: meetingsQueryKey });
    },
  });
}
