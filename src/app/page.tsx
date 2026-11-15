import React from 'react';
import { listComments } from '@/lib/commentStore';
import { invitationData } from '@/data/invitationData';
import { GuestComment } from '@/types/invitation';
import { InvitationClient } from '@/components/InvitationClient';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function pickParam(val: string | string[] | undefined): string {
  if (Array.isArray(val)) return val[0] || '';
  return val || '';
}

async function loadInitialComments(): Promise<GuestComment[]> {
  try {
    return await listComments();
  } catch {
    return [];
  }
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawRecipient =
    pickParam(params.to) || pickParam(params.dear) || pickParam(params.kepada);
  const initialGuestName = rawRecipient
    ? rawRecipient.replace(/\+/g, ' ').replace(/\\(['"\\])/g, '$1').trim()
    : 'Tamu Undangan';

  const initialComments = await loadInitialComments();

  return (
    <InvitationClient
      data={invitationData}
      initialGuestName={initialGuestName}
      initialComments={initialComments}
    />
  );
}
