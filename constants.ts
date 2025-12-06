

import { VocabWord, DialogueLine, QuizQuestion, FillBlankData, AssessmentQuestion, BubbleQuestion, WheelSegment, WheelQuestion } from './types';

export const VOCAB_LIST: VocabWord[] = [
  { id: 1, word: 'Address', ipa: '/ˈæd.res/', meaning: 'Địa chỉ' },
  { id: 2, word: 'Lane', ipa: '/leɪn/', meaning: 'Ngõ, làn đường nhỏ' },
  { id: 3, word: 'Tower', ipa: '/ˈtaʊ.ər/', meaning: 'Tháp' },
  { id: 4, word: 'Like', ipa: '/laɪk/', meaning: 'Thích / Như thế nào' },
  { id: 5, word: 'Quiet', ipa: '/ˈkwaɪ.ət/', meaning: 'Yên tĩnh' },
  { id: 6, word: 'Crowded', ipa: '/ˈkraʊ.dɪd/', meaning: 'Đông đúc' },
  { id: 7, word: 'Pretty', ipa: '/ˈprɪt.i/', meaning: 'Xinh đẹp / Khá là' },
  { id: 8, word: 'Busy', ipa: '/ˈbɪz.i/', meaning: 'Bận rộn / Nhộn nhịp' },
  { id: 9, word: 'City', ipa: '/ˈsɪt.i/', meaning: 'Thành phố' },
  { id: 10, word: 'Village', ipa: '/ˈvɪl.ɪdʒ/', meaning: 'Làng' },
  { id: 11, word: 'Mountains', ipa: '/ˈmaʊn.tɪnz/', meaning: 'Núi' },
];

export const DIALOGUE_SCRIPT: DialogueLine[] = [
  { id: 1, speaker: 'Mai', text: 'Hi, Nam! Nice to see you again.', translation: 'Chào Nam! Rất vui được gặp lại bạn.' },
  { id: 2, speaker: 'Nam', text: 'Hi, Mai. Nice to see you, too. Mai, this is Trung. He’s a new pupil in our class.', translation: 'Chào Mai. Mình cũng rất vui được gặp bạn. Mai, đây là Trung. Bạn ấy là học sinh mới của lớp mình.' },
  { id: 3, speaker: 'Mai', text: 'Hello, Trung. Nice to meet you.', translation: 'Chào Trung. Rất vui được gặp bạn.' },
  { id: 4, speaker: 'Trung', text: 'Nice to meet you, too.', translation: 'Mình cũng rất vui được gặp bạn.' },
  { id: 5, speaker: 'Mai', text: 'Where are you from, Trung?', translation: 'Bạn đến từ đâu vậy Trung?' },
  { id: 6, speaker: 'Trung', text: 'I’m from Da Nang. But now I live with my grandparents in Ha Noi.', translation: 'Mình đến từ Đà Nẵng. Nhưng bây giờ mình sống cùng ông bà ở Hà Nội.' },
  { id: 7, speaker: 'Mai', text: 'What’s your address in Ha Noi?', translation: 'Địa chỉ của bạn ở Hà Nội là gì?' },
  { id: 8, speaker: 'Trung', text: 'It’s 81, Tran Hung Dao Street. Where do you live?', translation: 'Là số 81, đường Trần Hưng Đạo. Bạn sống ở đâu?' },
  { id: 9, speaker: 'Mai', text: 'I live in Flat 18 on the second floor of Ha Noi Tower.', translation: 'Mình sống ở Căn hộ 18 tầng 2 của Tháp Hà Nội.' },
];

export const MINER_QUESTIONS: QuizQuestion[] = [
  { id: 1, question: "What’s your address?", answer: "It’s 36 Thanh Hoa City", options: ["It's 36 Thanh Hoa City", "I live in a village", "Yes, I do"], correctFeedback: "Correct! We use 'It's...' for addresses." },
  { id: 2, question: "Where are you from?", answer: "I'm from Korea", options: ["I'm from Korea", "It's big", "He is new"], correctFeedback: "Good job! 'I'm from...' tells the country/place." },
  { id: 3, question: "Where do you live?", answer: "I live in Nam Dinh", options: ["I live in Nam Dinh", "It is pretty", "Address is 10"], correctFeedback: "Excellent! 'I live in...' + place." },
  { id: 4, question: "What is the city like?", answer: "It's big and busy", options: ["It's big and busy", "I live there", "It's 12 street"], correctFeedback: "Right! Describe the city with adjectives." },
];

