# Requirements Document

## 1. Application Overview
- **Application Name:** QuizBlast
- **Description:** A Kahoot-style real-time quiz platform enhanced with deep personalization, full gamification, and enterprise-grade features. Hosts can create and run live quiz sessions with custom branding; participants join via room code and compete in real time with personalized avatars, backgrounds, and music — making QuizBlast the preferred choice for schools, companies, and event organizers over standard quiz tools.

---

## 2. Users & Use Cases
- **Target Users:** Quiz hosts (teachers, trainers, HR teams, event organizers, team leads, enterprise admins) and quiz participants (students, employees, event attendees, team members)
- **Core Use Cases:**
  - A host creates a fully branded quiz session with custom background, music, and branding, then controls question flow in real time
  - Participants join via room code, set up a personalized avatar and display name, and compete live
  - Both host and participants experience full gamification: streaks, badges, XP, animated reactions, and a dynamic leaderboard
  - Companies and organizations use QuizBlast for training assessments, team-building events, and live audience engagement

---

## 3. Page Structure & Core Features

### 3.1 Page Overview
```
QuizBlast
├── Home Page
├── Host Flow
│   ├── Create Quiz Page
│   ├── Session Customization Page (background, music, branding)
│   ├── Quiz Lobby Page (waiting room)
│   └── Host Game Page (question control + live results)
├── Participant Flow
│   ├── Join Page
│   ├── Avatar & Profile Setup Page
│   ├── Waiting Room Page
│   ├── Answer Page (per question)
│   └── Score Page (per question result)
├── Leaderboard Page (end of game)
└── Industry / Enterprise Landing Section (on Home Page)
```

### 3.2 Home Page
- Two primary entry points: **Host a Quiz** and **Join a Quiz**
- A dedicated section highlights enterprise and industry use cases (corporate training, HR onboarding, live events, education)
- Host a Quiz navigates to Create Quiz Page
- Join a Quiz navigates to Join Page

### 3.3 Create Quiz Page (Host)
- Host enters a quiz title and optional description
- Host adds one or more questions, each containing:
  - Question text
  - 2–4 answer options
  - Correct answer selection
  - Time limit per question (default: 20 seconds; options: 10s, 20s, 30s)
  - Optional point multiplier per question (1x, 2x, 3x) for bonus rounds
- Host can reorder, edit, or delete questions
- Host clicks **Customize Session** to proceed to Session Customization Page, or **Start Quiz** directly to skip customization

### 3.4 Session Customization Page (Host)
- **Personalized Background:** Host selects a background theme for the game interface from a preset library (e.g., space, nature, corporate, abstract); host may also upload a custom background image
- **Background Music:** Host selects background music from a preset playlist (e.g., upbeat, chill, corporate, silent); music plays during the lobby and question countdown phases
- **Session Branding:** Host can enter an organization or event name and upload a logo; branding is displayed on the lobby screen and leaderboard
- After customization, host proceeds to generate a unique 6-digit room code and enter the Quiz Lobby

### 3.5 Quiz Lobby Page (Host)
- Displays the room code prominently for participants to join
- Displays session branding (logo + organization name) if configured
- Shows a live list of participants who have joined, including their chosen avatars and nicknames
- Background music plays if configured
- Host clicks **Start Game** when ready; button is enabled only when at least 1 participant has joined

### 3.6 Join Page (Participant)
- Participant enters the 6-digit room code and a display nickname
- On valid submission, participant proceeds to Avatar & Profile Setup Page

### 3.7 Avatar & Profile Setup Page (Participant)
- **Personalized Avatar:** Participant selects or customizes an avatar from a preset library (character styles, colors, accessories)
- **Personalized Background:** Participant selects a personal card background theme that appears on their score card and leaderboard entry (preset options)
- Participant confirms their nickname (editable at this stage)
- On confirmation, participant is taken to the Waiting Room Page

### 3.8 Waiting Room Page (Participant)
- Displays the participant's avatar, nickname, and personal background
- Shows a live list of other joined participants with their avatars
- Background music (set by host) plays if configured
- Updates in real time when the host starts the game

### 3.9 Host Game Page
- Displays the current question text and all answer options
- Shows a countdown timer for the active question
- Shows the number of participants who have answered vs. total
- Displays a live mini-leaderboard (top 3 participants) updating in real time as answers come in
- After the timer expires or all participants answer, host clicks **Next Question** to advance
- After the last question, host clicks **Show Leaderboard**
- Session background and branding are visible throughout

### 3.10 Answer Page (Participant)
- Displays the current question text and answer options as large tappable buttons
- Countdown timer is visible
- Session background music continues
- Once an answer is selected, the button is locked and a waiting indicator is shown
- If the timer expires before answering, the question is marked as unanswered
- **Streak indicator** is shown: displays the participant's current correct-answer streak (e.g., 「3 in a row!」)

