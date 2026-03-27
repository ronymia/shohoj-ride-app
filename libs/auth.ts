import * as SecureStore from 'expo-secure-store';

export interface ITokenCache{
    getToken:(token: string)=> Promise<string | undefined | null>;
    saveToken:(key: string, token: string)=> Promise<void>;
    clearToken:(token: string)=>void;
}

export const tokenCache ={
    async getToken(key:string){
        try{
            const item = await SecureStore.getItemAsync(key);

            if(item){
                console.log(`${key} - ${item} was used \n`);
            }else{
                console.log(`no value stored for ${key}`);
            }

        }catch (error){
            console.error("Error retrieving secure store get:", error);
            await SecureStore.deleteItemAsync(key);
            return null;
        }
    },
    async saveToken(key:string, value:string){
        try {
            return SecureStore.setItemAsync(key, value);
        }catch (error){
            console.error("Error saving to secure store:", error);
        }
    }
}