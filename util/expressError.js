module.exports = class expressError extends Error{
    constructor(status, message){
        super();
        this.message = message;
        this.status = status;
    }
;}