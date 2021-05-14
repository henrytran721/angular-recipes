export class User {
    constructor(
        public email: string,
        public _token: string, 
        public id: string, 
        private _tokenExpirationDate: Date
    ) {}

    // able to access a property / user cant overwrite
    get token() {
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this._token;
    }
}