### 3.11 Score Page (Participant, shown after each question)
- Displays whether the participant's answer was correct or incorrect with an animated reaction
- Shows points earned for that question, including any streak bonus
- Shows the participant's current cumulative score and XP
- Displays any badge earned on this question (e.g., 「Speed Demon」 for fastest correct answer, 「On Fire」 for 5-streak)
- Shows the participant's current rank
- Automatically transitions to the next question when the host advances

### 3.12 Leaderboard Page
- Displays the final ranked list of all participants with their total scores, avatars, and personal backgrounds
- Animated podium reveal for top 3 participants
- Displays each participant's total XP, badges earned, and longest streak
- Host view includes a **Play Again** button (resets the session with the same quiz) and an **End Session** button
- Participant view shows their final rank, score, XP, and badges
- Session branding (logo + organization name) is displayed prominently

---

## 4. Business Rules & Logic

### 4.1 Room Code
- Room codes are unique 6-digit alphanumeric strings generated at quiz start
- A room code is active only while the session is in progress; it expires when the host ends the session

### 4.2 Scoring & Gamification
- A correct answer earns points based on answer speed: faster answers earn more points
- Base points for a correct answer: 1000 (multiplied by the question's point multiplier if set)
- Speed bonus: linearly decreases from 1000 (answered in first 10% of time) to 0 (answered at time limit)
- An incorrect or unanswered question earns 0 points
- **Streak Bonus:** Each consecutive correct answer adds a 10% bonus to the base score (capped at 50% bonus at 5+ streak)
- **XP System:** Participants earn XP equal to their total points; XP is displayed alongside score throughout the session
- **Badges:** Awarded in real time based on performance milestones:
  - 「Speed Demon」 — fastest correct answer in a round
  - 「On Fire」 — 5 consecutive correct answers
  - 「Comeback Kid」 — moved up 3+ ranks in a single question
  - 「Perfect Round」 — correct answer on every question
- Badges are displayed on the Score Page and Leaderboard Page

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

### 4.6 Personalization Scope
- Host-set background and music apply globally to the session interface visible on the host screen and lobby
- Participant-selected avatar and card background apply only to that participant's score card, leaderboard entry, and waiting room display
- Participant personalization does not override host session background on the main game view

### 4.7 Enterprise & Industry Use
- Session branding (logo + organization name) is supported for corporate and institutional hosts
- The platform is designed to support large participant counts per session (no hard cap enforced in MVP; system handles graceful degradation under load)
- No user accounts or authentication are required in this release; all sessions are ephemeral

---

## 5. Exceptions & Edge Cases

| Scenario | Handling |
|---|---|
| Participant enters an invalid or expired room code | Display error: 「Invalid or expired room code. Please check and try again.」 |
| Participant joins after the game has already started | Display message: 「This session is already in progress. You cannot join at this time.」 |
| Participant disconnects mid-game | Their submitted answers up to that point are retained; missing answers score 0; badges and XP earned are preserved |
| Host tries to start with 0 participants | Start Game button remains disabled; display hint: 「Waiting for at least 1 participant to join.」 |
| Quiz has no questions when host tries to start | Display error: 「Please add at least 1 question before starting.」 |
| Timer expires with no answer submitted | Question auto-advances; participant scores 0 and streak resets for that question |
| Two participants attempt the same nickname | Second participant is prompted to choose a different nickname before proceeding to avatar setup |
| Host uploads an unsupported background image format | Display error: 「Unsupported file format. Please upload a JPG or PNG image.」 |
| Background music fails to load | Session continues silently; no error is shown to participants |

---

## 6. Acceptance Criteria

- A host can create a quiz with at least 1 question, customize session background, music, and branding, and start a session with a generated room code
- A participant can join a session using a valid room code, set up a personalized avatar and card background, and enter with a unique nickname
- Questions are displayed simultaneously to all participants and the host in real time
- The countdown timer functions correctly and auto-advances the question on expiry
- Participant answers are locked after submission and cannot be changed
- Scores are calculated correctly based on correctness, answer speed, and streak bonuses
- Streak indicators and badges are awarded and displayed correctly on the Score Page
- XP totals are accumulated and displayed correctly throughout the session
- The leaderboard displays all participants ranked by total score, with avatars, badges, and XP visible
- Animated podium reveal functions correctly for top 3 participants
- Session branding (logo + organization name) is displayed on the lobby and leaderboard
- Invalid room codes and duplicate nicknames are handled with appropriate error messages
- Session state transitions (Lobby → In Progress → Ended) are enforced correctly
- Host-set background and music are applied consistently throughout the session
- Participant avatar and card background are displayed correctly on score cards and leaderboard entries

---

## 7. Out of Scope (This Release)

- User accounts, authentication, or login
- Saving or reusing quizzes across sessions
- Image or media attachments on questions
- Team/group play mode
- Admin dashboard or analytics
- Mobile native app
- Custom avatar creation beyond preset library selection
- Host uploading custom music tracks (preset library only)
- Multi-language localization
- API integrations with third-party LMS or HR platforms