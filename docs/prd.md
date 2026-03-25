# Requirements Document

## 1. Application Overview
- **Application Name:** QuizBlast
- **Description:** A Kahoot-style real-time quiz application where a host can create and run quiz sessions, and participants can join and answer questions in real time, with live scoring and a final leaderboard.

---

## 2. Users & Use Cases
- **Target Users:** Quiz hosts (teachers, event organizers, team leads) and quiz participants (students, team members, event attendees)
- **Core Use Cases:**
  - A host creates a quiz, starts a session, and controls question flow
  - Participants join a session via a room code and answer questions on their devices
  - Both host and participants see live scores and a final leaderboard

---

## 3. Page Structure & Core Features

### 3.1 Page Overview
```
QuizBlast
├── Home Page
├── Host Flow
│   ├── Create Quiz Page
│   ├── Quiz Lobby Page (waiting room)
│   └── Host Game Page (question control + live results)
├── Participant Flow
│   ├── Join Page
│   ├── Waiting Room Page
│   ├── Answer Page (per question)
│   └── Score Page (per question result)
└── Leaderboard Page (end of game)
```

### 3.2 Home Page
- Two entry points: **Host a Quiz** and **Join a Quiz**
- Host a Quiz navigates to Create Quiz Page
- Join a Quiz navigates to Join Page

### 3.3 Create Quiz Page (Host)
- Host enters a quiz title
- Host adds one or more questions, each containing:
  - Question text
  - 2–4 answer options
  - Correct answer selection
  - Time limit per question (default: 20 seconds; options: 10s, 20s, 30s)
- Host can reorder, edit, or delete questions
- Host clicks **Start Quiz** to generate a unique 6-digit room code and proceed to Quiz Lobby

### 3.4 Quiz Lobby Page (Host)
- Displays the room code prominently for participants to join
- Shows a live list of participants who have joined
- Host clicks **Start Game** when ready; button is enabled only when at least 1 participant has joined

### 3.5 Join Page (Participant)
- Participant enters the 6-digit room code and a display nickname
- On valid submission, participant is taken to the Waiting Room Page

### 3.6 Waiting Room Page (Participant)
- Displays the participant's nickname and a waiting message
- Updates in real time when the host starts the game

### 3.7 Host Game Page
- Displays the current question text and all answer options
- Shows a countdown timer for the active question
- Shows the number of participants who have answered vs. total
- After the timer expires or all participants answer, host clicks **Next Question** to advance
- After the last question, host clicks **Show Leaderboard**

### 3.8 Answer Page (Participant)
- Displays the current question text and answer options as large tappable buttons
- Countdown timer is visible
- Once an answer is selected, the button is locked and a waiting indicator is shown
- If the timer expires before answering, the question is marked as unanswered

### 3.9 Score Page (Participant, shown after each question)
- Displays whether the participant's answer was correct or incorrect
- Shows points earned for that question
- Shows the participant's current cumulative score
- Automatically transitions to the next question when the host advances

### 3.10 Leaderboard Page
- Displays the final ranked list of all participants with their total scores
- Host view includes a **Play Again** button (resets the session with the same quiz) and an **End Session** button
- Participant view shows their final rank and score

---

## 4. Business Rules & Logic

### 4.1 Room Code
- Room codes are unique 6-digit alphanumeric strings generated at quiz start
- A room code is active only while the session is in progress; it expires when the host ends the session

### 4.2 Scoring
- A correct answer earns points based on answer speed: faster answers earn more points
- Base points for a correct answer: 1000
- Speed bonus: linearly decreases from 1000 (answered in first 10% of time) to 0 (answered at time limit)
- An incorrect or unanswered question earns 0 points

### 4.3 Question Flow Control
- Only the host controls question advancement; participants cannot skip or go back
- All participants see the same question simultaneously
- Question transitions are synchronized in real time across all connected clients

### 4.4 Session Lifecycle
- States: Lobby → In Progress → Ended
- Once a session ends, the room code is invalidated and no new participants can join
- If the host disconnects mid-game, the session is paused and resumes upon reconnection within 60 seconds; otherwise the session is terminated

### 4.5 Nickname Uniqueness
- Within a session, duplicate nicknames are not allowed; the participant is prompted to choose a different name

---

## 5. Exceptions & Edge Cases

| Scenario | Handling |
|---|---|
| Participant enters an invalid or expired room code | Display error: 「Invalid or expired room code. Please check and try again.」 |
| Participant joins after the game has already started | Display message: 「This session is already in progress. You cannot join at this time.」 |
| Participant disconnects mid-game | Their submitted answers up to that point are retained; missing answers score 0 |
| Host tries to start with 0 participants | Start Game button remains disabled; display hint: 「Waiting for at least 1 participant to join.」 |
| Quiz has no questions when host tries to start | Display error: 「Please add at least 1 question before starting.」 |
| Timer expires with no answer submitted | Question auto-advances; participant scores 0 for that question |
| Two participants attempt the same nickname | Second participant is prompted to choose a different nickname before joining |

---

## 6. Acceptance Criteria

- A host can create a quiz with at least 1 question and start a session with a generated room code
- A participant can join a session using a valid room code and a unique nickname
- Questions are displayed simultaneously to all participants and the host in real time
- The countdown timer functions correctly and auto-advances the question on expiry
- Participant answers are locked after submission and cannot be changed
- Scores are calculated correctly based on correctness and answer speed
- The leaderboard displays all participants ranked by total score at the end of the game
- Invalid room codes and duplicate nicknames are handled with appropriate error messages
- Session state transitions (Lobby → In Progress → Ended) are enforced correctly

---

## 7. Out of Scope (This Release)

- User accounts, authentication, or login
- Saving or reusing quizzes across sessions
- Image or media attachments on questions
- Team/group play mode
- Admin dashboard or analytics
- Mobile native app