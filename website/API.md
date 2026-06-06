# WeTrends Blog API Documentation

> API for external integrations (n8n, custom scripts, etc.) to manage blog posts.
> **Authentication:** API Key via `x-api-key` header.

---

## Authentication

Every mutation request must include the API key in the header:

```http
x-api-key: n8n_wt_cbdc08ee40fafeec3f40f6fa766d93a0985e9d2ae8d6eeccccc6d2431501de11
Content-Type: application/json
```

**Failure response (401 Unauthorized):**
```json
{ "success": false, "message": "Unauthorized" }
```

---

## Base URL

| Environment | URL |
|-------------|-----|
| Production  | `https://wetrends.co.uk/api/blog` |
| Local Dev   | `http://localhost:3000/api/blog` |

> **Note:** All routes require a trailing slash (`/`) to avoid 308 redirects.

---

## Data Types & Validation

### MongoDB ObjectId
- 24-character hexadecimal string (e.g., `507f1f77bcf86cd799439011`)
- Regex: `/^[0-9a-fA-F]{24}$/`

### Slug Format
- Lowercase letters, numbers, and hyphens only
- Must start and end with alphanumeric
- Regex: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`
- Examples: `hello-world`, `post-123`, `my-blog-post`

### Published Logic
- `published: true` → sets `publishedAt` to current timestamp (if not already published)
- `published: false` → sets `publishedAt` to `null`

---

## Endpoints

### 1. Create Post — `POST /api/blog/`

Creates a new blog post.

#### Required Fields
| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Post title |
| `slug` | `string` | URL-safe unique identifier |
| `excerpt` | `string` | Short summary |
| `content` | `string` | HTML or markdown content |
| `authorId` | `string` | Valid User ObjectId (24-char hex) — optional |

#### Optional Fields
| Field | Type | Default |
|-------|------|---------|
| `featuredImage` | `string` (URL) | `null` |
| `published` | `boolean` | `false` |
| `metaTitle` | `string` | `null` |
| `metaDescription` | `string` | `null` |
| `keywords` | `string[]` | `[]` |
| `categoryId` | `string` (ObjectId) | `null` |

#### Validation Rules
- `slug` must be unique across all posts
- `slug` must match URL-safe format
- `authorId` (if provided) must exist in the `users` collection
- `categoryId` (if provided) must exist in the `blogCategories` collection

#### Request Example
```bash
curl -X POST http://localhost:3000/api/blog/ \
  -H "Content-Type: application/json" \
  -H "x-api-key: n8n_wt_cbdc08ee40fafeec3f40f6fa766d93a0985e9d2ae8d6eeccccc6d2431501de11" \
  -d '{
    "title": "How We Built the Rebrand",
    "slug": "how-we-built-the-rebrand",
    "excerpt": "A behind-the-scenes look at our latest brand identity project.",
    "content": "<p>We started with discovery...</p>",
    "published": true,
    "featuredImage": "https://res.cloudinary.com/.../image.jpg",
    "metaTitle": "How We Built the Rebrand | WeTrends",
    "metaDescription": "Behind the scenes of our latest rebrand.",
    "keywords": ["branding", "web design", "guildford"],
    "categoryId": "507f1f77bcf86cd799439022"
  }'
