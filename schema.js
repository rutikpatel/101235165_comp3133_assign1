const { gql } = require('apollo-server-express');

exports.typeDefs = gql `
    scalar Date
    type Listing {
        listing_id: String!
        listing_title: String!
        description: String!
        street: String!
        city: String!
        postal_code: String!
        price: Float!
        email: String!
        username: String!
        userId:ID
    },
    type Booking {
        _id: ID
        listing_id: String
        booking_id: String
        booking_date: Date
        booking_start: Date
        booking_end: Date
        username:String
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
        getAllBookings: [Booking]
        getAllListings: [Listing]
        getBookingById(_id:String!):[Booking]
        getAllListingsOnlyAdmin: [Listing]
        getListingByTitle(listing_title: String!):[Listing]
        getListingByListing_id(listing_id: String!):[Listing]
        getListingByCity(city: String!):[Listing]
        getListingByPostalCode(postal_code: String!):[Listing]
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
            price: Int): Listing

        addBooking(userId: String!,
            listing_id: String, 
            booking_id: String, 
            booking_date: Date, 
            booking_start: Date, 
            booking_end: Date): Booking
    },
    
`;