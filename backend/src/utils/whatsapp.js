// Utiliti Bina Pautan WhatsApp Auto Mesej
export function generateWhatsAppLink(phone, message) {
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '60' + cleanPhone.slice(1);
  }
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}

export const WhatsAppTemplates = {
  orderConfirmation: (customerName, orderNum, total, deposit, balance) => {
    return `Halo Kak ${customerName}! 💕\n\n` +
      `Terima kasih kerana menempah dengan *EIQUEKIES*! 🧁\n\n` +
      `📌 *No. Tempahan:* ${orderNum}\n` +
      `💰 *Jumlah:* RM ${total.toFixed(2)}\n` +
      `💳 *Deposit:* RM ${deposit.toFixed(2)}\n` +
      `⚠️ *Baki Bayaran:* RM ${balance.toFixed(2)}\n\n` +
      `Tempahan anda telah disahkan dan sedang diproses dengan penuh kasih sayang! ✨`;
  },

  pickupReminder: (customerName, orderNum, pickupTime) => {
    return `Halo Kak ${customerName}! 🎂\n\n` +
      `Peringatan mesra dari *EIQUEKIES*!\n` +
      `Tempahan #${orderNum} anda sudah sedia untuk diambil pada:\n` +
      `⏰ *Tarikh/Masa:* ${pickupTime}\n\n` +
      `Jumpa anda nanti! 🥰`;
  },

  balanceReminder: (customerName, orderNum, balance) => {
    return `Halo Kak ${customerName}! 🌸\n\n` +
      `Peringatan mesra dari *EIQUEKIES*.\n` +
      `Baki bayaran untuk tempahan #${orderNum} adalah sebanyak *RM ${balance.toFixed(2)}*.\n\n` +
      `Sila buat pembayaran sebelum waktu pickup/penghantaran ya. Terima kasih! ❤️`;
  }
};
