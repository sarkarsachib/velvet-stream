# Firebase App Hosting

Velvet Stream is a TanStack Start application. Its production build is configured to emit a Node.js server bundle for Firebase App Hosting; Firebase App Hosting supplies the HTTPS endpoint, so there is no port to open manually.

## Connect this repository

1. In the Firebase Console, select or create the Firebase project and open **App Hosting**.
2. Connect the GitHub repository `sarkarsachib/velvet-stream` and select the deployment branch.
3. Set the application root to the repository root. The build command is `npm run build`; the production start command is `npm run start`.
4. Add no media credentials or source URLs to client-side environment variables. Server-only secrets, if needed for an authorized integration later, belong in App Hosting/Google Cloud Secret Manager.

Firebase App Hosting currently requires a Firebase project on the **Blaze** plan. Enabling billing is an account-level choice and may incur usage charges; do that in the Firebase Console only after reviewing the current pricing and setting any budget alerts you want.

## Current playback state

The catalog contains sample titles and the player intentionally shows a preview until an authorized media source is configured. This deployment setup does **not** port or enable the CloudStream provider modules. A future source adapter must be limited to media you own or are licensed to access and embed, with direct, authorized playback URLs. Do not expose provider credentials in browser code.

## References

- [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)
- [Firebase App Hosting framework support](https://firebase.blog/posts/2025/06/app-hosting-frameworks/)
- [TanStack Start hosting guide](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)
