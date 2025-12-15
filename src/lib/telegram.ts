export async function sendTelegramNotification(message: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        console.warn("Telegram Bot Token or Chat ID is missing. Skipping notification.");
        return;
    }

    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "HTML",
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to send Telegram notification:", errorData);
        } else {
            console.log("Telegram notification sent successfully.");
        }
    } catch (error) {
        console.error("Error sending Telegram notification:", error);
    }
}
