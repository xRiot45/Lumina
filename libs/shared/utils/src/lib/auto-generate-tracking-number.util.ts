export function autoGenerateTrackingNumber(prefix = 'TRK'): string {
    const now = Date.now().toString();
    const timeSnippet = now.slice(-6);

    let randomDigits = '';
    for (let i = 0; i < 6; i++) {
        randomDigits += Math.floor(Math.random() * 10).toString();
    }

    return `${prefix}${timeSnippet}${randomDigits}`;
}
