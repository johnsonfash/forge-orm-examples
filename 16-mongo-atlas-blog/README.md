# 16 · MongoDB (Atlas free tier)

Setup:

1. Create a free cluster at https://www.mongodb.com/cloud/atlas/register
2. Copy the connection string
3. `cp .env.example .env` and paste the URI into `DATABASE_URL`
4. `npm install && npm run dev`

This example uses `f.text().search()` which compiles to a Mongo text index. Atlas Vector Search is supported too — see `09-vector-rag` for the pattern.
