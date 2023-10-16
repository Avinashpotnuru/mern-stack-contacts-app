const express = require("express");

const router = express.Router();

const ContactNumbers = require("../models/user");

//add contact

router.post("/addcontacts", async (req, res) => {
  try {
    const { name, number } = req.body;
    const existNumber = await ContactNumbers.findOne({ number });

    if (existNumber) {
      return res
        .status(403)
        .json({ message: "already number exist in your database" });
    }
    const newContact = new ContactNumbers({ name, number });
    await newContact.save();
    return res.status(201).json({ message: "successfully add details" });
  } catch (err) {
    console.log(err);

    return res.status(500).json({ err: "Server error" });
  }
});

//get all contacts

router.get("/allcontacts", async (req, res) => {
  try {
    const getContacts = await ContactNumbers.find();
    res.status(200).json(getContacts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Server error" });
  }
});

//delete contact

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ContactNumbers.findByIdAndDelete(id);
    return res.status(200).json({ message: "number delete successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "Server error" });
  }
});

//update contact

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const editNumber = await ContactNumbers.findByIdAndUpdate(id, req.body);
    if (!editNumber) {
      return res.status(404).json({ message: "number not found" });
    }
    return res.status(201).json({ message: "number edit successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getContacts = await ContactNumbers.findById(id);
    if (getContacts) {
      res.status(200).json(getContacts);
    } else {
      return res.status(404).json({ message: "id not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Server error" });
  }
});

module.exports = router;
