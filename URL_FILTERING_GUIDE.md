# MAID V2 - URL Filtering Guide

## How URL Filtering Works

### 🔍 **Simple Substring Matching**

MAID V2 uses **simple text matching** to check if your filter appears anywhere in the download URL. This makes it very flexible and easy to use!

---

## ✅ **What You Need to Know**

### 1. **No Need for https:// or http://**
Just enter the part of the URL you want to match:
- ✅ `github.com`
- ✅ `drive.google.com`
- ✅ `dropbox.com`
- ❌ ~~`https://github.com`~~ (works, but unnecessary)

### 2. **One Filter = One URL Pattern**
- You **cannot** enter multiple URLs in one field like `google.com, google.eu`
- Instead, create **separate filters** for each:
  - Filter 1: `google.com` → `Google/US`
  - Filter 2: `google.eu` → `Google/EU`

### 3. **Matching is Case-Sensitive**
- `GitHub.com` ≠ `github.com`
- Recommendation: Use lowercase for consistency

### 4. **First Match Wins**
- If a download URL matches multiple filters, **only the first one** is applied
- Order matters! (You can reorder by using the sort dropdown)

---

## 📝 **Examples**

### Example 1: GitHub Downloads
**Filter:** `github.com`  
**Folder:** `Development/GitHub`

**Matches:**
- ✅ `https://github.com/user/repo/releases/download/v1.0/app.zip`
- ✅ `https://raw.githubusercontent.com/user/repo/main/file.txt`

### Example 2: Google Drive
**Filter:** `drive.google.com`  
**Folder:** `Cloud/GoogleDrive`

**Matches:**
- ✅ `https://drive.google.com/uc?export=download&id=123`
- ✅ `https://doc-0a-drive.google.com/file.pdf`

### Example 3: Specific Path Matching
**Filter:** `/downloads/premium/`  
**Folder:** `Premium/Downloads`

**Matches:**
- ✅ `https://example.com/downloads/premium/file.zip`
- ❌ `https://example.com/downloads/free/file.zip`

### Example 4: File Hosting Services
**Filter:** `amazonaws.com`  
**Folder:** `AWS/S3`

**Matches:**
- ✅ `https://bucket.s3.amazonaws.com/file.pdf`
- ✅ `https://s3-us-west-2.amazonaws.com/bucket/file.zip`

---

## 💡 **Pro Tips**

### Tip 1: Be Specific When Needed
- 🟡 `google.com` - Matches Google Drive, Docs, Gmail attachments, etc.
- 🟢 `drive.google.com` - Matches only Google Drive
- 🟢 `docs.google.com/export` - Matches only exported Google Docs

### Tip 2: Use Path Patterns
You can match specific URL paths:
- `/api/download/` - Matches API downloads
- `/attachments/` - Matches email attachments
- `/temp/` - Matches temporary files

### Tip 3: Match CDN URLs
Many files come from CDNs:
- `cdn.example.com`
- `cloudfront.net`
- `fastly.net`

### Tip 4: Test Your Filters
1. Add a filter
2. Download a test file from that site
3. Check if it goes to the right folder
4. Adjust the pattern if needed

---

## 🚫 **Common Mistakes**

### ❌ Multiple URLs in One Field
**Don't do:** `github.com, gitlab.com`  
**Instead:** Create two separate filters

### ❌ Too Generic Patterns
**Don't do:** `.com` (matches too many sites)  
**Instead:** Be specific: `example.com`

### ❌ Full URLs with Query Params
**Don't do:** `https://example.com/file?id=123&token=abc`  
**Instead:** `example.com/file` or just `example.com`

### ❌ Forgetting Case Sensitivity
**Don't do:** `GitHub.com` (won't match `github.com`)  
**Instead:** Use lowercase consistently

---

## 🎯 **Advanced Use Cases**

### Organizing by Project
```
github.com/company/project1   →  Work/Project1
github.com/company/project2   →  Work/Project2
github.com/personal           →  Personal/Coding
```

### Separating Development Environments
```
dev.example.com      →  Development/Staging
staging.example.com  →  Development/Staging
example.com/prod     →  Development/Production
```

### Organizing Course Materials
```
udemy.com            →  Education/Udemy
coursera.org         →  Education/Coursera
youtube.com/download →  Education/YouTube
```

---

## ❓ **FAQ**

**Q: Can I use wildcards like `*.github.com`?**  
A: No, but you don't need to! Just use `github.com` and it will match all subdomains.

**Q: Does it support regex patterns?**  
A: No, it's simple substring matching. This makes it faster and easier to use.

**Q: What if I want the same folder for multiple sites?**  
A: Create multiple filters pointing to the same folder:
- `github.com` → `Code`
- `gitlab.com` → `Code`
- `bitbucket.org` → `Code`

**Q: Can I match file types in URL filters?**  
A: Yes! For example: `.pdf` will match any URL containing `.pdf`  
But file type filters are better for this purpose.

**Q: Why isn't my filter working?**  
A: Check these:
1. Is the URL pattern correct? (check browser's download URL)
2. Is another filter matching first? (check sort order)
3. Is the pattern case-sensitive?

---

## 🔄 **Filter Priority**

When multiple conditions could apply:
1. **URL filters are checked first** (in order)
2. **File type filters are applied after**
3. If a URL filter matches, that folder is used
4. Then file type folders are added (e.g., `URLFolder/Images/`)

**Example:**
- URL filter: `github.com` → `Development`
- File type filter: Images → `Images/`
- **Result:** `Development/Images/screenshot.png`

---

**Remember:** The extension checks if your filter text appears **anywhere** in the download URL. Keep it simple and specific! 🎯
