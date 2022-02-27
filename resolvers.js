
const User = require('./models/user.js');
const { ApolloError, AuthenticationError, ValidationError } = require('apollo-server-errors');
const Listing = require('./models/Listing.js');
const Booking = require('./models/Booking.js');
const jwt = require("jsonwebtoken");
const { text } = require('express');

exports.resolvers = {
    Query: {
        getAllBookings: async (parent, args) => {
            const find = await User.findById(args.userId)
            if (!find) {
                return
            }
            if (find.type != 'user') {
                throw new ValidationError("unauthorised access")
            }
            return await Booking.find({})
        },
        getBookingById:async(parent,args)=>{
            return await Booking.find({_id:args._id})
        },
        getAllListings: async (parent, args) => {
            const find = await User.findById(args.userId)
            if (!find) {
                return
            }
            if (find.type != 'admin') {
                throw new ValidationError("unauthorised access")
            }
            return await Listing.find({})
        },
        // getAllListingsOnlyAdmin: async (parent, args) => {
        //     if (!args.userId) {
        //         throw ValidationError("unauthorised access")
        //     }
        //     const find = await User.findById(args.userId)
        //     if (!find) {
        //         return
        //     }
        //     if (find.type != 'admin') {
        //         return
        //     }
        //     return await Listing.find({ username: find.username})
        // },
        getListingByCity: async (parent, args, context) => {
            const find = await User.findById(args.userId)
            if (!find) {
                return
            }
            if (find.type != 'admin') {
                throw ValidationError("unauthorised access")
            }
            return await Listing.find({ city: args.city})
        },
        getListingByTitle: async (parent, args, context) => {
            const find = await User.findById(args.userId)
            if (!find) {
                return
            }
            if (find.type != 'admin') {
                throw ValidationError("unauthorised access")
            }
            return await Listing.find({ listing_title: args.listing_title})  
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.findOne({ username: args.username });
            
            if (user) {
                throw new ApolloError('A username is aleready existed');
            }
            const newUser = new User(args);
            newUser.save((err, success) => {
                if (err) {
                    console.log(err);
                }
                else {
                    alert("Created a user");
                }
            })
            return newUser;
        },
        addListing: async (parent, args) => {
            if (!args.userId) {
                return
            }
            const user = await User.findById(args.userId)
            if (!user) {
                throw new AuthenticationError("User id not found")
            }
            if (user.type != 'admin') {
                throw new AuthenticationError("User must be admin")
            }
            if (user.username != args.username) {
                throw new AuthenticationError("User name should match with admin name")
            }
            let list = new Listing({
                listing_id: args.listing_id,
                listing_title: args.listing_title,
                description: args.description,
                street: args.street,
                city: args.city,
                postal_code: args.postal_code,
                price: args.price,
                email: search.email,
                username: search.username
            })
            return await list.save();
            
          
        },
        addBooking: async (parent, args) => {
            if (!args.userId) {
                return
            }
            if (!args.listing_id) {
                return
            }
            const search = await User.findById(args.userId)
            if (!search) {
                return
            }
            let newBooking = new Booking({

                listing_id: args.listing_id,
                booking_id: args.booking_id,
                booking_date: new Date().toString(),
                booking_start: new Date(args.booking_start.toString()),
                booking_end: new Date(args.booking_end.toString()),
                username: search.username                
            })
                
            return newBooking.save()
        },
        login: async (parent, text ) => {
            const user = await User.findOne({ username: text.username })
            if (!user) {
                throw new AuthenticationError("user not found")
            }
            if (user.password != text.password) {
                throw new AuthenticationError("password doesn\'t match")
            }
            return user
        }
    }
}