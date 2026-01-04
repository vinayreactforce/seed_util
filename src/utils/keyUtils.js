import { set,get } from "@op-engineering/op-s2";
import { generateSecureRandom } from "react-native-securerandom";
export const KEY_NAME = 'keykajijijijdj';

async function generateKey() {
    // generate secure bytes using the t2 chip (SecRandomCopyBytes) and Secure Random on Android
    const secureBytes = await generateSecureRandom(42);
  
    // on the latest versions of RN btoa is part of hermes
    const key = btoa(String.fromCharCode.apply(null, secureBytes));
  
    set({
      key: KEY_NAME,
      value: key,
    });
  }

export async function getMyKey(){
  try{
    
    const myKey = get({ key: KEY_NAME });
    if(myKey.value){
      return  Promise.resolve(myKey.value);
    }else{
      await generateKey();
      return  getMyKey();
    }
  }catch(error){
    console.log(error);
    return Promise.reject(error);
  }
}
  