export const FILL_BLANK_DATA: FillBlankData = {
  fullText: "Trung is a new pupil in Class 5B. He is from Da Nang. Now he lives with his grandparents in Ha Noi. His address is 81, Tran Hung Dao Street, Hoan Kiem District.",
  translation: "Trung là học sinh mới lớp 5B. Cậu ấy đến từ Đà Nẵng. Bây giờ cậu ấy sống cùng ông bà ở Hà Nội. Địa chỉ của cậu ấy là 81, đường Trần Hưng Đạo, quận Hoàn Kiếm.",
  wordBank: ["from", "lives", "address", "Street"],
  segments: [
    { id: 1, text: "Trung is a new pupil in Class 5B. He is ", isBlank: false },
    { id: 2, text: "", isBlank: true, correctWord: "from" },
    { id: 3, text: " Da Nang. Now he ", isBlank: false },
    { id: 4, text: "", isBlank: true, correctWord: "lives" },
    { id: 5, text: " with his grandparents in Ha Noi. His ", isBlank: false },
    { id: 6, text: "", isBlank: true, correctWord: "address" },
    { id: 7, text: " is 81, Tran Hung Dao ", isBlank: false },
    { id: 8, text: "", isBlank: true, correctWord: "Street" },
    { id: 9, text: ", Hoan Kiem District.", isBlank: false },
  ]
};

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // PART 1: VOCABULARY (10 Questions)
  {
    id: 1,
    part: 1,
    question: "Choose the word meaning 'Địa chỉ':",
    options: ["Village", "Address", "Tower", "Lane"],
    correctAnswer: "Address",
    explanation: "'Address' nghĩa là địa chỉ."
  },
  {
    id: 2,
    part: 1,
    question: "Choose the word meaning 'Đông đúc':",
    options: ["Quiet", "Pretty", "Crowded", "Far"],
    correctAnswer: "Crowded",
    explanation: "'Crowded' nghĩa là đông đúc. 'Quiet' là yên tĩnh."
  },
  {
    id: 3,
    part: 1,
    question: "Choose the word with different part of speech (Tìm từ khác loại):",
    options: ["City", "Village", "Mountain", "Live"],
    correctAnswer: "Live",
    explanation: "'Live' là động từ (sống), các từ còn lại là danh từ chỉ địa điểm."
  },
  {
    id: 4,
    part: 1,
    question: "Odd one out (Tìm từ khác loại):",
    options: ["Pretty", "Lane", "Quiet", "Busy"],
    correctAnswer: "Lane",
    explanation: "'Lane' (ngõ) là danh từ. Pretty, Quiet, Busy là tính từ."
  },
  {
    id: 5,
    part: 1,
    question: "What does 'Tower' mean?",
    options: ["Thị trấn", "Làng quê", "Tháp / Tòa nhà cao", "Con đường"],
    correctAnswer: "Tháp / Tòa nhà cao",
    explanation: "'Tower' nghĩa là tháp hoặc tòa nhà cao tầng."
  },
  {
    id: 6,
    part: 1,
    question: "The city is very big and ________.",
    options: ["busy", "address", "floor", "who"],
    correctAnswer: "busy",
    explanation: "Dùng tính từ 'busy' (bận rộn/nhộn nhịp) để miêu tả thành phố."
  },
  {
    id: 7,
    part: 1,
    question: "My grandparents live in a small ________ in the mountains.",
    options: ["tower", "village", "floor", "island"],
    correctAnswer: "village",
    explanation: "Ở miền núi (mountains) thì thường sống trong 'village' (làng/bản)."
  },
  {
    id: 8,
    part: 1,
    question: "Choose the correct spelling:",
    options: ["Moutain", "Mountian", "Mountain", "Mountein"],
    correctAnswer: "Mountain",
    explanation: "Chính tả đúng là 'Mountain' (Núi)."
  },
  {
    id: 9,
    part: 1,
    question: "Opposite of 'Noisy' (Trái nghĩa với Ồn ào):",
    options: ["Quiet", "Busy", "Crowded", "Large"],
    correctAnswer: "Quiet",
    explanation: "'Quiet' (yên tĩnh) trái nghĩa với 'Noisy' (ồn ào)."
  },
  {
    id: 10,
    part: 1,
    question: "His address is 97, Nguyen Du ________.",
    options: ["Village", "City", "Street", "Tower"],
    correctAnswer: "Street",
    explanation: "Sau tên đường (Nguyen Du) thường là 'Street'."
  },

  // PART 2: GRAMMAR & SENTENCES (10 Questions)
  {
    id: 11,
    part: 2,
    question: "What's your ________?",
    options: ["name", "address", "live", "from"],
    correctAnswer: "address",
    explanation: "Câu hỏi địa chỉ: 'What's your address?'"
  },
  {
    id: 12,
    part: 2,
    question: "Where ________ she live?",
    options: ["do", "is", "does", "are"],
    correctAnswer: "does",
    explanation: "Chủ ngữ 'she' (ngôi 3 số ít) đi với trợ động từ 'does'."
  },
  {
    id: 13,
    part: 2,
    question: "She lives ________ Flat 18, Ha Noi Tower.",
    options: ["in", "on", "at", "from"],
    correctAnswer: "in",
    explanation: "Dùng 'in' với căn hộ (in Flat 18)."
  },
  {
    id: 14,
    part: 2,
    question: "He lives ________ 81, Tran Hung Dao Street.",
    options: ["in", "on", "at", "with"],
    correctAnswer: "at",
    explanation: "Dùng 'at' với số nhà cụ thể (at 81...)."
  },
  {
    id: 15,
    part: 2,
    question: "What is the village like? - It's ________ and quiet.",
    options: ["pretty", "crowded", "address", "tower"],
    correctAnswer: "pretty",
    explanation: "'Pretty' (xinh đẹp) hợp ngữ cảnh miêu tả làng quê yên tĩnh."
  },
  {
    id: 16,
    part: 2,
    question: "He lives ________ the second floor.",
    options: ["in", "at", "on", "of"],
    correctAnswer: "on",
    explanation: "Dùng 'on' cho tầng lầu (on the second floor)."
  },
  {
    id: 17,
    part: 2,
    question: "Who do you live ________?",
    options: ["in", "with", "at", "on"],
    correctAnswer: "with",
    explanation: "'Live with' nghĩa là sống cùng với ai."
  },
  {
    id: 18,
    part: 2,
    question: "Is the city crowded? - Yes, ________.",
    options: ["it is", "it does", "he is", "they are"],
    correctAnswer: "it is",
    explanation: "Câu hỏi 'Is the city...?' trả lời là 'Yes, it is'."
  },
  {
    id: 19,
    part: 2,
    question: "Where is she from? - She ________ from Da Nang.",
    options: ["lives", "is", "come", "are"],
    correctAnswer: "is",
    explanation: "Cấu trúc: She is from [Place]."
  },
  {
    id: 20,
    part: 2,
    question: "Reorder: like / What / island / is / the / ?",
    options: [
      "What is the island like?",
      "What the is island like?",
      "What is island the like?",
      "Like is the island what?"
    ],
    correctAnswer: "What is the island like?",
    explanation: "Trật tự đúng: Wh-word + to be + Subject + like?"
  }
];

