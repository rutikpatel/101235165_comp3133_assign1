
const User = require('./models/user.js');
const { ApolloError, AuthenticationError, ValidationError } = require('apollo-server-errors');
const Listing = require('./models/Listing.js');
const Booking = require('./models/Booking.js');
const jwt = require("jsonwebtoken");
const { text } = require('express');

exports.resolvers = {
    Query: {
        getAllBookings: async (parent, args) => {
            return await Booking.find({})
        },
        getBookingById:async(parent,args)=>{
            return await Booking.find({_id:args._id})
        },
        getAllListings: async (parent, args) => {
            const listings = await Listing.find({})
            return listings
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
            return await Listing.find({ city: args.city})
        },
        getListingByListing_id: async (parent, args) => {
            return await Listing.find({listing_id:args.listing_id})
        },
        getListingByTitle: async (parent, args, context) => {
            return await Listing.find({ listing_title: args.listing_title})  
        },
        getListingByPostalCode: async(parent,args,context)=>{
            return await Listing.find({ postal_code: args.postal_code })  
        }
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
                    console.log("Created a user");
                }
            })
            return newUser;
        },
        addListing: async (parent, args) => {
            if (!args.userId) {
                return
            }
            if(!args.listing_id){
                throw new AuthenticationError("Listing id not found")
            }
            if (!args.listing_title) {
                throw new AuthenticationError("Listing title not found")
            }
            if (!args.description) {
                throw new AuthenticationError("Description not found")
            }
            if (!args.street) {
                throw new AuthenticationError("Street not found")
            }
            if(!args.city) {
                throw new AuthenticationError("city not found")
            }
            if(!args.postal_code) {
                throw new AuthenticationError("postal code not found")
            }
            if(!args.price || args.price == 0 || args.price<0) {
                throw new AuthenticationError("price not valid")
            }
            const user = await User.findById(args.userId)
            if (!user) {
                throw new AuthenticationError("User id not found")
            }
            if (user.type != 'admin') {
                throw new AuthenticationError("User must be admin")
            }
            let list = new Listing({
                listing_id: args.listing_id,
                listing_title: args.listing_title,
                description: args.description,
                street: args.street,
                city: args.city,
                postal_code: args.postal_code,
                price: args.price,
                email: user.email,
                username: user.username,
                userId :args.userId
            })
            return await list.save();
            
          
        },
        addBooking: async (parent, args) => {
            if (!args.userId) {
                return
            }
            if (!args.listing_id) {
                throw new AuthenticationError("Listing id not found")
            }
            if (!args.booking_id) {
                throw new AuthenticationError("Booking id not found")
            }
            if (!args.booking_date) {
                throw new AuthenticationError("Booking date not found")
            }
            if (!args.booking_start) {
                throw new AuthenticationError("Booking start date not found")
            }
            if (!args.booking_end) {
                throw new AuthenticationError("Booking end date not found")
            }

            const search = await User.findById(args.userId)
            if (!search) {
                return
            }
            if(search.booking_id ===args.booking_id){
                throw new AuthenticationError("Booking id must be unique")
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