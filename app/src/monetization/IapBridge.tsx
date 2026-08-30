import { useEffect } from 'react';
import { useIAP } from 'expo-iap';
import { IAP_PRODUCT_ID } from './runtime';

export type IapBridgeProps = {
  grant: () => Promise<void>;
  setPriceLabel: (label: string) => void;
  register: (actions: { purchase: () => Promise<void>; restore: () => Promise<void> }) => void;
};

export function IapBridge({ grant, setPriceLabel, register }: IapBridgeProps) {
  const {
    connected,
    products,
    availablePurchases,
    fetchProducts,
    requestPurchase,
    finishTransaction,
    restorePurchases,
    getAvailablePurchases,
  } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      if (purchase.productId !== IAP_PRODUCT_ID) return;
      await finishTransaction({ purchase, isConsumable: false });
      await grant();
    },
  });

  useEffect(() => {
    if (!connected) return;
    void fetchProducts({ skus: [IAP_PRODUCT_ID], type: 'in-app' });
    void getAvailablePurchases();
  }, [connected, fetchProducts, getAvailablePurchases]);

  useEffect(() => {
    const p = products.find((x) => x.id === IAP_PRODUCT_ID) ?? products[0];
    if (p?.displayPrice) setPriceLabel(p.displayPrice);
  }, [products, setPriceLabel]);

  useEffect(() => {
    if (availablePurchases.some((p) => p.productId === IAP_PRODUCT_ID)) {
      void grant();
    }
  }, [availablePurchases, grant]);

  useEffect(() => {
    register({
      purchase: async () => {
        await requestPurchase({
          request: {
            apple: { sku: IAP_PRODUCT_ID },
            google: { skus: [IAP_PRODUCT_ID] },
          },
          type: 'in-app',
        });
      },
      restore: async () => {
        await restorePurchases();
        await getAvailablePurchases();
      },
    });
  }, [register, requestPurchase, restorePurchases, getAvailablePurchases]);

  return null;
}
