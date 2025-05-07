# API Endpoints

## User API

### Create User
**POST** `/api/users`

**Payload:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "name": "John Doe",
  "bio": "Software developer",
  "profilePicture": "https://example.com/profile.jpg",
  "role": "<ROLE_ID>"
}
```

---

### Get All Users
**GET** `/api/users`

---

### Get User by ID
**GET** `/api/users/:id`

**URL Params:**
- `id`: User ID

---

### Update User
**PUT** `/api/users/:id`

**URL Params:**
- `id`: User ID

**Payload:**
```json
{
  "name": "John Updated",
  "bio": "Senior software developer",
  "profilePicture": "https://example.com/new.jpg"
}
```

---

### Delete User
**DELETE** `/api/users/:id`


### Get User's Blogs
**GET** `/api/users/:userId/blogs`

**URL Params:**
- `userId`: User ID

**Query:**
- `page` (number)
- `limit` (number)

---

### Get User's Bookmarks
**GET** `/api/users/:userId/bookmarks`

**Query:**
- `page` (number)
- `limit` (number)

---

### Get User's Drafts
**GET** `/api/users/:userId/drafts`

**Query:**
- `page` (number)
- `limit` (number)


## Role API

### Create Role
**POST** `/api/roles`

**Payload:**
```json
{
  "name": "Editor",
  "permissions": ["create_blog","edit_blog","review_blog"],
  "description": "..."
}
```

---

### Get All Roles
**GET** `/api/roles`

---

### Get Role by ID
**GET** `/api/roles/:id`

---

### Update Role
**PUT** `/api/roles/:id`

**Payload:**
```json
{ "permissions": ["..."], "description": "..." }
```

---

### Delete Role
**DELETE** `/api/roles/:id`


## Blog API

### Create Blog
**POST** `/api/blogs`

**Payload:**
```json
{
  "title": "My Blog",
  "content": "...",
  "summary": "...",
  "author": "<USER_ID>",
  "featuredImage": "...",
  "category": "...",
  "tags": ["tag1","tag2"]
}
```

---

### Get All Blogs
**GET** `/api/blogs`

**Query:**
- `page`, `limit`, `search`, `category`, `tag`

---

### Get Blog by ID
**GET** `/api/blogs/:id`

---

### Update Blog
**PUT** `/api/blogs/:id`

**Payload:**
```json
{ "title": "...", "content": "..." }
```

---

### Delete Blog
**DELETE** `/api/blogs/:id`

---

### Review Blog
**PUT** `/api/blogs/:id/review`

**Payload:**
```json
{ "status": "published", "reviewComments": "..." }
```

---

## Comment API

### Create Comment
**POST** `/api/blogs/:blogId/comments`

**Payload:**
```json
{ "content": "..." }
```

---

### Get Comments for Blog
**GET** `/api/blogs/:blogId/comments`

---

### Get Comment by ID
**GET** `/api/comments/:id`

---

### Update Comment
**PUT** `/api/comments/:id`

**Payload:**
```json
{ "content": "..." }
```

---

### Delete Comment
**DELETE** `/api/comments/:id`

---

### Reply to Comment
**POST** `/api/comments/:commentId/replies`

**Payload:**
```json
{ "content": "..." }
```

---

### Get Replies for Comment
**GET** `/api/comments/:commentId/replies`


## Like API

### Like a Blog
**POST** `/api/blogs/:blogId/like`

---

### Unlike a Blog
**DELETE** `/api/blogs/:blogId/like`

---

### Get Blog Likes
**GET** `/api/blogs/:blogId/likes`

---

### Like a Comment
**POST** `/api/comments/:commentId/like`

---

### Unlike a Comment
**DELETE** `/api/comments/:commentId/like`

---

### Get Comment Likes
**GET** `/api/comments/:commentId/likes`


## Bookmark API

### Bookmark a Blog
**POST** `/api/blogs/:blogId/bookmark`

---

### Remove Bookmark
**DELETE** `/api/blogs/:blogId/bookmark`


## Flag API

### Flag Content
**POST** `/api/flags`

**Payload:**
```json
{ "blogId": "<ID>", "reason": "spam","details":"..." }
```

---

### Get All Flags
**GET** `/api/flags`

**Query:**
- `page`, `limit`, `status`

---

### Get Flag by ID
**GET** `/api/flags/:id`

---

### Resolve Flag
**DELETE** `/api/flags/:id`

**Payload:**
```json
{ "reviewNotes": "..." }
```

## Draft API

### Create Draft
**POST** `/api/drafts`

**Payload:**
```json
{ "title":"...","content":"..." }
```

---

### Get Draft by ID
**GET** `/api/drafts/:id`

---

### Update Draft
**PUT** `/api/drafts/:id`

**Payload:**
```json
{ "title":"...","content":"..." }
```

---

### Delete Draft
**DELETE** `/api/drafts/:id`


## Wallpaper API

### Create Wallpaper
**POST** `/api/wallpapers`

**Payload:**
```json
{ "title":"...","description":"...","imageUrl":"...","category":"...","tags":["..."],"resolution":"..." }
```

---

### Get Wallpapers
**GET** `/api/wallpapers`

**Query:**
- `page`, `limit`, `search`, `category`

---

### Get Wallpaper by ID
**GET** `/api/wallpapers/:id`

---

### Top by Likes
**GET** `/api/wallpapers/top/likes`

---

### Top by Downloads
**GET** `/api/wallpapers/top/downloads`

---

### Like Wallpaper
**PUT** `/api/wallpapers/:id/like`

---

### Download Wallpaper
**PUT** `/api/wallpapers/:id/download`