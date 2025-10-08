# System Design API Test Examples

## Base URL
```
http://localhost:4000/systemdesign
```

## Test the API endpoints

### 1. Get all system designs
```bash
curl -X GET http://localhost:4000/systemdesign
```

### 2. Get by ID (replace with actual MongoDB ObjectId)
```bash
curl -X GET http://localhost:4000/systemdesign/652e1a8e0000000000000001
```

### 3. Get by category
```bash
curl -X GET "http://localhost:4000/systemdesign/category/High-Level-Design"
```

### 4. Get by section link
```bash
curl -X GET "http://localhost:4000/systemdesign/section/from-requirements-to-architecture"
```

### 5. Search system designs
```bash
curl -X GET "http://localhost:4000/systemdesign/search?q=architecture"
```

### 6. Create a new system design
```bash
curl -X POST http://localhost:4000/systemdesign \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Microservices Architecture",
    "description": "Learn how to design and implement microservices architecture",
    "imageUrl": "https://example.com/microservices.png",
    "category": "Architecture",
    "sectionLink": "microservices-architecture",
    "audioUrl": "https://example.com/microservices.mp3",
    "content": "Detailed content about microservices..."
  }'
```

### 7. Update a system design (replace ID with actual ObjectId)
```bash
curl -X PATCH http://localhost:4000/systemdesign/652e1a8e0000000000000001 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "description": "Updated description"
  }'
```

### 8. Delete a system design (replace ID with actual ObjectId)
```bash
curl -X DELETE http://localhost:4000/systemdesign/652e1a8e0000000000000001
```

## Sample JSON Response Format
```json
{
  "_id": "652e1a8e0000000000000001",
  "title": "From Requirements to Architecture",
  "description": "Learn how to design systems that can scale efficiently and handle high traffic loads.",
  "imageUrl": "https://res.cloudinary.com/dbmkctsda/image/upload/v1756956557/c937db99-2e3a-4173-ace3-626cea9956f8.png",
  "category": "High-Level-Design",
  "sectionLink": "from-requirements-to-architecture",
  "audioUrl": "https://raw.githubusercontent.com/jawaharlalnehru1988/bgsloka/master/assets/high%20level%20design/ep2%20-%20from%20requirements%20to%20architecture.mp3",
  "content": ""
}
```