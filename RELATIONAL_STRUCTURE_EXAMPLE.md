# React Learning and Topics Relational Structure

## Overview

The application now uses a **one-directional relationship** between `react-learning` and `react-topics`:

- **react-learning**: Contains learning modules/sections that reference topic IDs
- **react-topics**: Contains individual topics with their content and MCQs
- **Relationship**: `react-learning` → `react-topics` (one-directional)

## Example Data Structure

### 1. Create Topics First

```bash
# POST /react-topics
{
  "topicId": "what-is-react",
  "title": "What is React?",
  "description": "Difference from Angular, React philosophy",
  "estimatedTime": "30 min",
  "htmlContent": "<h1>What is React?</h1><p>React is a JavaScript library...</p>",
  "mcqContent": [
    {
      "question": "What is React primarily used for?",
      "options": [
        "Building user interfaces",
        "Managing application state",
        "Handling user input",
        "All of the above"
      ],
      "correctAnswer": "Building user interfaces"
    },
    {
      "question": "Which company developed React?",
      "options": [
        "Google",
        "Facebook",
        "Twitter",
        "Microsoft"
      ],
      "correctAnswer": "Facebook"
    }
  ],
  "isCompleted": false
}
```

**Response:**
```json
{
  "_id": "67111111111111111111111a",
  "topicId": "what-is-react",
  "title": "What is React?",
  "description": "Difference from Angular, React philosophy",
  "estimatedTime": "30 min",
  "htmlContent": "<h1>What is React?</h1><p>React is a JavaScript library...</p>",
  "mcqContent": [...],
  "isCompleted": false,
  "createdAt": "2024-10-17T10:00:00.000Z",
  "updatedAt": "2024-10-17T10:00:00.000Z"
}
```

### 2. Create Learning Section with Topic References

```bash
# POST /react-learning
{
  "level": "Beginner",
  "title": "React Basics",
  "emoji": "🟢",
  "description": "Foundation Stage — Understand React's core building blocks and component-driven mindset",
  "color": "green",
  "gradient": "from-green-400 to-emerald-500",
  "topicIds": ["67111111111111111111111a"]
}
```

**Response:**
```json
{
  "_id": "67111111111111111111111b",
  "level": "Beginner",
  "title": "React Basics",
  "emoji": "🟢",
  "description": "Foundation Stage — Understand React's core building blocks and component-driven mindset",
  "color": "green",
  "gradient": "from-green-400 to-emerald-500",
  "topicIds": ["67111111111111111111111a"],
  "createdAt": "2024-10-17T10:00:00.000Z",
  "updatedAt": "2024-10-17T10:00:00.000Z"
}
```

## API Endpoints

### React Learning Endpoints

- `GET /react-learning` - Get all learning sections
- `GET /react-learning/level/Beginner` - Get sections by level
- `GET /react-learning/:id` - Get section by MongoDB ID
- `GET /react-learning/:id/with-topics` - Get section with populated topics
- `POST /react-learning/:id/topics/:topicId` - Add topic to section
- `DELETE /react-learning/:id/topics/:topicId` - Remove topic from section

### React Topics Endpoints

- `GET /react-topics` - Get all topics
- `GET /react-topics?ids=id1,id2,id3` - Get multiple topics by IDs
- `GET /react-topics/topic/what-is-react` - Get topic by topicId
- `PATCH /react-topics/:id/complete` - Mark topic as completed
- `PATCH /react-topics/:id/incomplete` - Mark topic as incomplete

## Usage Examples

### Get Complete Learning Section with Topics

```bash
GET /react-learning/67111111111111111111111b/with-topics
```

**Response:**
```json
{
  "_id": "67111111111111111111111b",
  "level": "Beginner",
  "title": "React Basics",
  "emoji": "🟢",
  "description": "Foundation Stage — Understand React's core building blocks and component-driven mindset",
  "color": "green",
  "gradient": "from-green-400 to-emerald-500",
  "topicIds": ["67111111111111111111111a"],
  "topics": [
    {
      "_id": "67111111111111111111111a",
      "topicId": "what-is-react",
      "title": "What is React?",
      "description": "Difference from Angular, React philosophy",
      "estimatedTime": "30 min",
      "htmlContent": "<h1>What is React?</h1><p>React is a JavaScript library...</p>",
      "mcqContent": [...],
      "isCompleted": false,
      "createdAt": "2024-10-17T10:00:00.000Z",
      "updatedAt": "2024-10-17T10:00:00.000Z"
    }
  ],
  "createdAt": "2024-10-17T10:00:00.000Z",
  "updatedAt": "2024-10-17T10:00:00.000Z"
}
```

### Add Topic to Section

```bash
POST /react-learning/67111111111111111111111b/topics/67111111111111111111111c
```

### Get Multiple Topics by IDs

```bash
GET /react-topics?ids=67111111111111111111111a,67111111111111111111111c
```

## Key Benefits

1. **Separation of Concerns**: Topics are independent and can be reused across sections
2. **Flexible Relationships**: Easy to add/remove topics from learning sections
3. **Scalable**: Topics can exist without being part of any section
4. **One-Directional**: Clean architecture where sections know about topics, but not vice versa
5. **Easy to Query**: Can get sections with or without topic details as needed

## Migration Notes

If you have existing data, you would need to:
1. Create separate topic documents in the `react-topics` collection
2. Update learning sections to reference topic `_id`s instead of embedded topics
3. Remove the embedded topic structure from learning documents