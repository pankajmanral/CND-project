const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

let interviews = [
    {
        id: 101,
        candidateId: 1,
        interviewer: "Amit",
        status: "Scheduled"
    }
];

// Get all interviews
app.get("/interviews", (req, res) => {
    res.json(interviews);
});

// Get interview with candidate details
app.get("/interviews/:id", async (req, res) => {

    const id = Number(req.params.id);

    const interview = interviews.find(
        interview => interview.id === id
    );

    if (!interview) {
        return res.status(404).json({
            message: "Interview not found"
        });
    }

    try {

        // REST API call to Candidate Microservice
        const response = await axios.get(
            `http://localhost:3000/candidates/${interview.candidateId}`
        );

        res.json({
            interview,
            candidate: response.data
        });

    } catch (error) {

        res.status(500).json({
            message: "Unable to get candidate details"
        });

    }
});

// Schedule a new interview
app.post("/interviews", async (req, res) => {
    const interview = req.body;

    try {
        // Check if candidate exists in Candidate Service
        await axios.get(
            `http://localhost:3000/candidates/${interview.candidateId}`
        );

        // Candidate exists, so schedule the interview
        interviews.push(interview);

        res.status(201).json({
            message: "Interview scheduled successfully",
            interview
        });

    } catch (error) {

        // Candidate Service returned 404
        if (error.response && error.response.status === 404) {
            return res.status(404).json({
                message: "Candidate does not exist"
            });
        }

        // Candidate Service itself is unavailable
        res.status(500).json({
            message: "Unable to connect to Candidate Service"
        });
    }
});

app.listen(4000, () => {
    console.log(
        "Interview Service running on port 4000"
    );
});