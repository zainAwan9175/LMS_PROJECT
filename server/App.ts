import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandlerMiddleware } from "./middleware/errore";
import userrouter from "./routes/user-routr";
import courseRouter from "./routes/course-route";
import orderrouter from "./routes/order-route";
import analyticrouter from "./routes/analytic-route";
import notificationRoute from "./routes/notification.route";
import layoutrouter from "./routes/layout-route";

export const app = express();

// ✅ Enable CORS before any routes
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

// ✅ Increase Payload Size Limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Required for form submissions

// ✅ Cookie parser
app.use(cookieParser());

// ✅ Test Route
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "API working successfully",
    });
});

// ✅ Route Setup
app.use("/user", userrouter);
app.use("/course", courseRouter);
app.use("/order", orderrouter);
app.use("/analytics", analyticrouter);
app.use("/notification", notificationRoute);
app.use("/layout", layoutrouter);

// ✅ Handle 404 Errors
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err: any = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});

// ✅ Error Handling Middleware
app.use(errorHandlerMiddleware);
