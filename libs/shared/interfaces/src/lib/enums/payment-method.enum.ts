export enum PaymentMethod {
    // ==========================================
    // 1. VIRTUAL ACCOUNTS (Bank Transfer)
    // ==========================================
    BCA_VA = 'BCA_VA',
    MANDIRI_VA = 'MANDIRI_VA',
    BRIVA = 'BRIVA',
    BNI_VA = 'BNI_VA',
    PERMATA_VA = 'PERMATA_VA',
    CIMB_VA = 'CIMB_VA',
    BSI_VA = 'BSI_VA',
    BJB_VA = 'BJB_VA',
    SAHABAT_SAMPOERNA_VA = 'SAHABAT_SAMPOERNA_VA',

    // ==========================================
    // 2. E-WALLETS
    // ==========================================
    GOPAY = 'GOPAY',
    OVO = 'OVO',
    DANA = 'DANA',
    SHOPEEPAY = 'SHOPEEPAY',
    LINKAJA = 'LINKAJA',
    ASTRAPAY = 'ASTRAPAY',

    // ==========================================
    // 3. QR CODE
    // ==========================================
    QRIS = 'QRIS',

    // ==========================================
    // 4. RETAIL OUTLETS (Over-the-Counter)
    // ==========================================
    ALFAMART = 'ALFAMART',
    INDOMARET = 'INDOMARET',

    // ==========================================
    // 5. PAYLATER & INSTALLMENTS (Cicilan)
    // ==========================================
    AKULAKU = 'AKULAKU',
    KREDIVO = 'KREDIVO',
    UANGME = 'UANGME',
    INDODANA = 'INDODANA',
    ATOME = 'ATOME',

    // ==========================================
    // 6. CREDIT / DEBIT CARDS
    // ==========================================
    CREDIT_CARD = 'CREDIT_CARD',

    // ==========================================
    // 7. DIRECT DEBIT (Auto-Debit)
    // ==========================================
    BCA_KLIKPAY = 'BCA_KLIKPAY',
    OCTO_CLICKS = 'OCTO_CLICKS',
    BRIMO = 'BRIMO',
    JENIUS_PAY = 'JENIUS_PAY',
}
