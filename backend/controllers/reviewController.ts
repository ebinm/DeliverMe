import {getOrderById} from "./orderController";
import mongoose, {Types} from "mongoose";
import {Review, ReviewModel} from "../models/review";
import {Shopper} from "../models/customer";
import {findShopperById, updateShopper} from "./shopperController";
import {findBuyerById, updateBuyer} from "./buyerController";

export async function getAllReviews(): Promise<Review[]> {

    return ReviewModel.find();

}

export async function getReviewById(reviewId: string): Promise<Review> {
    return ReviewModel.findById(reviewId);
}

export async function createReview(review: Review) {

    const reviewModel = new ReviewModel(review);
    return await reviewModel.save();

}

export async function updateReview(reviewId: string, review: Review) {

    return ReviewModel.findByIdAndUpdate(reviewId, review, {
        new: true,
    });

}

export async function deleteReview(reviewId: string) {

    return ReviewModel.findByIdAndDelete(reviewId);

}

export async function getReviewsOfCustomerTyped(_type: string, _customer: string): Promise<Review[]> {
    return ReviewModel.find( {type: _type, customer: _customer} );
}

export async function getReviewsOfBuyer(buyer: string): Promise<Review[]> {

    return ReviewModel.aggregate()
        .match({"customer": new mongoose.Types.ObjectId(buyer)})
        .lookup({
            from: "shoppers", localField: "createdBy",
            foreignField: "_id", as: "createdBy"
        }).addFields({
            createdBy: {$arrayElemAt: ["$createdBy", 0]} // extracts user from list
        }).project({
            "createdBy.password": 0, "createdBy.notifications": 0
        });

}

export async function getReviewsOfShopper(shopper: string): Promise<Review[]> {

    return ReviewModel.aggregate()
        .match({"customer": new mongoose.Types.ObjectId(shopper)})
        .lookup({
            from: "buyers", localField: "createdBy",
            foreignField: "_id", as: "createdBy"
        }).addFields({
            createdBy: {$arrayElemAt: ["$createdBy", 0]} // extracts user from list
        }).project({
            "createdBy.password": 0, "createdBy.notifications": 0
        });

}

export async function rateBuyer(shopperId: string, orderId: string, review: Review): Promise<Review> {

    const order = await getOrderById(orderId);

    if (!order) {
        throw new Error("Order with orderId does not exist")
    }

    if (!order.selectedBid || order.selectedBid.createdBy.toString() !== shopperId) {
        throw new Error("You are not authorized to rate the buyer of this order")
    }

    const buyer = await findBuyerById(order.createdBy.toString())

    if (!buyer) {
        throw new Error("Buyer with buyerId does not exist")
    }

    review.type = "Buyer";
    review.createdBy = new Types.ObjectId(shopperId);
    review.order = new Types.ObjectId(orderId);
    review.creationTime = new Date()
    review.customer = new Types.ObjectId(buyer._id);

    const oldReview = await ReviewModel.findOne({type: review.type,
        order: review.order,
        createdBy: shopperId});


    let newReview;

    if (!oldReview) {
        newReview = await createReview(review);
    } else {
        newReview = await updateReview(oldReview._id, review)
    }

    updateAverage(newReview);

    return newReview;
}

export async function rateShopper(buyerId: string, orderId: string, review: Review): Promise<Review> {

    const order = await getOrderById(orderId);

    if (!order) {
        throw new Error("Order with orderId does not exist")
    }

    if (order.createdBy.toString() !== buyerId) {
        throw new Error("You are not authorized to rate the shopper of this order")
    }

    const shopper = await findShopperById(order.selectedBid.createdBy.toString())

    if (!shopper) {
        throw new Error("Shopper with shopperId does not exist")
    }
    review.type = "Shopper";
    review.createdBy = new Types.ObjectId(buyerId);
    review.order = new Types.ObjectId(orderId);
    review.creationTime = new Date()
    review.customer = new Types.ObjectId(shopper._id);

    const oldReview = await ReviewModel.findOne({type: review.type,
        order: review.order,
        createdBy: buyerId});

    let newReview;

    if (!oldReview) {
        newReview = await createReview(review);
    } else {
        newReview = await updateReview(oldReview._id, review)
    }

    updateAverage(newReview);

    return newReview;
}

async function updateAverage(review: Review) {

    if (review.type === "Buyer") {
        const buyer = await findBuyerById(review.customer.toString())
        const reviews = await ReviewModel.find({type: review.type,
            customer: buyer._id});
        if(!reviews) {
            buyer.avgRating = review.rating;
        } else {
            buyer.avgRating = reviews.reduce((x, y) => x + y.rating, 0)
                / reviews.length;
        }
        await updateBuyer(buyer._id, buyer);
    } else {
        const shopper = await findShopperById(review.customer.toString())
        const reviews = await ReviewModel.find({type: review.type,
            customer: shopper._id});
        if(!reviews) {
            shopper.avgRating = review.rating;
        } else {
            shopper.avgRating = reviews.reduce((x, y) => x + y.rating, 0)
                / reviews.length
        }
        await updateShopper(shopper._id, shopper);
    }
}

export async function getReviewsForBuyerByOrder(buyerId: string, orderId: string){
    return ReviewModel.findOne({type: "Buyer", order: orderId, customer: {_id: buyerId}});
}

export async function getReviewsForShopperByOrder(buyerId: string, orderId: string){
    return ReviewModel.findOne({type: "Shopper", order: orderId, customer: {_id: buyerId}});
}


