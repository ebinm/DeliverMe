const mockedOrders = [
    {
        _id: "iuvhjadfoiuj3c2roi",
        status: "In Progress",
        creationDate: new Date().toUTCString(),
        latestDeliveryTime: new Date().toUTCString(),
        earliestDeliveryTime: new Date().toUTCString(),
        totalCostOfOrder: undefined,
        note: "Please do not ring the doorbell",
        groceryShop: {

            ///// Google Maps API response object /////
            place_id: "ChIJoeM2T0Q8nkcRJr9jNMktPow", // All maps objects have place_id
            geometry: { // All maps objects have geometry with location
                location: {lat: 48.12838420000001, lng: 11.5977815}
            },
            formatted_address: "Karlsplatz 25, München", //location object have formatted_address but no vicinity
            vicinity: "Karlsplatz 25, München", // shop object have vicinity but no formatted_address
            ///////////////////////////////////////////
            
            name: "REWE",
            street: "Ungerstraße 54",
            city: "Munich",
            state: "Bavaria",
            postalCode: "80331",
            country: "DE",

        },
        createdBy: {
            firstName: "Betty",
            lastName: "Zhang",
            ratingStarAverage: 4,
            phoneNumber: "2452462346236",
            email: "betty.zhang@betty.zhang"
        },
        destination: {
            ///// Google Maps API response object /////
            place_id: "ChIJwcfcMHIXdkcRVG-tsrdzL8U", // All maps objects have place_id
            geometry: { // All maps objects have geometry with location
                location: {lat: 48.1493467, lng: 11.5582261}
            },
            formatted_address: "Karlsplatz 25, München", //location object have formatted_address but no vicinity
            vicinity: "Karlsplatz 25, München", // shop object have vicinity but no formatted_address
            ///////////////////////////////////////////

            street: "Münchernerstraße 32",
            city: "Munich",
            state: "Bavaria",
            postalCode: "80331",
            country: "DE"
        },
        items: [
            {
                _id: "asfawfawfawfawf",
                name: "Bread",
                quantity: 2,
                unit: undefined,
                brandName: undefined,
                ifItemUnavailable: "See Notes",
                note: "If they have no Alora Kornleiberl one from Schnitzer. If they have neither, don’t buy any."
            }
        ],
        selectedBid: {
            _id: "b3wrtbrw242462462646243we2",
            moneyBid: {
                currency: "EUR",
                amount: 100
            },
            moneyBidWithFee: {
                currency: "EUR",
                amount: 120
            },
            timeBid: new Date().toUTCString(),
            note: "I am the best! Choose me.",
            createdBy: {
                firstName: "Simon",
                lastName: "Brumer",
                ratingStarAverage: 4,
                phoneNumber: "82371519824",
                email: "simon.brumer@simon.brumer"
            }
        },
        bids: [
            {
                _id: "b3wrtbrw24373232723753we2",
                moneyBid: {
                    currency: "EUR",
                    amount: 100
                },
                moneyBidWithFee: {
                    currency: "EUR",
                    amount: 120
                },
                timeBid: new Date().toUTCString(),
                note: "I am the best! Choose me.",
                createdBy: {
                    firstName: "Simon",
                    lastName: "Brumer",
                    ratingStarAverage: 4
                }
            },
            {
                _id: "bsfd54864560674nb3b3234g",
                moneyBid: {
                    currency: "EUR",
                    amount: 50
                },
                moneyBidWithFee: {
                    currency: "EUR",
                    amount: 70
                },
                timeBid: new Date().toUTCString(),
                note: "I am the best! Choose me.",
                createdBy: {
                    firstName: "John",
                    lastName: "Doe",
                    ratingStarAverage: 3
                }
            }
        ]

    },
    {
        _id: "tq28uhzajpa21233tt242t3423t4356793474pajc9j",
        status: "In Progress",
        creationDate: new Date().toUTCString(),
        latestDeliveryTime: new Date().toUTCString(),
        earliestDeliveryTime: new Date().toUTCString(),
        totalCostOfOrder: undefined,
        note: "Please do not ring the doorbell",
        groceryShop: {
            ///// Google Maps API response object /////
            place_id: "ChIJKRlMEYp1nkcR5-rTiWjgjTM",
            geometry: {
                location: {lat: 48.12838420000001, lng: 11.5977815}
            },
            formatted_address: "Karlsplatz 25, München",
            vicinity: "Karlsplatz 25, München",
            ///////////////////////////////////////////

            name: "REWE",
            street: "Ungerstraße 54",
            city: "Munich",
            state: "Bavaria",
            postalCode: "80331",
            country: "DE"
        },
        destination: {

            ///// Google Maps API response object /////
            place_id: "ChIJ4WA62X4XdkcRA3wMft7BjPQ",
            geometry: {
                location: {lat: 47.7999339, lng: 12.1655022}
            },
            formatted_address: "Karlsplatz 25, München",
            vicinity: "Karlsplatz 25, München",
            ///////////////////////////////////////////

            name: "Shop name",
            street: "Münchernerstraße 32",
            city: "Munich",
            state: "Bavaria",
            postalCode: "80331",
            country: "DE"
        },
        createdBy: {
            firstName: "Betty",
            lastName: "Zhang",
            ratingStarAverage: 4,
            phoneNumber: "2452462346236",
            email: "betty.zhang@betty.zhang"
        },
        items: [
            {
                _id: "2gsaw236a13513351dwadwa2",
                name: "Banana",
                quantity: 103,
                unit: "kg",
                brandName: "Chiquita",
                ifItemUnavailable: "Buy Nothing",
                note: undefined
            },
            {
                _id: "3tgh322362345754764g2423",
                name: "Bread",
                quantity: 1,
                unit: "unit",
                brandName: undefined,
                ifItemUnavailable: "See Notes",
                note: "If they have no Alora Kornleiberl, please bring me one from Schnitzer. If they have neither, don’t buy any."
            },
            {
                _id: "3tgh3223647455472364g2423",
                name: "Bread",
                quantity: 2,
                unit: undefined,
                brandName: undefined,
                ifItemUnavailable: "See Notes",
                note: "If they have no Alora Kornleiberl, please bring me one from Schnitzer. If they have neither, don’t buy any."
            },
            {
                _id: "5232364572673127546246",
                name: "Bread",
                quantity: 2,
                unit: undefined,
                brandName: undefined,
                ifItemUnavailable: "See Notes",
                note: "If they have no Alora Kornleiberl, please bring me one from Schnitzer. If they have neither, don’t buy any."
            },
            {
                _id: "3tgh3234jet6nu576224g2423",
                name: "Brea264d",
                quantity: 2,
                unit: undefined,
                brandName: undefined,
                ifItemUnavailable: "See Notes",
                note: "If they have no Alora Kornleiberl, please bring me one from Schnitzer. If they have neither, don’t buy any."
            },
            {
                _id: "3tgh32434h5s4ed5nhh24g2423",
                name: "Bread",
                quantity: 2,
                unit: undefined,
                brandName: undefined,
                ifItemUnavailable: "See Notes",
                note: "If they have no Alora Kornleiberl, please bring me one from Schnitzer. If they have neither, don’t buy any."
            },
            {
                _id: "3tgh32s5zxn4e5h245h25h4g2423",
                name: "Bread",
                quantity: 2,
                unit: undefined,
                brandName: undefined,
                ifItemUnavailable: "See Notes",
                note: "If they have no Alora Kornleiberl, please bring me one from Schnitzer. If they have neither, don’t buy any."
            }
        ],
        bids: [
            {
                _id: "b3wrtbrws5nxdze4r3we2",
                moneyBid: {
                    currency: "EUR",
                    amount: 100
                },
                moneyBidWithFee: {
                    currency: "EUR",
                    amount: 120
                },
                timeBid: new Date().toUTCString(),
                note: "I am the best! Choose me.",
                createdBy: {
                    firstName: "Simon",
                    lastName: "Brumer",
                    ratingStarAverage: 4
                }
            },
            {
                _id: "bsfdnb3b32umdtz6534g",
                moneyBid: {
                    currency: "EUR",
                    amount: 50
                },
                moneyBidWithFee: {
                    currency: "EUR",
                    amount: 70
                },
                timeBid: new Date().toUTCString(),
                note: "I am the best! Choose me.",
                createdBy: {
                    firstName: "John",
                    lastName: "Doe",
                    ratingStarAverage: 3
                }
            }
        ]
    }
]

// TODO missing some information about what to do now
const mockedNotifications = [
    {
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
    }
]

export {mockedOrders, mockedNotifications}