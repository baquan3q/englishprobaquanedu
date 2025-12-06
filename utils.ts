
// --- CẤU HÌNH ÂM THANH TÙY CHỈNH (CUSTOM SOUNDS) ---
// Bạn hãy dán đường link file âm thanh (mp3/wav) của bạn vào giữa dấu ngoặc kép "".
// Nếu để trống (""), hệ thống sẽ dùng âm thanh điện tử mặc định.

const CUSTOM_SOUND_URLS: Partial<Record<string, string>> = {
  correct: "",   // Âm thanh khi trả lời ĐÚNG (chung)
  wrong: "",     // Âm thanh khi trả lời SAI (chung)
  win: "",       // Âm thanh chiến thắng lớn (như khi thắng Đào Vàng)
  tingting: "",  // Âm thanh "Tinh tinh" (dùng trong bài Điền từ)
  haha: "",      // Âm thanh cười "Haha" (dùng trong bài Điền từ)
  pop: "",       // Âm thanh nổ bong bóng
  shoot: "",     // Âm thanh bắn dây câu
  click: "",     // Âm thanh click chuột
};

export const playSound = (type: 'correct' | 'wrong' | 'click' | 'win' | 'shoot' | 'hit' | 'pop' | 'gameover' | 'spin' | 'tingting' | 'haha') => {
  // 1. Ưu tiên phát âm thanh từ file (nếu người dùng đã cài đặt link)
  if (CUSTOM_SOUND_URLS[type]) {
    const audio = new Audio(CUSTOM_SOUND_URLS[type]);
    audio.volume = 1.0;
    audio.play().catch(err => {
      console.warn(`Không thể phát file âm thanh custom [${type}]:`, err);
    });
    return; // Đã phát xong, thoát hàm để không phát âm thanh mặc định chồng lên
  }

  // 2. Nếu không có file custom, dùng bộ tổng hợp âm thanh (Web Audio API) mặc định
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;

  switch (type) {
    case 'correct': // Tiếng 'Ting' thanh thoát
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
      break;
    
    case 'wrong': // Tiếng 'Buzz' trầm báo sai
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.4);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
      break;

    case 'shoot': // Tiếng bắn dây móc
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;

    case 'hit': // Tiếng va chạm khi trúng vàng
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;

    case 'win': // Tiếng chiến thắng dài
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.setValueAtTime(1000, now + 0.1);
      osc.frequency.setValueAtTime(1500, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.8);
      osc.start(now);
      osc.stop(now + 0.8);
      break;

    case 'click': // Tiếng click nhẹ
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;

    case 'pop': // Tiếng nổ bong bóng
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;

    case 'gameover': // Tiếng game over
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(50, now + 1.5);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0, now + 1.5);
      osc.start(now);
      osc.stop(now + 1.5);
      break;

    case 'spin': // Tiếng quay (rapid clicking texture)
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      break;

    case 'tingting': // Tiếng tinh tinh (High pitch sequence)
      osc.type = 'sine';
      // Note 1
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      // Note 2
      osc.frequency.setValueAtTime(1800, now + 0.2);
      gain.gain.setValueAtTime(0.2, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      
      osc.start(now);
      osc.stop(now + 0.6);
      break;

    case 'haha': // Giả lập tiếng cười trêu chọc (Rhythmic descending tone)
      osc.type = 'triangle';
      
      // Ha 1
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(400, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.15);

      // Ha 2
      osc.frequency.setValueAtTime(600, now + 0.2);
      osc.frequency.linearRampToValueAtTime(400, now + 0.35);
      gain.gain.setValueAtTime(0.3, now + 0.2);
      gain.gain.linearRampToValueAtTime(0, now + 0.35);

      // Ha 3
      osc.frequency.setValueAtTime(600, now + 0.4);
      osc.frequency.linearRampToValueAtTime(400, now + 0.55);
      gain.gain.setValueAtTime(0.3, now + 0.4);
      gain.gain.linearRampToValueAtTime(0, now + 0.55);

      osc.start(now);
      osc.stop(now + 0.6);
      break;
  }
};
