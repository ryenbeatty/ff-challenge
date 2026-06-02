"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import type { Meeting } from "./types";

import {
  createMeeting,
  getAllMeetings,
  getMeetingById,
  stopMeeting,
} from "./storage";
import type { CreateMeetingInput } from "./types";

export const meetingsQueryKey = ["meetings"] as const;

export function meetingQueryKey(meetingId: string) {
  return ["meeting", meetingId] as const;
}

export function syncMeetingInCache(queryClient: QueryClient, meeting: Meeting) {
  queryClient.setQueryData(meetingQueryKey(meeting.id), meeting);
  queryClient.invalidateQueries({ queryKey: meetingsQueryKey });
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
    mutationFn: async (input: CreateMeetingInput = {}) => createMeeting(input),
    onSuccess: (meeting) => {
      syncMeetingInCache(queryClient, meeting);
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

      syncMeetingInCache(queryClient, meeting);
    },
  });
}
