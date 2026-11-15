'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { GuestComment } from '@/types/invitation';
import { ClockMiniIcon, DoveIcon } from './icons';
import { Reveal } from './Reveal';

interface GuestbookSectionProps {
  initialComments: GuestComment[];
  defaultGuestName?: string;
}

const ITEMS_PER_PAGE = 5;

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diff) || diff < 60_000) return 'Baru saja';
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function GuestbookSection({
  initialComments,
  defaultGuestName = '',
}: GuestbookSectionProps) {
  const [comments, setComments] = useState<GuestComment[]>(initialComments);
  const [author, setAuthor] = useState(
    defaultGuestName && defaultGuestName !== 'Tamu Undangan' ? defaultGuestName : ''
  );
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // pick up messages other guests sent after this page was rendered
  useEffect(() => {
    let cancelled = false;
    fetch('/api/comments', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && Array.isArray(data.comments)) setComments(data.comments);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  // the ?to= name arrives after first render
  useEffect(() => {
    if (defaultGuestName && defaultGuestName !== 'Tamu Undangan') {
      setAuthor((prev) => prev || defaultGuestName);
    }
  }, [defaultGuestName]);

  const totalPages = Math.max(1, Math.ceil(comments.length / ITEMS_PER_PAGE));

  const visibleComments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return comments.slice(start, start + ITEMS_PER_PAGE);
  }, [comments, currentPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedAuthor = author.trim();
    const trimmedMessage = message.trim();

    if (!trimmedAuthor) {
      setErrorMsg('Nama wajib diisi.');
      return;
    }
    if (trimmedMessage.length < 2) {
      setErrorMsg('Ucapan minimal 2 karakter.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: trimmedAuthor, message: trimmedMessage }),
      });

      const data = await res.json();
      if (!res.ok || !data.comment) {
        setErrorMsg(data.error || 'Gagal mengirim ucapan.');
      } else {
        setComments((prev) => [data.comment, ...prev]);
        setMessage('');
        setCurrentPage(1);
        setSuccessMsg('Terima kasih! Ucapan Anda sudah terkirim.');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section data-id="guestbook" className="w-full bg-[#FFF8ED] py-[36px] md:py-[48px] my-[20px]">
      {/* Header */}
      <div className="max-w-[640px] mx-auto px-[20px] text-center mb-[22px]">
        <Reveal variant="fadeInUp" className="flex justify-center mb-[10px]">
          <img
            src="/images/divider-gold.svg"
            alt=""
            aria-hidden="true"
            className="w-[110px] h-auto mx-auto"
          />
        </Reveal>
        <Reveal variant="fadeInUp">
          <h2 className="font-dynalight text-[38px] md:text-[45px] leading-[1.2] font-normal text-[#A59071]">
            Buku Tamu
          </h2>
          <p className="mt-1 font-poppins text-[13px] text-[#8b8271]">
            Tinggalkan ucapan dan doa untuk kami
          </p>
        </Reveal>
      </div>

      <div className="max-w-[640px] mx-auto px-[16px] md:px-[20px]">
        <div className="bg-white border border-[#EADFC8] rounded-[18px] text-[14px] text-[#625B4F] overflow-hidden shadow-[0_16px_40px_-28px_rgba(98,74,30,0.55)]">
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-[18px] md:p-[22px] space-y-[12px]" noValidate>
            <input
              type="text"
              name="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Nama"
              maxLength={80}
              aria-label="Nama"
              className="w-full bg-[#FFFCF6] border border-[#E6DCC6] rounded-[12px] px-[14px] py-[11px] text-[14px] text-[#4f483d] placeholder:text-[#ACA89F] focus:outline-none focus:border-[#A48C4D]"
            />

            <div>
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                placeholder="Tulis ucapan dan doa"
                rows={4}
                maxLength={500}
                aria-label="Ucapan"
                className="w-full bg-[#FFFCF6] border border-[#E6DCC6] rounded-[12px] px-[14px] py-[11px] text-[14px] text-[#4f483d] placeholder:text-[#ACA89F] focus:outline-none focus:border-[#A48C4D] resize-y"
              />
              {message.length > 0 && (
                <div className="text-right text-[11px] text-[#989692] mt-[2px]">
                  {500 - message.length} karakter tersisa
                </div>
              )}
            </div>

            {errorMsg && (
              <p role="alert" className="text-[12px] text-[#B94A48] font-medium">
                {errorMsg}
              </p>
            )}
            {successMsg && (
              <p role="status" className="text-[12px] text-[#4E7A45] font-medium">
                {successMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-[#B8924A] to-[#A48C4D] hover:brightness-105 disabled:opacity-60 text-white font-semibold text-[14px] px-[16px] py-[12px] rounded-full cursor-pointer transition-all"
            >
              {submitting ? 'Mengirim...' : 'Kirim Ucapan'}
            </button>
          </form>

          {/* Count */}
          <div className="border-t border-[#EFE6D2] px-[18px] md:px-[22px] py-[10px] flex items-center gap-[6px] text-[#7B6945] font-semibold text-[13px]">
            <DoveIcon className="w-[14px] h-[14px]" />
            <span>{comments.length} Ucapan</span>
          </div>

          {/* Comments List */}
          {comments.length === 0 ? (
            <p className="border-t border-[#EFE6D2] px-[18px] py-[26px] text-center font-poppins text-[13px] text-[#989692]">
              Belum ada ucapan. Jadilah yang pertama.
            </p>
          ) : (
            <ul className="border-t border-[#EFE6D2] divide-y divide-[#EFE6D2]">
              {visibleComments.map((item) => (
                <li key={item.id} className="px-[18px] md:px-[22px] py-[14px] flex items-start gap-[12px]">
                  <div
                    aria-hidden="true"
                    className="w-[34px] h-[34px] rounded-full bg-[#C4A466] text-white flex items-center justify-center shrink-0 font-lora text-[15px] font-semibold uppercase select-none"
                  >
                    {item.author.trim().charAt(0) || '?'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-[14px] text-[#7B6945] break-words">{item.author}</span>

                    <div className="flex items-center gap-[4px] text-[11px] text-[#989692] mt-[1px]">
                      <ClockMiniIcon className="w-[10px] h-[10px] shrink-0" />
                      <span suppressHydrationWarning>{timeAgo(item.date)}</span>
                    </div>

                    <p className="mt-[6px] text-[13.5px] leading-[1.6] text-[#625B4F] whitespace-pre-line break-words">
                      {item.message}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="Navigasi halaman ucapan"
              className="border-t border-[#EFE6D2] px-[15px] py-[12px] flex items-center justify-center gap-[16px] text-[13px]"
            >
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="text-[#7B6945] font-semibold disabled:text-[#C9C3B6] cursor-pointer disabled:cursor-default"
              >
                &larr; Sebelumnya
              </button>
              <span className="text-[#989692] tabular-nums">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="text-[#7B6945] font-semibold disabled:text-[#C9C3B6] cursor-pointer disabled:cursor-default"
              >
                Berikutnya &rarr;
              </button>
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}
