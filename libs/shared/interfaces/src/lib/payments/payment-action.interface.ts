// 1. Aksi untuk Virtual Account (BCA, Mandiri, dll)
export interface IVirtualAccountActionInfo {
    accountNumber: string; // Contoh: "390112345678"
    bankCode: string; // Contoh: "BCA"
    expirationDate: string; // Kapan VA ini hangus (ISO-8601 Date String)
}

// 2. Aksi untuk E-Wallet (GoPay, OVO, ShopeePay)
export interface IEWalletActionInfo {
    checkoutUrl?: string; // URL halaman web untuk bayar (Biasanya OVO/Dana)
    mobileDeepLink?: string; // URL untuk membuka aplikasi e-wallet langsung di HP (Contoh: gojek://pay?id=...)
    qrCheckoutString?: string; // String mentah untuk dirender jadi QR Code (Opsional)
}

// 3. Aksi untuk Retail Outlet (Alfamart, Indomaret)
export interface IRetailOutletActionInfo {
    paymentCode: string; // Contoh: "LUMINA889922"
    storeName: string; // Contoh: "ALFAMART"
    expirationDate: string;
}

// 4. Aksi untuk QRIS
export interface IQrisActionInfo {
    qrString: string; // Teks mentah QRIS yang akan diubah jadi gambar QR oleh Frontend
    expirationDate: string;
}

export type IPaymentActionInfo =
    | IVirtualAccountActionInfo
    | IEWalletActionInfo
    | IRetailOutletActionInfo
    | IQrisActionInfo;
