import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.koodai.app',
    appName: 'Koodai',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    }
};

export default config;
