const express = require("express");
const Subscriber = require("../models/Subscribe");

const router = express.Router();


// route POST /api/subscribe 
// desc handle newsletter subscription
// access public

router.post("/", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "email is required"});
    }
    try {
        // check if the emIL IS ALREADY subscribed
        let subscriber = await Subscriber.findOne({ email });

        if (subscriber) {
            return res.status(400).json({message: "email is already subscribed"})
        }

        //create a new subscriber

        subscriber = new Subscriber({ email })
        await subscriber.save();

        res.status(201).json({ message: "Successfully subscribed to the newsletter!"})

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server Error"})
    }
})
module.exports = router;