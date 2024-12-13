// Establish a WebSocket connection to the server
const socket = new WebSocket('ws://localhost:3000/ws');

// Listen for messages from the server
socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'newPoll') {
        onNewPollAdded(data.poll);
    }

    if (data.type === 'voteUpdate') {
        updatePollVotes(data.pollId, data.option, data.votes);
    }
});

// Handles adding a new poll to the page when one is received from the server
function onNewPollAdded(poll) {
    const pollContainer = document.getElementById('polls');
    const newPoll = document.createElement('li');
    newPoll.classList.add('poll-container');
    newPoll.id = poll._id;
    newPoll.innerHTML = `
        <h2>${poll.question}</h2>
        <ul class="poll-options">
            ${poll.options.map(option => 
                `<li id="${poll._id}_${option.answer}">
                    <strong>${option.answer}:</strong> ${option.votes} votes
                </li>`).join('')}
        </ul>
        <form class="poll-form button-container">
            ${poll.options.map(option => 
                `<button class="action-button vote-button" type="submit" value="${option.answer}" name="poll-option">
                    Vote for ${option.answer}
                </button>`).join('')}
            <input type="text" style="display: none;" value="${poll._id}" name="poll-id"/>
        </form>
    `;
    pollContainer.appendChild(newPoll);

    newPoll.querySelectorAll('.poll-form').forEach((pollForm) => {
        pollForm.addEventListener('submit', onVoteClicked);
    });
}

// Handles updating the number of votes an option has when a new vote is received from the server
function updatePollVotes(pollId, option, votes) {
    const optionElement = document.querySelector(`#${pollId}_${option}`);
    if (optionElement) {
        optionElement.innerHTML = `<strong>${option}:</strong> ${votes} votes`;
    }
}

// Handles processing a user's vote when they click on an option to vote
function onVoteClicked(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const pollId = formData.get("poll-id");
    const selectedOption = event.submitter.value;

    socket.send(JSON.stringify({
        type: 'vote',
        pollId: pollId,
        selectedOption: selectedOption,
    }));
}

document.querySelectorAll('.poll-form').forEach((pollForm) => {
    pollForm.addEventListener('submit', onVoteClicked);
});