```

#### Success Response — `201 Created`
```json
{
  "success": true,
  "post": {
    "id": "6677a1b2c3d4e5f6g7h8i9j0",
    "title": "How We Built the Rebrand",
    "slug": "how-we-built-the-rebrand",
    "excerpt": "A behind-the-scenes look...",
    "content": "<p>We started with discovery...</p>",
    "featuredImage": "https://res.cloudinary.com/.../image.jpg",
    "published": true,
    "publishedAt": "2025-01-15T10:30:00.000Z",
    "views": 0,
    "metaTitle": "How We Built the Rebrand | WeTrends",
    "metaDescription": "Behind the scenes of our latest rebrand.",
    "keywords": ["branding", "web design", "guildford"],
    "categoryId": "507f1f77bcf86cd799439022",
    "authorId": "507f1f77bcf86cd799439011",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

#### Error Responses
| Status | Code | Message |
|--------|------|---------|
| `400` | validation | `"Validation failed"` + field errors |
| `400` | bad authorId | `"User with id '...' does not exist"` (only if authorId is provided) |
| `400` | bad categoryId | `"Category with id '...' does not exist"` |
| `401` | unauthorized | `"Unauthorized"` |
| `409` | duplicate | `"A post with this slug already exists"` |
| `500` | server | `"Failed to create blog post"` |

---

### 2. Update Post — `PATCH /api/blog/{id}/`

Updates an existing post. Send only fields you want to change.

#### Path Parameters
| Param | Type | Description |
|-------|------|-------------|
| `id` | `string` | Post MongoDB ObjectId |

#### Optional Fields (all)
Same as Create, minus `authorId` (can be included but is optional).

#### Validation Rules
- Post must exist
- `slug` (if changed) must be unique and URL-safe
- `authorId` (if provided) must exist in `users` collection
- `categoryId` (if provided) must exist in `blogCategories` collection

#### Request Example
```bash
curl -X PATCH http://localhost:3000/api/blog/6677a1b2c3d4e5f6g7h8i9j0/ \
  -H "Content-Type: application/json" \
  -H "x-api-key: n8n_wt_cbdc08ee40fafeec3f40f6fa766d93a0985e9d2ae8d6eeccccc6d2431501de11" \
  -d '{
    "title": "How We Built the Rebrand (Updated)",
    "published": false
  }'
```

#### Success Response — `200 OK`
```json
{
  "success": true,
  "post": {
    "id": "6677a1b2c3d4e5f6g7h8i9j0",
    "title": "How We Built the Rebrand (Updated)",
    "published": false,
    "publishedAt": null,
    ...
  }
}
```

#### Error Responses
| Status | Message |
|--------|---------|
| `400` | `"User with id '...' does not exist"` |
| `400` | `"Category with id '...' does not exist"` |
| `400` | `"Slug must be lowercase, hyphenated, and URL-safe"` |
| `401` | `"Unauthorized"` |
| `404` | `"Post not found"` |
| `409` | `"A post with this slug already exists"` |

---

### 3. Delete Post — `DELETE /api/blog/{id}/`

Deletes a post permanently.

#### Path Parameters
| Param | Type | Description |
|-------|------|-------------|
| `id` | `string` | Post MongoDB ObjectId |

#### Request Example
```bash
curl -X DELETE http://localhost:3000/api/blog/6677a1b2c3d4e5f6g7h8i9j0/ \
  -H "x-api-key: n8n_wt_cbdc08ee40fafeec3f40f6fa766d93a0985e9d2ae8d6eeccccc6d2431501de11"
```

#### Success Response — `200 OK`
```json
{
  "success": true,
  "message": "Post deleted"
}
```

#### Error Responses
| Status | Message |
|--------|---------|
| `401` | `"Unauthorized"` |
| `404` | `"Post not found"` |

---

### 4. Get Single Post — `GET /api/blog/{id}/`

Retrieves a single post by ID. **No API key required.**

#### Path Parameters
| Param | Type | Description |
|-------|------|-------------|
| `id` | `string` | Post MongoDB ObjectId |

#### Request Example
```bash
curl http://localhost:3000/api/blog/6677a1b2c3d4e5f6g7h8i9j0/
```

#### Success Response — `200 OK`
```json
{
  "success": true,
  "post": {
    "id": "6677a1b2c3d4e5f6g7h8i9j0",
    "title": "...",
    "slug": "...",
    "category": { "id": "...", "name": "...", "slug": "..." },
    "author": { "name": "...", "email": "..." },
    ...
  }
}
```

#### Error Responses
| Status | Message |
|--------|---------|
| `404` | `"Post not found"` |

---

## n8n Configuration Reference

### HTTP Request Node Settings

| Setting | Value |
|---------|-------|
| Method | `POST`, `PATCH`, or `DELETE` |
| URL | `https://wetrends.co.uk/api/blog/` |
| Authentication | `None` |
| Headers | `x-api-key` = your key |
| Body Content Type | `JSON` |

### Example n8n JSON Body (Create)
```json
{
  "title": "{{ $json.title }}",
  "slug": "{{ $json.title.toLowerCase().replace(/\\s+/g, '-') }}",
  "excerpt": "{{ $json.excerpt }}",
  "content": "{{ $json.content }}",
  "authorId": "507f1f77bcf86cd799439011",
  "published": true
}
```

---

## How to Find Valid IDs

### Author ID (`authorId`) — Optional
If you want to assign an author, you need a valid User `_id` from the MongoDB `users` collection. If omitted, the post will have no author.

**Option 1:** Log into the WeTrends admin dashboard (`/me`) and check your profile URL or database.

**Option 2:** Query the database directly:
```bash
# Using mongosh or MongoDB Compass
# Look for a user document and copy the _id field
db.users.findOne({ email: "your-email@example.com" })
```

### Category ID (`categoryId`)
Optional. If you want to assign a category:
```bash
# Using mongosh
db.blogCategories.findOne({ slug: "your-category-slug" })
```

---

## Common Pitfalls

1. **Missing trailing slash:** `/api/blog` returns `308`. Use `/api/blog/`.
2. **Fake ObjectIds:** `507f1f77bcf86cd799439011` looks valid but doesn't exist. Always use real IDs from your database.
3. **Duplicate slugs:** Slugs must be globally unique across all posts.
4. **Invalid slug format:** `My Post Title` or `my_post` will fail. Use `my-post-title`.
5. **Unpublished posts:** `published: false` means `publishedAt` is `null`. The post won't appear on the public blog listing.

---

## Files Involved

| File | Purpose |
|------|---------|
| `app/api/blog/route.ts` | `POST` handler |
| `app/api/blog/[id]/route.ts` | `GET`, `PATCH`, `DELETE` handlers |
| `lib/api-auth.ts` | API key validation |
| `lib/zod/blog.ts` | Request body Zod schemas |
| `actions/blog.ts` | Server actions (admin UI) |
| `prisma/schema.prisma` | Data models |
