import { Injectable } from '@angular/core';
import * as forge from 'node-forge';

@Injectable({
  providedIn: 'root'
})
export class PublicKeysService {

  public publicKey: string = `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAskgPKBcNpz71mi4NSYa5
    mazJrO0WZim7T2yy7qPxk2NqQE7OmWWakLJcaeUYnI0kO3yC57vck66RPCjKxWuW
    SGZ7dHXe0bWb5IXjcT4mNdnUIalR+lV8czsoH/wDUvkQdG1SJ+IxzW64WvoaCRZ+
    /4wBF2cSUh9oLwGEXiodUJ9oJXFZVPKGCEjPcBI0vC2ADBRmVQ1sKsZg8zbHN+gu
    U9rPLFzN4YNrCnEsSezVw/W1FKVS8J/Xx4HSSg7AyVwniz8eHi0e3a8VzFg+H09I
    5wK+w39sjDYfAdnJUkr6PjtSbN4/Sg/NMkKB2Ngn8oj7LCfe/7RNqIdiS+dQuSFg
    eQIDAQAB
    -----END PUBLIC KEY-----`;

// public rsa = forge.pki.publicKeyFromPem(this.pubkey.publicKey);
// public encryptedPassword = window.btoa(this.rsa.encrypt(this.formModel.Password));

encryptValue( encValue: any){
  var rsa = forge.pki.publicKeyFromPem(this.publicKey);
  var encrypting =  window.btoa(rsa.encrypt(encValue));
  //var decryp = window.btoa(rsa)
  return encrypting;
}

  decrypt() {
    // this.$encrypt.setPrivateKey(privateKey);
    // this.plainText = this.$encrypt.decrypt(this.cypherText);
  }

  constructor() { }
}
