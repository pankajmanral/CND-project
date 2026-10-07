const express = require("express");

const app = express();

app.use(express.json());

let candidates = [
    {
        id: 1,
        name: "Rahul",
        position: "Software Engineer",
        experience: 2
    },
    {
        id: 2,
        name: "Dev",
        position: "Data Analyst",
        experience: 3
    }
];

// Home
app.get("/", (req, res) => {
    res.json({
        message: "Candidate Service is running"
    });
});

// Get all candidates
app.get("/candidates", (req, res) => {
    res.json(candidates);
});

// Get candidate by ID
app.get("/candidates/:id", (req, res) => {

    const id = Number(req.params.id);

    const candidate = candidates.find(
        candidate => candidate.id === id
    );

    if (!candidate) {
        return res.status(404).json({
            message: "Candidate not found"
        });
    }

    res.json(candidate);
});

// Add candidate
app.post("/candidates", (req, res) => {

    const candidate = req.body;

    candidates.push(candidate);

    res.status(201).json({
        message: "Candidate added successfully",
        candidate
    });
});

app.listen(3000, () => {
    console.log(
        "Candidate Service running on port 3000"
    );
});