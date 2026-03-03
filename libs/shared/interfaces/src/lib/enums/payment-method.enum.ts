export enum PaymentMethod {
    // 1. VIRTUAL ACCOUNTS (Bank Transfer)
    BCA_VA = 'BCA_VA',
    MANDIRI_VA = 'MANDIRI_VA',
    BRIVA = 'BRIVA',
    BNI_VA = 'BNI_VA',
    BJB_VA = 'BJB_VA',
    BNC_VA = 'BNC_VA',
    BSI_VA = 'BSI_VA',
    BSS_VA = 'BSS_VA',
    CIMB_VA = 'CIMB_VA',
    MUAMALAT_VA = 'MUAMALAT_VA',
    PERMATA_VA = 'PERMATA_VA',

    // 2. CREDIT / DEBIT CARDS
    CREDIT_CARD = 'CREDIT_CARD',

    // 3. E-WALLETS
    DANA = 'DANA',
    OVO = 'OVO',
    GOPAY = 'GOPAY',
    SHOPEEPAY = 'SHOPEEPAY',
    ASTRAPAY = 'ASTRAPAY',
    JENIUSPAY = 'JENIUSPAY',
    LINKAJA = 'LINKAJA',
    NEXCASH = 'NEXCASH',

    // 4. RETAIL OUTLETS (Over-the-Counter)
    ALFAMART = 'ALFAMART',
    INDOMARET = 'INDOMARET',

    // 5. QR CODE
    QRIS = 'QRIS',
}
