/**
 * Game challenge data types and content
 */

export interface Challenge {
  id: string | number;
  title: string;
  lighter: string;
  base: string;
  harder: string;
}

export interface Level {
  id: string;
  title: string;
  description: string;
  challenges: Challenge[];
}

export const challengeData: { levels: Level[] } = {
  levels: [
    {
      id: "1",
      title: "The Connector",
      description: "",
      challenges: [
        {
          id: "1-1",
          title: "The Digital Contributor",
          lighter:
            "Add an emoji reaction to a group announcement or team thread.",
          base: "Reply to a non-urgent group thread with a short, supportive comment (e.g., \"Sounds great!\").",
          harder:
            "Share a relevant article, link, or brief observation with a group chat.",
        },
        {
          id: "1-2",
          title: "The Meeting Participant",
          lighter:
            "Visibly nod or smile in agreement while someone else is speaking during a meeting.",
          base: "Ask a single, brief clarifying question during the Q&A segment of a meeting.",
          harder:
            "Volunteer a short opinion or idea when the floor is open to the group.",
        },
        {
          id: "1-3",
          title: "The Communal Break",
          lighter:
            "Sit at a communal table in the breakroom/cafeteria while others are present, even if you just listen.",
          base: "Sit at the communal table and ask a general, low-stakes question to the group (e.g., \"Has anyone tried the new cafe?\").",
          harder:
            "Join a group on a break and actively share a brief, casual anecdote or observation.",
        },
        {
          id: "1-4",
          title: "The Social RSVP",
          lighter:
            "RSVP \"Yes\" to an upcoming optional social event and block the time out on your calendar.",
          base: "Attend an optional social gathering and commit to staying for exactly 15 minutes before giving yourself permission to leave.",
          harder:
            "Attend the social gathering, stay for at least 30 minutes, and initiate a conversation with one person.",
        },
        {
          id: "1-5",
          title: "The Networker",
          lighter:
            "Send a follow-up message or connection request to someone you met briefly at a gathering.",
          base: "Approach a small, open group of 2-3 people at an event and ask if you can join them.",
          harder:
            "Introduce two colleagues or acquaintances to each other at a work or social event.",
        },
      ],
    },
    {
      id: "2",
      title: "The Explorer",
      description: "",
      challenges: [
        {
          id: "2-1",
          title: "The Digital Icebreaker",
          lighter:
            "React to a colleague's message in a group chat using an emoji.",
          base: "Send a simple, friendly text greeting (e.g., \"Good morning!\") to a team chat or a specific colleague.",
          harder:
            "Ask a simple, non-urgent, work-related question via chat to initiate a brief back-and-forth.",
        },
        {
          id: "2-2",
          title: "The Passing Greeting",
          lighter:
            "Make brief eye contact and smile at someone while walking in the hallway or street.",
          base: "Say a quick, general greeting like \"Hi\" or \"Morning\" when walking past a colleague.",
          harder:
            "Say \"Hi, [Name]\" using the person's specific name when passing them.",
        },
        {
          id: "2-3",
          title: "The Meeting Warm-Up",
          lighter:
            "Join a virtual or physical meeting one minute early and simply listen to the casual chatter.",
          base: "Join the meeting early and say a general \"Hello everyone\" as you enter the space.",
          harder:
            "Join early and verbally agree with someone's small-talk observation (e.g., \"Yes, it is really cold today\").",
        },
        {
          id: "2-4",
          title: "The Communal Space",
          lighter:
            "Go to the breakroom/kitchen when only one other person is there and prepare a drink silently.",
          base: "Go to the breakroom and ask a simple, context-based question (e.g., \"Is the coffee pot fresh?\").",
          harder:
            "Offer a small, genuine compliment to the person in the breakroom (e.g., \"I really like your mug\").",
        },
        {
          id: "2-5",
          title: "The Casual Check-In",
          lighter:
            "Answer the question \"How was your weekend?\" with a complete, one-sentence reply.",
          base: "Proactively ask one colleague, \"How was your weekend?\" on a Monday morning.",
          harder:
            "Ask about their weekend and follow up with one related question based on their answer to sustain the chat.",
        },
      ],
    },
    {
      id: "3",
      title: "The Observer",
      description:
        "Break the cycle of avoidance by establishing safety through mere presence and observation before demanding any real-time interaction.",
      challenges: [
        {
          id: "3-1",
          title: "Safe Observation",
          lighter: "Read a company or university update without reacting.",
          base: "Log into a shared communication channel (like Slack/Teams) and read 3 recent casual messages.",
          harder:
            "Read the messages and add a simple \"thumbs up\" emoji to an impersonal announcement.",
        },
        {
          id: "3-2",
          title: "Physical Presence",
          lighter:
            "Walk past a communal area (like a breakroom or cafe) without stopping.",
          base: "Enter a communal area when it is mostly empty and stay for exactly 1 minute.",
          harder:
            "Get a drink from the communal area when 1 or 2 busy people are there, then leave immediately.",
        },
        {
          id: "3-3",
          title: "Non-Verbal Contact",
          lighter:
            "Look up from your phone/desk and make fleeting eye contact with a passerby.",
          base: "Make eye contact and give a slight, closed-mouth smile or small nod to someone walking past.",
          harder:
            "Smile and give a small, non-verbal wave to someone you recognize from afar.",
        },
        {
          id: "3-4",
          title: "Asynchronous Thanks",
          lighter:
            "Draft a simple \"Thank you\" message for a colleague, but save it to drafts for an hour before sending.",
          base: "Send a simple, text-based \"Thank you\" or an appreciative emoji to someone who helped you with a task.",
          harder:
            "Send a short \"Have a good weekend\" message to a single teammate on a Friday afternoon.",
        },
        {
          id: "3-5",
          title: "The Scripted Question",
          lighter:
            "Write down a specific, work-related question you need answered and read it to yourself.",
          base: "Walk up to a colleague, ask that specific, predetermined question, say \"thanks,\" and leave.",
          harder:
            "Ask the predetermined question, listen to the answer, and reply with one brief follow-up statement (e.g., \"Ah, that makes sense\").",
        },
      ],
    },
  ],
};
