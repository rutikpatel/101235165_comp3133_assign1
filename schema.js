const { gql } = require('apollo-server-express');

exports.typeDefs = gql `
    scalar Date
    type Listing {
        _id: ID
        listing_id: String!
        listing_title: String!
        description: String!
        street: String!
        city: String!
        postal_code: String!
        price: Float!
        email: String!
        username: String!
    },
    type Booking {
        _id: ID
        listing_id: String
        booking_id: String
        booking_date: Date
        booking_start: Date
        booking_end: Date
        username: String
    },
    type User {
        _id: ID!
        username: String!
        firstname: String!
        lastname: String!
        password: String!
        email: String!
        type: String!
    },
    type Query {
        getAllBookings(userId:String!): [Booking]
        getAllListings(userId:String!): [Listing]
        getBookingById(_id:String!):[Booking]
        getAllListingsOnlyAdmin: [Listing]
        getListingByTitle(listing_title: String!,userId:String!):[Listing]
        getListingByCity(city: String!,userId:String!):[Listing]
    },
    type Mutation {
        login (username: String!, password: String!):User
        addUser(username: String!,
            firstname: String!,
            lastname: String!, 
            password: String!, 
            email: String!
            type: String!): User

        addListing(
            userId: String!,
            listing_id: String,
            listing_title: String,
            description: String,
            street: String,
            city: String,
            postal_code: String,
            price: Float ,
            email: String,
            username: String): Listing

        addBooking(userId: String!
            listing_id: String, 
            booking_id: String, 
            booking_date: Date, 
            booking_start: Date, 
            booking_end: Date, 
            username: String): Booking
    },
    
`;