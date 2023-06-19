import io from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {authenticatedSocket} from "../middleware/auth";

interface NotificationService {
    notifyBuyerById: (id: number) => void
    notifyShopperById: (id: number) => void
}

export function createNotificationService(server: io.Server): NotificationService {

    const openConnections: Map<number, io.Socket<DefaultEventsMap, DefaultEventsMap>> = new Map()

    server.use(authenticatedSocket)

    server.on('connection', socket => {

        const auth = socket.handshake.auth
        console.log("Hello")
        console.log(auth)
        // console.log("Hello")
        // console.log(socket.handshake)
        // console.log(socket.handshake.headers)
        // console.log(socket.handshake.headers.cookie)
        // console.log(socket.handshake.headers.cookies?.["jwt"])


        socket.on('event', data => { /* … */
        });
        socket.on('disconnect', () => { /* … */
        });
    });

    return {
        notifyBuyerById: () => {
        },
        notifyShopperById: () => {
        },
    }
}
