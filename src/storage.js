export { WebStorage };

// for now we use local storage if it is available, session storage as a fallback to that or nothing at all as a fallback to that

class WebStorage {
    static LOCAL = "localStorage";
    static SESSION = "sessionStorage";

    /**
     * 
     * @param {either WebStorage.LOCAL is the type or WebStorage.SESSION} type 
     */
    constructor(windowRef) {

        this.window = windowRef;
        this.storage = this.resolveStorage(WebStorage.LOCAL) ?? this.resolveStorage(WebStorage.SESSION) ?? {};

    }

    checkStorage() {
        return (Object.getPrototypeOf(this.storage) !== null);
    }

    /**
     * 
     * @param {String} key 
     * @param {String} value 
     *   
     * @returns false if failed to set, true otherwise
     */
    setItem(keyVal, value) {
        const key = "htd_" + keyVal;
        let strVal = (typeof value) === "string" ? value : JSON.stringify(value);

        try {
            if (!this.checkStorage()) { //this is not a real web storage 
                this.storage[key] = value;
            } else {
                this.storage.setItem(key, strVal);
            }
            return true;
        } catch (e) {
            if (e instanceof DOMException &&
                e.name == "QuotaExceededError") {
                // TODO: throw a new type of error but have to write code to extend Error first
                return false;
            }
        }
    }

    getItem(keyVal) {
        const key = "htd_" + keyVal;
        if (!this.checkStorage()) {
            return this.storage[key];
        } else {
            const ret = this.storage.getItem(key);
            return ret ? JSON.parse(ret) : ret;
        }
    }

    // This function is copied from MDN https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
    resolveStorage(type) {
        let storage;
        try {
            storage = this.window[type];
            const x = "__storage_test__";
            storage.setItem(x, x);
            storage.removeItem(x);
            return storage;
        } catch (e) {
            if (
                e instanceof DOMException &&
                e.name === "QuotaExceededError" &&
                // acknowledge QuotaExceededError only if there's something already stored
                storage &&
                storage.length !== 0
            ) {
                return storage;
            } else {
                return null;
            }
        }
    }

}
