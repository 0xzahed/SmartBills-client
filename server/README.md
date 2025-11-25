# SmartBills - Minimal Server (file-backed)

This folder contains a minimal Express server for local development and testing of the SmartBills client. It is intentionally simple and file-backed (no external DB) so you can quickly run and test `mybills` CRUD operations and ownership checks.

Files:

- `index.js` - the Express server
- `data/mybills.json` - storage file (created automatically)
- `package.json` - scripts and dependencies

Install and run locally:

```bash
cd server
npm install
# set env variables in your shell or in a .env file (do NOT commit .env to git)
# example: echo "PORT=3000" > .env
npm run dev
# or: npm start
```

Important security notes:

- Do NOT commit secrets into the repository. If you have pasted API keys or credentials into chat or files, rotate them immediately.
- This simple server looks for `x-user-email` header or `?email=` query or `body.email` to determine ownership. It's for development only — in production use a verified token (e.g. Firebase) and server-side token verification.

Next steps to integrate with real backend:

- Replace file storage with MongoDB or another DB.
- Add authentication middleware (verify Firebase ID tokens) and use `req.userEmail` as authoritative identity.
- Add rate limiting and proper input validation.

If you want, I can modify this server to connect to your MongoDB Atlas using your env variables, but do not paste secrets here — set them as env vars on the host or in your deployment provider.
