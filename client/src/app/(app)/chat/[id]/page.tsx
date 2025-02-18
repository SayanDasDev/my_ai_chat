"use client";
import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Copy, Edit, RefreshCcw, StopCircle } from "lucide-react";
import React from "react";

function ChatPage() {
  const messages = [
    {
      id: 1,
      prompt: "Help me with my essay.",
      response:
        "Do it yourself. It's important to develop your own writing skills and critical thinking abilities. However, I can provide some guidance and tips to help you get started.",
    },
    {
      id: 2,
      prompt: "What is the capital of France?",
      response:
        "The capital of France is Paris. It is known for its rich history, culture, and landmarks such as the Eiffel Tower, Notre-Dame Cathedral, and the Louvre Museum.",
    },
    {
      id: 3,
      prompt: "How do I cook pasta?",
      response:
        "To cook pasta, bring a large pot of salted water to a boil. Add the pasta and cook according to the package instructions, usually 8-12 minutes, until al dente. Drain the pasta and serve with your favorite sauce.",
    },
    {
      id: 4,
      prompt: "Explain the theory of relativity.",
      response:
        "The theory of relativity, developed by Albert Einstein, consists of two parts: special relativity and general relativity. Special relativity deals with the relationship between space and time, while general relativity explains how gravity affects the fabric of space-time.",
    },
    {
      id: 5,
      prompt: "What is the meaning of life?",
      response:
        "The meaning of life is a philosophical question that has been debated for centuries. Different cultures, religions, and individuals have their own interpretations. Some believe it is to seek happiness, others to fulfill a purpose, and some to contribute to the greater good.",
    },
    {
      id: 6,
      prompt: "How do I improve my coding skills?",
      response:
        "To improve your coding skills, practice regularly, work on real-world projects, read documentation and books, participate in coding challenges, and seek feedback from experienced developers. Joining a coding community can also be beneficial.",
    },
    {
      id: 7,
      prompt: "What are the benefits of meditation?",
      response:
        "Meditation offers numerous benefits, including reduced stress, improved focus, increased self-awareness, better emotional health, and enhanced overall well-being. Regular practice can lead to long-term positive effects on both the mind and body.",
    },
    {
      id: 8,
      prompt: "How do I start a business?",
      response:
        "Starting a business involves several steps: identifying a viable business idea, conducting market research, creating a business plan, securing funding, registering your business, and developing a marketing strategy. It's important to stay adaptable and continuously learn from your experiences.",
    },
    {
      id: 9,
      prompt: "What is quantum computing?",
      response:
        "Quantum computing is a type of computing that leverages the principles of quantum mechanics to process information. Unlike classical computers, which use bits to represent data as 0s or 1s, quantum computers use qubits, which can represent both 0 and 1 simultaneously, allowing for more complex computations.",
    },
    {
      id: 10,
      prompt: "How do I stay motivated?",
      response:
        "Staying motivated involves setting clear goals, breaking tasks into manageable steps, celebrating small achievements, maintaining a positive mindset, and seeking support from others. It's also important to find activities that you enjoy and align with your values.",
    },
    {
      id: 11,
      prompt: "What is the best way to learn a new language?",
      response:
        "The best way to learn a new language is through immersion, consistent practice, and exposure to native speakers. Utilize language learning apps, take classes, watch movies, read books, and engage in conversations to reinforce your skills.",
    },
    {
      id: 12,
      prompt: "What are the symptoms of COVID-19?",
      response:
        "Common symptoms of COVID-19 include fever, cough, shortness of breath, fatigue, body aches, loss of taste or smell, sore throat, and congestion. If you experience any of these symptoms, it's important to get tested and follow public health guidelines.",
    },
    {
      id: 13,
      prompt: "How do I manage stress?",
      response:
        "Managing stress involves identifying stressors, practicing relaxation techniques, maintaining a healthy lifestyle, seeking social support, and developing effective coping strategies. Activities such as exercise, meditation, and hobbies can help reduce stress levels.",
    },
    {
      id: 14,
      prompt: "What is artificial intelligence?",
      response:
        "Artificial intelligence (AI) refers to the simulation of human intelligence in machines. AI systems can perform tasks such as learning, reasoning, problem-solving, and decision-making. AI is used in various applications, including natural language processing, computer vision, and robotics.",
    },
    {
      id: 15,
      prompt: "How do I create a budget?",
      response:
        "To create a budget, start by tracking your income and expenses. Categorize your spending, set financial goals, allocate funds to each category, and monitor your progress. Adjust your budget as needed to stay on track and achieve your financial objectives.",
    },
    {
      id: 16,
      prompt: "What is the importance of exercise?",
      response:
        "Exercise is important for maintaining physical and mental health. It helps improve cardiovascular health, strengthen muscles, enhance flexibility, boost mood, reduce stress, and promote overall well-being. Regular physical activity is essential for a healthy lifestyle.",
    },
    {
      id: 17,
      prompt: "How do I write a resume?",
      response:
        "To write a resume, start with a clear and concise format. Include your contact information, a summary or objective, work experience, education, skills, and any relevant certifications or achievements. Tailor your resume to the job you're applying for and highlight your most relevant qualifications.",
    },
    {
      id: 18,
      prompt: "What are the benefits of reading?",
      response:
        "Reading offers numerous benefits, including improved cognitive function, increased knowledge, enhanced vocabulary, better focus and concentration, and reduced stress. Reading regularly can also stimulate creativity and provide a sense of relaxation and enjoyment.",
    },
    {
      id: 19,
      prompt: "How do I save money?",
      response:
        "To save money, create a budget, track your spending, set savings goals, reduce unnecessary expenses, and find ways to increase your income. Automate your savings by setting up automatic transfers to a savings account and regularly review your financial progress.",
    },
    {
      id: 20,
      prompt: "What is the best way to study for exams?",
      response:
        "The best way to study for exams is to create a study schedule, break down the material into manageable sections, use active learning techniques, take regular breaks, and practice past exam questions. Stay organized, get enough rest, and seek help if needed to ensure effective preparation.",
    },
  ];

  const responseActionIcons = [
    { icon: Copy, type: "Copy" },
    { icon: RefreshCcw, type: "Regenerate" },
  ];
  const promptActionIcons = [
    { icon: Edit, type: "Edit" },
    { icon: StopCircle, type: "Stop" },
  ];

  return (
    <>
      <ChatMessageList className="">
        {messages.map((message, index) => {
          return (
            <React.Fragment key={message.id}>
              <ChatBubble variant="sent">
                <ChatBubbleAvatar fallback="US" />
                <ChatBubbleMessage
                  className="bg-muted text-foreground"
                  variant="sent"
                >
                  {message.prompt}
                </ChatBubbleMessage>
                <ChatBubbleActionWrapper>
                  {promptActionIcons.map(({ icon: Icon, type }) => (
                    <ChatBubbleAction
                      className="size-7"
                      key={type}
                      icon={<Icon className="size-4" />}
                      onClick={() =>
                        console.log(
                          "Action " + type + " clicked for message " + index
                        )
                      }
                    />
                  ))}
                </ChatBubbleActionWrapper>
              </ChatBubble>
              <ChatBubble layout="ai">
                <ChatBubbleAvatar fallback={"AI"} />
                <ChatBubbleMessage>
                  {message.response}

                  <div className="mt-2">
                    {responseActionIcons.map(({ icon: Icon, type }) => (
                      <ChatBubbleAction
                        className="size-6"
                        key={type}
                        icon={<Icon className="size-3" />}
                        onClick={() =>
                          console.log(
                            "Action " + type + " clicked for message " + index
                          )
                        }
                      />
                    ))}
                  </div>
                </ChatBubbleMessage>
              </ChatBubble>
            </React.Fragment>
          );
        })}
      </ChatMessageList>
    </>
  );
}

export default ChatPage;
