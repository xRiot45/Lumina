export function autoGenerateOrderNumber(prefix = 'INV'): string {
    const now = new Date();
    const yyyy = now.getFullYear().toString();
    const mm = (now.getMonth() + 1).toString().padStart(2, '0');
    const dd = now.getDate().toString().padStart(2, '0');

    const dateString = `${yyyy}${mm}${dd}`;

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let randomStr = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        randomStr += chars.charAt(randomIndex);
    }

    return `${prefix}-${dateString}-${randomStr}`;
}
