const mockNotifications = [{
    _id: "u98oujao32ujdoa9j2",
    msg: "You can leave a rating for @Simon",
    date: new Date(2023, 4, 10, 20, 9, 0).toUTCString(),
    type: "rating"
},
    {
        _id: "u98oujao32ujdoa9jgsweges2",
        msg: "You received an invoice",
        date: new Date(2023, 4, 10, 20, 10, 0).toUTCString(),
        type: "invoice"
    },
    {
        _id: "u9gweweg8oujao32ujdoa9j2",
        msg: "Your order has been completed",
        date: new Date(2022, 4, 9, 20, 10, 0).toUTCString(),
        type: "purchaseCompleted"
    }]

Math.random().toString(16).slice(2)


export function getMockNotification() {
    return {
        ...mockNotifications[Math.floor(Math.random() * mockNotifications.length)],
        _id: Math.random().toString(16).slice(2),
        date: new Date()
    }
}