/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Volume2, VolumeX, Sparkles, Send, Copy, Check, RotateCcw } from 'lucide-react';
import { sounds } from './utils/sound.ts';

const MY_PHONE_NUMBER = "917876329559";
const WHATSAPP_MESSAGE = "Yes! ❤️ Let's make it official!";

// Floating items in the background
const FLOATING_ITEMS = [
  { symbol: '🤍', left: '8%', size: '20px', duration: '7.5s', delay: '0s' },
  { symbol: '✨', left: '22%', size: '24px', duration: '9.5s', delay: '1.2s' },
  { symbol: '💖', left: '42%', size: '22px', duration: '8.2s', delay: '2.5s' },
  { symbol: '🌹', left: '62%', size: '26px', duration: '10.5s', delay: '0.8s' },
  { symbol: '🌸', left: '78%', size: '24px', duration: '8.8s', delay: '1.8s' },
  { symbol: '💫', left: '90%', size: '19px', duration: '7.0s', delay: '3.1s' },
  { symbol: '💕', left: '32%', size: '21px', duration: '11.0s', delay: '4.0s' },
  { symbol: '✨', left: '52%', size: '23px', duration: '9.0s', delay: '0.4s' },
];

const NO_MESSAGES = [
  "Aise kaise No Nandini ji? You have to click on YES! 😊",
  "Nandini pleaseeee! 'No' button is officially disabled for today 🙈",
  "Are you really sure? Dil toot jayega mera 💔",
  "Look how cute the YES button is looking! Try clicking it 🥺👉👈",
  "Ek baar YES bolke dekho na, sweetest smile aa jayegi! ❤️",
  "Error 404: 'No' does not exist in our story ✨"
];

