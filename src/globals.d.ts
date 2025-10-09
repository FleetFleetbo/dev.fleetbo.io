interface FleetboAPI {
  back: (payload?: any) => void;
  openPage: (page: string, transition?: 'slide' | 'fade' | 'none') => void;
  openPageId: (page: string, id: string, params?: Record<string, any>) => void;
  presentModal: (page: string, presentationStyle: 'fullScreen' | 'pageSheet' | 'formSheet') => void;
  dismissModal: (count: number) => void;
  getNavigationStack: () => Promise<Array<{ page: string, id?: string }>>;
  setScreenOrientation: (orientation: 'portrait' | 'landscape' | 'auto') => Promise<boolean>;
  getDisplayMetrics: () => Promise<{ width: number, height: number, density: number, safeArea: { top: number, bottom: number, left: number, right: number } }>;
  setStatusBar: (style: 'light' | 'dark', animated: boolean) => void;
  setNavigationBarColor: (color: string) => Promise<boolean>;

  isAuthenticated: () => Promise<{ success: boolean; isLoggedIn: boolean; appName?: string; description?: string; role?: string; error?: string; token?: string; userId?: string }>;
  performBiometricAuth: (reason: string) => Promise<{ success: boolean; error?: string }>;
  refreshSessionToken: (oldToken: string) => Promise<{ success: boolean; newToken?: string }>;
  initiateOAuthFlow: (provider: 'google' | 'apple' | 'facebook' | 'saml') => Promise<{ success: boolean; credential?: any }>;
  logout: () => Promise<void>;
  validateMFAToken: (token: string) => Promise<{ success: boolean }>;

  getDoc: <T = any>(db: string, table: string, id: string) => Promise<{ success: boolean; data?: T; error?: string }>;
  getDocsG: <T = any>(db: string, collection: string, query?: any[]) => Promise<{ success: boolean; data?: T[]; error?: string }>;
  delete: (db: string, collection: string, id: string) => Promise<{ success: boolean; error?: string }>;
  executeBatchWrite: (operations: Array<{ type: 'set' | 'update' | 'delete', path: string, data?: any }>) => Promise<{ success: boolean; error?: string }>;
  runTransaction: (db: string, operations: any) => Promise<boolean>;
  onSnapshot: <T = any>(db: string, path: string, callback: (data: T | null) => void) => () => void;
  triggerServerFunction: (name: string, payload: any) => Promise<{ success: boolean, result?: any }>;

  showNativeDialog: (title: string, message: string, buttons: Array<{ text: string, style: 'default' | 'cancel' | 'destructive' }>) => Promise<{ buttonIndex: number }>;
  showToast: (message: string, duration: 'short' | 'long', position: 'top' | 'center' | 'bottom') => void;
  triggerShareSheet: (options: { text?: string, url?: string, title?: string }) => Promise<{ completed: boolean, activityType?: string }>;
  showActionSheet: (title: string | null, options: string[], destructiveButtonIndex?: number, cancelButtonIndex?: number) => Promise<{ buttonIndex: number }>;
  openPhotoLibrary: (options: { selectionLimit: number, mediaType: 'photos' | 'videos' | 'any' }) => Promise<{ success: boolean, assets?: Array<{ uri: string, base64: string }> }>;
  startCameraSession: (options: { cameraType: 'front' | 'back' }) => Promise<{ success: boolean, asset?: { uri: string, base64: string } }>;

  getDeviceUUID: () => Promise<string>;
  getAppVersion: () => Promise<{ version: string, build: number }>;
  getDeviceInfo: () => Promise<{ model: string, os: string, osVersion: string, manufacturer: string, isSimulator: boolean }>;
  checkNetworkStatus: () => Promise<{ isConnected: boolean, type: 'wifi' | 'cellular' | 'none' }>;
  getBatteryLevel: () => Promise<number>;
  vibrateDevice: (pattern: number[] | 'light' | 'medium' | 'heavy' | 'success' | 'error') => void;
  isRootedOrJailbroken: () => Promise<boolean>;
  getThermalState: () => Promise<'nominal' | 'fair' | 'serious' | 'critical'>;

  saveFileToDocuments: (fileName: string, base64Data: string) => Promise<{ success: boolean, path?: string }>;
  readFileAsBase64: (filePath: string) => Promise<{ success: boolean, data?: string }>;
  getFreeDiskSpace: () => Promise<number>;
  createDirectory: (path: string) => Promise<boolean>;
  listDirectoryContents: (path: string) => Promise<string[]>;
  streamFileDownload: (url: string, destination: string, onProgress: (progress: { bytesWritten: number, totalBytes: number }) => void) => Promise<{ success: boolean }>;

  getPushNotificationToken: () => Promise<{ success: boolean, token?: string }>;
  requestNotificationPermission: (options: { alert: boolean, sound: boolean, badge: boolean }) => Promise<{ granted: boolean }>;
  subscribeToTopic: (topic: string) => Promise<boolean>;
  unsubscribeFromTopic: (topic: string) => Promise<boolean>;
  scheduleLocalNotification: (id: string, config: { title: string, body: string, trigger: { seconds: number } | { date: Date } }) => void;
  getDeliveredNotifications: () => Promise<any[]>;
  setApplicationIconBadgeNumber: (count: number) => void;

  logAnalyticsEvent: (eventName: string, params: Record<string, any>) => void;
  setAnalyticsUserIdentifier: (userId: string) => void;
  reportCrash: (error: Error, metadata?: Record<string, any>) => void;
  startPerformanceTrace: (traceName: string) => { stop: () => void };
  clearWebViewCache: (fullReset: boolean) => Promise<void>;
  syncLocalStorage: (data: Record<string, string>) => Promise<boolean>;
  encryptPayload: (data: object, keyAlias: string) => Promise<string>;
  decryptPayload: (encryptedData: string, keyAlias: string) => Promise<object>;
  fetchRemoteConfig: () => Promise<Record<string, string | number | boolean>>;

  storeInKeystore: (key: string, value: string) => Promise<boolean>;
  getFromKeystore: (key: string) => Promise<string | null>;
  generateKeyPair: (alias: string) => Promise<{ publicKey: string }>;

  initBackgroundGeolocation: (config: object) => Promise<boolean>;
  readNfcTag: () => Promise<{ id: string, payload: string } | null>;
  connectToBluetoothDevice: (deviceId: string, options?: any) => Promise<boolean>;
  scanBarCode: () => Promise<{ success: boolean, format: string, text: string }>;
  startMotionUpdates: (callback: (motion: { acceleration: { x, y, z }, rotation: { alpha, beta, gamma } }) => void) => () => void;
  openWebSocket: (url: string, protocols?: string[]) => { send: (data: string | ArrayBuffer) => void; close: () => void; onMessage: (callback: (data: any) => void) => void; };

  fetchInAppProducts: (productIds: string[]) => Promise<{ success: boolean, products?: any[] }>;
  purchaseProduct: (productId: string) => Promise<{ success: boolean, transactionId?: string }>;
  restorePurchases: () => Promise<{ success: boolean, activeSubscriptions?: string[] }>;
  checkSubscriptionStatus: (productId: string) => Promise<{ isActive: boolean, expirationDate?: Date }>;

  initARSession: (config: { tracking: 'world' | 'face' }) => Promise<boolean>;
  placeARObject: (uri: string, coordinates: { x: number, y: number, z: number }) => Promise<string>; // returns object ID
  runOnDeviceMLModel: (modelName: string, input: any) => Promise<any>;

  queryContacts: (query: string) => Promise<Array<{ id: string, name: string, phone?: string, email?: string }>>;
  createCalendarEvent: (event: { title: string, startDate: Date, endDate: Date, location?: string }) => Promise<{ success: boolean, eventId?: string }>;
}

declare global {
  interface Window {
    Fleetbo: FleetboAPI;
    __FLEETBO_NATIVE_SDK_VERSION__: string;
  }

  const __FLEETBO_BUILD_CONFIG__: {
    readonly environment: 'development' | 'staging' | 'production';
    readonly apiEndpoint: string;
    readonly enableDebug: boolean;
    readonly featureFlags: Record<string, boolean>;
  };
}

declare namespace FleetboInternal {
  type EventType = 'viewWillAppear' | 'viewDidDisappear' | 'appDidEnterBackground' | 'appWillEnterForeground';
  type EventCallback = (payload?: any) => void;

  interface EventBus {
    subscribe: (event: EventType, callback: EventCallback) => () => void; // Returns unsubscribe function
    publish: (event: EventType, payload?: any) => void;
  }

  function getEventBus(): EventBus;
  function getCoreDiagnostics(): Promise<object>;
}

declare type FleetboEventPayload<T> = {
  timestamp: number;
  source: 'native' | 'webview';
  eventName: string;
  data: T;
};

export {};

