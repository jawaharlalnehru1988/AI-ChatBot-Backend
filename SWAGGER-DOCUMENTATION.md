# Swagger API Documentation

## 📚 **Access Swagger UI**

Once your server is running, you can access the interactive API documentation at:

```
http://localhost:4000/api
```

## 🎯 **What's Available in Swagger:**

### **System Design Endpoints:**

1. **POST /systemdesign** - Create a new system design topic
2. **GET /systemdesign** - Get all system design topics
3. **GET /systemdesign/search** - Search topics by keyword
4. **GET /systemdesign/category/{category}** - Get topics by category
5. **GET /systemdesign/section/{sectionLink}** - Get topic by section link
6. **GET /systemdesign/{id}** - Get topic by MongoDB ObjectId
7. **PATCH /systemdesign/{id}** - Update a topic
8. **DELETE /systemdesign/{id}** - Delete a topic

## ✨ **Swagger Features:**

- 📖 **Interactive Documentation** - Try out API endpoints directly from the browser
- 🔍 **Request/Response Examples** - See example data for all operations
- 📝 **Schema Definitions** - View complete data models
- 🎨 **Visual Interface** - Easy-to-navigate UI for all endpoints
- ✅ **Validation Rules** - See what fields are required and their formats
- 🧪 **Try It Out** - Execute API calls directly from documentation

## 🚀 **How to Use:**

1. Start your server:
   ```bash
   npm run start:dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:4000/api
   ```

3. Click on any endpoint to expand it

4. Click "Try it out" button

5. Fill in the required parameters

6. Click "Execute" to test the endpoint

7. View the response below

## 📋 **Example API Calls from Swagger:**

### Create a System Design Topic:
```json
{
  "title": "Microservices Architecture",
  "description": "Learn how to design and implement microservices",
  "imageUrl": "https://example.com/image.png",
  "category": "Architecture",
  "sectionLink": "microservices-architecture",
  "audioUrl": "https://example.com/audio.mp3",
  "content": "Detailed content here..."
}
```

### Search Topics:
Query Parameter: `q=architecture`

### Get by Category:
Path Parameter: `category=High-Level-Design`

### Get by Section Link:
Path Parameter: `sectionLink=from-requirements-to-architecture`

## 🔐 **Security:**

The API includes Bearer Authentication support in Swagger. If you add authentication to your endpoints, you can:

1. Click the "Authorize" button at the top
2. Enter your JWT token
3. All subsequent requests will include the authorization header

## 📊 **API Tags:**

- **systemdesign** - System Design CRUD operations
- **openai** - OpenAI ChatGPT integration with streaming
- **livekit** - LiveKit real-time communication

## 🎨 **Customization:**

The Swagger UI has been customized with:
- Custom title: "API Documentation"
- NestJS favicon
- Hidden top bar for cleaner look
- Organized by tags

## 📱 **Export Options:**

From Swagger UI, you can:
- Download the OpenAPI specification (JSON/YAML)
- Generate client SDKs for various languages
- Import into Postman or other API tools

---

**Happy API Testing! 🚀**