export const BUBBLE_QUESTIONS: BubbleQuestion[] = [
  { id: 1, question: "It is crowded and busy.", correct: "City", wrong: ["Village", "Mountain", "Lane"] },
  { id: 2, question: "A very high place.", correct: "Mountain", wrong: ["River", "Sea", "Flat"] },
  { id: 3, question: "A small road.", correct: "Lane", wrong: ["Tower", "City", "Floor"] },
  { id: 4, question: "A tall building.", correct: "Tower", wrong: ["House", "Village", "Room"] },
  { id: 5, question: "Not noisy.", correct: "Quiet", wrong: ["Busy", "Crowded", "Loud"] },
  { id: 6, question: "Where do you live?", correct: "Address", wrong: ["Name", "School", "Class"] },
  { id: 7, question: "Opposite of Ugly", correct: "Pretty", wrong: ["Bad", "Sad", "Old"] },
  { id: 8, question: "Lots of people.", correct: "Crowded", wrong: ["Quiet", "Small", "Empty"] },
];

export const WHEEL_SEGMENTS: WheelSegment[] = [
  { id: 'chatgpt', label: 'Chat GPT', color: '#10A37F', textColor: '#FFFFFF' },
  { id: 'gemini', label: 'Gemini', color: '#1E88E5', textColor: '#FFFFFF' },
  { id: 'grok', label: 'Grok', color: '#333333', textColor: '#FFFFFF' },
  { id: 'perplexity', label: 'Perplexity', color: '#22B3A7', textColor: '#FFFFFF' }, // Replaced Deepseek
  { id: 'copilot', label: 'Copilot', color: '#F97316', textColor: '#FFFFFF' },
  { id: 'claude', label: 'Claude', color: '#D97706', textColor: '#FFFFFF' },
];

export const WHEEL_QUESTIONS: WheelQuestion[] = [
  { id: 1, question: "Where _____ you from?", options: ["are", "is", "am"], correctAnswer: "are" },
  { id: 2, question: "I live _____ 20 Tran Hung Dao St.", options: ["in", "at", "on"], correctAnswer: "at" },
  { id: 3, question: "What is the village _____?", options: ["like", "likes", "love"], correctAnswer: "like" },
  { id: 4, question: "The city is big and _____.", options: ["busy", "address", "who"], correctAnswer: "busy" },
  { id: 5, question: "Who do you live _____?", options: ["with", "to", "at"], correctAnswer: "with" },
  { id: 6, question: "It's _____ 18, second floor.", options: ["Flat", "Village", "Lane"], correctAnswer: "Flat" },
  { id: 7, question: "Ha Noi is a big _____.", options: ["City", "Tower", "Lane"], correctAnswer: "City" },
  { id: 8, question: "Is the town quiet? - No, it _____.", options: ["isn't", "is", "aren't"], correctAnswer: "isn't" },
];