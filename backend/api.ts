import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import shopperRoutes from "./routes/shopperRoutes";
import buyerRoutes from "./routes/buyerRoutes";
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoutes";
import bidRoutes from "./routes/bidRoutes";
import reviewRoutes from "./routes/reviewRoutes";

const api = express();
// TODO this is a very large limit to allow for images to be uploaded. Still,
api.use(express.json({limit: "99999kb"}));
api.use(cookieParser());

// TODO I think this is only required in dev mode
// TODO configure origin correctly
const corsWhitelist = ['http://localhost:3000', 'https://localhost:3000']

api.use(cors({
    credentials: true,
    origin: (origin, callback) => {

        // TODO remove this
        callback(null, true)

        // if (corsWhitelist.indexOf(origin) !== -1) {
        //     callback(null, true)
        // } else {
        //     callback(new Error("Not allowed by CORS"))
        // }
    },
}));


// API routes
api.use("/api/shopper", shopperRoutes);

api.use("/api/buyer", buyerRoutes);

api.use("/api/me", userRoutes);

api.use("/api/orders", orderRoutes);

api.use("/api/bids", bidRoutes);

api.use("/api/reviews", reviewRoutes);

// Error handling
api.use((err, req, res, next) => {
     res.status(500).json({msg: err}) //TODO:  @Lukas err is always undefined, why not do: err = "Internal Server Error" ????
 })

export default api;