export default function App() {
  const [screen, setScreen] = useState<'screen-1' | 'screen-2' | 'screen-celebration'>('screen-1');
  const [noCount, setNoCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [noButtonOffset, setNoButtonOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [screen1NoMsg, setScreen1NoMsg] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [clickHearts, setClickHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const heartIdRef = useRef(0);

  // Toggle sound
  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.setMuted(nextMuted);
    if (!nextMuted) {
      sounds.playSparkle();
    }
  };

  // Sparkle burst on screen click
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'button' || target.closest('button')) {
      return;
    }
    sounds.playSparkle();
    const id = ++heartIdRef.current;
    const newHeart = { id, x: e.clientX, y: e.clientY };
    setClickHearts((prev) => [...prev.slice(-10), newHeart]);
    setTimeout(() => {
      setClickHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1000);
  };

  // Screen 1 transitions
  const goToScreen2 = () => {
    sounds.playSparkle();
    setScreen1NoMsg('');
    setScreen('screen-2');
  };

  const handleNo1 = () => {
    sounds.playNoDodge();
    const teasingQuotes = [
      "Wait, are you sure? Double check your feelings! 🥺",
      "Wrong button Nandini ji! Try the red one 🥰",
      "Aise bina soche No nahi bolte! ✨",
      "Are you really not excited?! Sach batao! 😉"
    ];
    const nextMsg = teasingQuotes[Math.floor(Math.random() * teasingQuotes.length)];
    setScreen1NoMsg(nextMsg);
  };

  // Screen 2 transitions
  const handleNo2 = () => {
    sounds.playNoDodge();
    const nextCount = noCount + 1;
    setNoCount(nextCount);
    const msg = NO_MESSAGES[Math.min(nextCount - 1, NO_MESSAGES.length - 1)];
    setErrorMessage(msg);

    // Playfully dodge the button after 2 attempts
    if (nextCount >= 2) {
      const randomX = (Math.random() - 0.5) * 160;
      const randomY = (Math.random() - 0.5) * 80;
      setNoButtonOffset({ x: randomX, y: randomY });
    }
  };

  const handleNo2Hover = () => {
    if (noCount >= 2) {
      sounds.playNoDodge();
      const randomX = (Math.random() - 0.5) * 180;
      const randomY = (Math.random() - 0.5) * 90;
      setNoButtonOffset({ x: randomX, y: randomY });
    }
  };

  const fireGrandCelebration = () => {
    sounds.playYesCelebration();

    // Trigger canvas confetti fireworks
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ff4757', '#ff6b81', '#fed330', '#ff9ff3', '#ffffff']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ff4757', '#ff6b81', '#fed330', '#ff9ff3', '#ffffff']
      });
    }, 250);

    setScreen('screen-celebration');
  };

  const sendWhatsApp = () => {
    const message = encodeURIComponent(WHATSAPP_MESSAGE);
    const url = `https://api.whatsapp.com/send?phone=${MY_PHONE_NUMBER}&text=${message}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleInitialYes = () => {
    fireGrandCelebration();
  };

  const copyProposalMessage = async () => {
    try {
      await navigator.clipboard.writeText(WHATSAPP_MESSAGE);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // Fallback
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const resetSurprise = () => {
    sounds.playSparkle();
    setScreen('screen-1');
    setNoCount(0);
    setErrorMessage('');
    setScreen1NoMsg('');
    setNoButtonOffset({ x: 0, y: 0 });
  };

  // Helper for random range
  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  // Calculate dynamic scale for Yes button as she attempts No
  const yesButtonScale = Math.min(1 + noCount * 0.08, 1.35);

  return (
    <div
      onClick={handleContainerClick}
      className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4 py-8 select-none"
      style={{
        background: 'radial-gradient(circle at top, #ffeef2 0%, #fed5df 50%, #fbbecd 100%)',
      }}
    >
      {/* Floating Background Elements */}
      {FLOATING_ITEMS.map((item, idx) => (
        <div
          key={idx}
          className="absolute pointer-events-none select-none text-rose-400/40"
          style={{
            left: item.left,
            bottom: '-10vh',
            fontSize: item.size,
            animation: `floatUp ${item.duration} infinite linear`,
            animationDelay: item.delay,
            zIndex: 1,
          }}
        >
          {item.symbol}
        </div>
      ))}

      {/* Floating Sparkle/Heart effects on click */}
      {clickHearts.map((heart) => (
        <span
          key={heart.id}
          className="fixed pointer-events-none text-rose-500 font-bold transition-transform duration-700 ease-out"
          style={{
            left: heart.x - 12,
            top: heart.y - 12,
            transform: 'translateY(-30px) scale(1.4)',
            opacity: 0.9,
            zIndex: 50,
          }}
        >
          💖
        </span>
      ))}

      {/* Top Floating Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={toggleSound}
          type="button"
          aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          className="p-2.5 rounded-full bg-white/70 hover:bg-white text-rose-600 shadow-sm border border-rose-100 backdrop-blur-md transition-all active:scale-95"
          title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-[390px] mx-auto flex flex-col items-center">
        {/* SCREEN 1: Excitement Check */}
        {screen === 'screen-1' && (
          <div
            className="w-full bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-[0_16px_36px_rgba(224,86,122,0.18)] border border-white/80 text-center transition-all duration-300"
            style={{ animation: 'popIn 0.4s ease-out' }}
          >
            <div className="text-4xl mb-3 inline-block animate-soft-bounce">💌</div>
            <h1 className="text-slate-900 text-[22px] font-bold mb-2 tracking-tight">
              Are you excited to know? ✨
            </h1>
            <p className="text-slate-500 text-sm mb-6 font-normal">
              A small question just for you...
            </p>

            <div className="flex justify-center items-center gap-4">
              <button
                type="button"
                onClick={goToScreen2}
                className="px-7 py-3 text-[15px] font-semibold text-white bg-[#ff4757] rounded-full shadow-[0_6px_18px_rgba(255,71,87,0.35)] animate-pulse-glow hover:bg-[#ff3848] active:scale-95 transition-all cursor-pointer"
              >
                Yes 🥰
              </button>
              <button
                type="button"
                onClick={handleNo1}
                className="px-7 py-3 text-[15px] font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-full active:scale-95 transition-all cursor-pointer"
              >
                No
              </button>
            </div>

            {screen1NoMsg && (
              <div
                className="mt-4 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200/60 py-2 px-3 rounded-xl animate-wiggle"
              >
                {screen1NoMsg}
              </div>
            )}
          </div>
        )}

        {/* SCREEN 2: Proposal Message */}
        {screen === 'screen-2' && (
          <div
            className="w-full bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-[0_16px_36px_rgba(224,86,122,0.18)] border border-white/80 text-center transition-all duration-300 relative"
            style={{ animation: 'popIn 0.4s ease-out' }}
          >
            <div className="text-4xl mb-3 inline-block animate-soft-bounce">🌹</div>
            <h2 className="text-slate-900 text-[22px] font-bold mb-3 tracking-tight flex items-center justify-center gap-1.5">
              <span>For Nandini</span>
              <span className="text-rose-500">❤️</span>
            </h2>

            <div className="text-slate-700 text-[15px] leading-relaxed mb-6 font-normal text-center space-y-3">
              <p>
                Iss pure mahine mein ek cheez jo sabse achi hui, wo thi aapse milna aur aapko jaan pana. 
                Aapke bina ab din thoda adhoora sa lagta hai.
              </p>
              <p className="font-medium text-slate-800">
                I really, really like you Nandini.
              </p>
              <p className="text-[15.5px] text-[#e91e63] font-bold pt-1">
                Can I call you mine officially now?
              </p>
            </div>

            <div className="flex justify-center items-center gap-4 relative min-h-[56px]">
              <button
                type="button"
                onClick={handleInitialYes}
                style={{
                  transform: `scale(${yesButtonScale})`,
                  transition: 'transform 0.25s ease, background-color 0.2s ease',
                }}
                className="px-7 py-3 text-[15px] font-semibold text-white bg-[#ff4757] rounded-full shadow-[0_6px_20px_rgba(255,71,87,0.4)] animate-pulse-glow hover:bg-[#ff3848] active:scale-95 cursor-pointer whitespace-nowrap z-10"
              >
                Yes! 💍
              </button>

              <button
                type="button"
                onClick={handleNo2}
                onMouseEnter={handleNo2Hover}
                style={{
                  transform: `translate(${noButtonOffset.x}px, ${noButtonOffset.y}px)`,
                  transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
                className="px-7 py-3 text-[15px] font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-full active:scale-95 cursor-pointer whitespace-nowrap"
              >
                No
              </button>
            </div>

            {errorMessage && (
              <div
                className="mt-4 text-[13.5px] font-semibold text-[#d63031] bg-[#fff0f3] border border-rose-200 py-2.5 px-3.5 rounded-xl animate-wiggle leading-snug"
              >
                {errorMessage}
              </div>
            )}
          </div>
        )}

        {/* SCREEN 3: Celebration & Official WhatsApp Notification */}
        {screen === 'screen-celebration' && (
          <div
            className="w-full bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-[0_20px_45px_rgba(224,86,122,0.25)] border border-white/80 text-center transition-all duration-300"
            style={{ animation: 'popIn 0.4s ease-out' }}
          >
            <div className="w-16 h-16 mx-auto mb-3 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 shadow-inner">
              <Sparkles className="w-8 h-8 text-rose-500 animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            <h2 className="text-slate-900 text-2xl font-extrabold mb-1 tracking-tight">
              She Said YES! 💍🎉
            </h2>
            <p className="text-rose-600 font-semibold text-sm mb-4">
              Officially Nandini & You ❤️
            </p>

            {/* Sweet Polaroid Note */}
            <div className="bg-gradient-to-b from-rose-50/80 to-pink-50/40 p-4 rounded-2xl border border-rose-100/80 mb-6 text-left shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span className="text-xs uppercase tracking-wider font-bold text-rose-500">
                  Confirmed Proposal Reply
                </span>
              </div>
              <p className="text-slate-800 text-sm font-medium italic">
                &ldquo;{WHATSAPP_MESSAGE}&rdquo;
              </p>
              <div className="mt-3 pt-2 border-t border-rose-200/50 flex items-center justify-between text-[11px] text-slate-500">
                <span>To: +{MY_PHONE_NUMBER}</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  Ready to send ✨
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={sendWhatsApp}
                className="w-full py-3.5 px-4 text-[15px] font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-2xl shadow-[0_6px_20px_rgba(37,211,102,0.35)] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send &quot;Yes!&quot; on WhatsApp</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyProposalMessage}
                  className="flex-1 py-2.5 px-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Message</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetSurprise}
                  className="py-2.5 px-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  title="Replay from beginning"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Replay</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-5">
              Made with pure love for Nandini ✨
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
