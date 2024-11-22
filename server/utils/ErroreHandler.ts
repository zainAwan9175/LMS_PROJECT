class ErroreHandler extends Error{
    statusCode:Number;
    constructor(message:any,statusCode:any)
    {
        super(message);
        this.statusCode=statusCode;
        Error.captureStackTrace(this,this.constructor);
    }

}

export default ErroreHandler;